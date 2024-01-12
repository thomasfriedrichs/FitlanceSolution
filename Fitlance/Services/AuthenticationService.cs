using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;
using System.Security.Claims;
using System.Text;

using Fitlance.Dtos;
using Fitlance.Data;
using Fitlance.Entities;
using Fitlance.Constants;

namespace Fitlance.Services;

public class AuthenticationService(UserManager<User> userManager, IConfiguration configuration, FitlanceContext context, ILogger logger) : IAuthenticationService
{
    private readonly UserManager<User> _userManager = userManager;
    private readonly IConfiguration _configuration = configuration;
    private readonly FitlanceContext _context = context;
    private readonly ILogger _logger = logger;

    public async Task<string> Register(RegisterRequest request, HttpResponse response)
    {
        bool userExists = await CheckIfUserExists(request, _userManager);
        
        if (userExists)
        {
            throw new ArgumentException($"User with email {request.Email} already exists.");
        }

        User user = new()
        {
            Email = request.Email,
            UserName = request.Username,
            SecurityStamp = Guid.NewGuid().ToString()
        };

        var result = await _userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
        {
            throw new ArgumentException($"Unable to register user {request.Username} error: {GetErrorsText(result.Errors)}");
        }
        
        await AddToRole(request.Role, user, _userManager);

        return await Login(new LoginRequest { Email = request.Email, Password = request.Password }, response );

    }

    public async Task<string> Login(LoginRequest request, HttpResponse response)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);

        if (user is null)
        {
            throw new ArgumentException($"User with email: {request.Email} Not Found");
        }

        if (!await _userManager.CheckPasswordAsync(user, request.Password))
        {
            throw new ArgumentException("Invalid login attempt.");
        }

        var authClaims = new List<Claim>
        {
            new (ClaimTypes.Name, user.NormalizedUserName),
            new(ClaimTypes.Email, user.Email),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        };

        var userRole = await _userManager.GetRolesAsync(user);

        if (userRole is not null && userRole.Any())
        {
            authClaims.AddRange(userRole.Select(role => new Claim(ClaimTypes.Role, role)));
        }

        authClaims.Add(new Claim(ClaimTypes.Sid, user.Id));

        authClaims.Add(new Claim("cStamp", user.ConcurrencyStamp));

        var accessToken = GetToken(authClaims);
        SetAccessTokenAsCookie(accessToken, response);

        var refreshToken = await GenerateRefreshToken(user.Id);
        SetRefreshTokenAsCookie(refreshToken, response);

        return JsonConvert.SerializeObject(new { user.Id, userRole });

    }

    public async Task<ActionResult> Logout(string userId, HttpResponse response)
    {
        var refreshToken = await _context.RefreshTokens.FirstOrDefaultAsync(rt => rt.UserId == userId && !rt.IsRevoked);
        if (refreshToken != null)
        {
            refreshToken.IsRevoked = true;
            _context.Update(refreshToken);
            await _context.SaveChangesAsync();
        }

        ClearTokenCookies(response);

        return new OkResult();
    }

    public async Task<(bool IsSuccess, string Message)> RefreshToken(HttpRequest request, HttpResponse response)
    {
        var refreshTokenId = request.Cookies["RefreshTokenId"];
        var refreshToken = request.Cookies["RefreshToken"];

        Console.WriteLine($"Received RefreshTokenId: {refreshTokenId}");
        Console.WriteLine($"Received RefreshToken: {refreshToken}");
        Console.WriteLine($"Received Request: {request}");



        try
        {
            var user = await ValidateRefreshToken(refreshTokenId,refreshToken) ?? throw new SecurityTokenException("Invalid refresh token");

            var authClaims = new List<Claim>
            {
                new(ClaimTypes.Name, user.UserName),
                new(ClaimTypes.Email, user.Email),
                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            var userRoles = await _userManager.GetRolesAsync(user);
            foreach (var userRole in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, userRole));
            }

            var accessToken = GetToken(authClaims);
            SetAccessTokenAsCookie(accessToken, response);
            var newRefreshToken = await GenerateRefreshToken(user.Id);
            SetRefreshTokenAsCookie(newRefreshToken, response);
            await InvalidateRefreshToken(refreshToken);

            return (true, "Token refreshed successfully");
        }
        catch (SecurityTokenException ex)
        {
            return (false, ex.Message);
        }
    }


    private static void ClearTokenCookies(HttpResponse response)
    {
        response.Cookies.Delete("AccessToken");
        response.Cookies.Delete("RefreshToken");
    }


    private static async Task<bool> CheckIfUserExists(RegisterRequest request, UserManager<User> userManager)
    {
        var user = await userManager.FindByEmailAsync(request.Email)
              ?? await userManager.FindByNameAsync(request.Username);

        return user != null;
    }

    private static async Task<IdentityResult> AddToRole(string role, User user, UserManager<User> userManager)
    {
        if (role == "User")
        {
            var result = await userManager.AddToRoleAsync(user, RoleConstants.User);

            return result;
        }
        else if (role == "Trainer")
        {
            var result = await userManager.AddToRoleAsync(user, RoleConstants.Trainer);

            return result;
        }
        else
        {
            throw new ArgumentException($"Unable to register user, role required");
        }
    }   

    private async Task InvalidateRefreshToken(string refreshToken)
    {
        var refreshTokenEntity = await _context.RefreshTokens
                                               .FirstOrDefaultAsync(rt => rt.Token == refreshToken);
        if (refreshTokenEntity != null)
        {
            refreshTokenEntity.IsRevoked = true;
            _context.Update(refreshTokenEntity);
            await _context.SaveChangesAsync();
        }
    }


    public async Task<User> ValidateRefreshToken(string refreshTokenId, string refreshTokenValue)
    {
        if (!Guid.TryParse(refreshTokenId, out Guid guid))
        {
            _logger.LogWarning("Invalid GUID format for refresh token id.");
            return null;
        }

        var refreshTokenEntity = await _context.RefreshTokens
                                               .Include(rt => rt.User)
                                               .SingleOrDefaultAsync(rt => rt.Id == guid);

        if (refreshTokenEntity == null || refreshTokenEntity.IsRevoked || refreshTokenEntity.ExpiryTime < DateTime.UtcNow)
        {
            return null;
        }

        var hashedToken = GenerateSaltedHash(refreshTokenValue, refreshTokenEntity.Salt);
        if (hashedToken != refreshTokenEntity.Token)
        {
            return null;
        }

        return refreshTokenEntity.User;
    }


    public async Task<RefreshToken> GenerateRefreshToken(string userId)
    {
        var tokenString = GenerateRefreshTokenString();
        var salt = Guid.NewGuid().ToString();
        var hashedToken = GenerateSaltedHash(tokenString, salt);

        var refreshToken = new RefreshToken
        {
            Id = Guid.NewGuid(),  
            UserId = userId,
            Token = hashedToken, 
            Salt = salt,  
            ExpiryTime = DateTime.UtcNow.AddDays(7),
            IsRevoked = false
        };

        _context.RefreshTokens.Add(refreshToken);
        await _context.SaveChangesAsync();

        return new RefreshToken
        {
            Id = refreshToken.Id,
            Token = tokenString,
            ExpiryTime = refreshToken.ExpiryTime,
        };
    }

    public static string GenerateSaltedHash(string data, string salt)
    {
        var saltedData = $"{salt}{data}";
        byte[] bytes = SHA256.HashData(Encoding.UTF8.GetBytes(saltedData));
        return Convert.ToBase64String(bytes);
    }

    private static string GenerateRefreshTokenString()
    {
        var randomNumber = new byte[32];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
    }

    private static void SetAccessTokenAsCookie(JwtSecurityToken token, HttpResponse response)
    {
        var encodedToken = new JwtSecurityTokenHandler().WriteToken(token);
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Expires = token.ValidTo,
            Secure = true 
        };
        response.Cookies.Append("AccessToken", encodedToken, cookieOptions);
    }


    private static void SetRefreshTokenAsCookie(RefreshToken refreshToken, HttpResponse response)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Expires = refreshToken.ExpiryTime,
            Secure = true
        };
        response.Cookies.Append("RefreshTokenId", refreshToken.Id.ToString(), cookieOptions);
        response.Cookies.Append("RefreshToken", refreshToken.Token, cookieOptions);
    }


    private JwtSecurityToken GetToken(IEnumerable<Claim> authClaims)
    {
        var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));

        var token = new JwtSecurityToken(
            issuer: _configuration["JWT:ValidIssuer"],
            audience: _configuration["JWT:ValidAudience"],
            expires: DateTime.Now.AddHours(3),
            claims: authClaims,
            signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256));

        return token;
    }

    private static string GetErrorsText(IEnumerable<IdentityError> errors)
    {
        return string.Join(", ", errors.Select(error => error.Description).ToArray());
    }
}