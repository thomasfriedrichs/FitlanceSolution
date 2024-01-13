using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Moq;

using Fitlance.Data;
using Fitlance.Dtos;
using Fitlance.Entities;
using Fitlance.Services;
using Azure;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Fitlance.Tests;

public class AuthenticationServiceTests
{
    private readonly UserManager<User> _userManager;
    private readonly Mock<IConfiguration> _configurationMock;
    private readonly Mock<ILogger<AuthenticationService>> _loggerMock;
    private readonly AuthenticationService _authenticationService;
    private readonly FitlanceContext _context;
    private readonly RoleManager<IdentityRole>? _roleManager;

    public AuthenticationServiceTests()
    { 

        var options = new DbContextOptionsBuilder<FitlanceContext>()
            .UseInMemoryDatabase(databaseName: "TestDb")
            .Options;
        _context = new FitlanceContext(options);

        var userStore = new UserStore<User>(_context);
        _userManager = new UserManager<User>(
            userStore,
            null,
            new PasswordHasher<User>(),
            new IUserValidator<User>[0],
            new IPasswordValidator<User>[0],
            null,
            null,
            null,
            new Mock<ILogger<UserManager<User>>>().Object);

        // Create roles
        var roleStore = new RoleStore<IdentityRole>(_context);
        var roleManager = new RoleManager<IdentityRole>(
            roleStore,
            new IRoleValidator<IdentityRole>[0],
            null,
            new IdentityErrorDescriber(),
            null);

        var userRoleResult = roleManager.CreateAsync(new IdentityRole("User")).Result;
        var trainerRoleResult = roleManager.CreateAsync(new IdentityRole("Trainer")).Result;
        if (!userRoleResult.Succeeded)
        {
            throw new InvalidOperationException("Failed to create 'User' role.");
        }


        _context.SaveChangesAsync().Wait();

        _configurationMock = new Mock<IConfiguration>();
        _configurationMock.Setup(c => c["JWT:Secret"]).Returns("oqJDaGQkCOdqTFQ-rB87UmpFB6mxbQa39MI8QfZmLpg\r\n");

        _loggerMock = new Mock<ILogger<AuthenticationService>>();

        _authenticationService = new AuthenticationService(
            _userManager,
            _configurationMock.Object,
            _context,
            _loggerMock.Object);
    }



    [Fact]
    public async Task Register_SuccessfulRegistration_ReturnsToken()
    {
        // Arrange
        var registerRequest = new RegisterRequest
        {
            Username = "JohnAdams12",
            Email = "JohnAdams12@gmail.com",
            Password = "Password12345!",
            Role = "User" 
        };

        // Act
        var result = await _authenticationService.Register(registerRequest, new DefaultHttpContext().Response);

        // Assert
        Assert.NotNull(result);
    }

    [Fact]
    public async Task Register_UserAlreadyExists_ThrowsArgumentException()
    {
        // Arrange
        var existingUser = new User { Email = "JohnAdams@gmail.com", UserName = "JohnAdams" };
        await _userManager.CreateAsync(existingUser, "ExistingPassword123!");

        var registerRequest = new RegisterRequest
        {
            Username = "JohnAdams",
            Email = "JohnAdams@gmail.com",
            Password = "Password123!",
            Role = "User"
        };

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() =>
            _authenticationService.Register(registerRequest, new DefaultHttpContext().Response));
    }


    [Fact]
    public async Task Register_FailureToCreateUser_ThrowsArgumentException()
    {
        // Arrange
        var existingUser = new User { Email = "existing@example.com", UserName = "ExistingUser" };
        await _userManager.CreateAsync(existingUser, "Password123!");

        var registerRequest = new RegisterRequest
        {
            Username = "ExistingUser", 
            Email = "existing@example.com", 
            Password = "Password123!",
            Role = "User"
        };

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() =>
            _authenticationService.Register(registerRequest, new DefaultHttpContext().Response));
    }


    [Fact]
    public async Task Login_WithValidCredentials_SetsCookies()
    {
        // Arrange
        var user = new User { Email = "test@example.com", UserName = "testUser" };
        await _userManager.CreateAsync(user, "Test@1234");

        var loginRequest = new LoginRequest
        {
            Email = "test@example.com",
            Password = "Test@1234"
        };

        var context = new DefaultHttpContext(); 
        var response = context.Response; 

        // Act
        var result = await _authenticationService.Login(loginRequest, response);

        // Assert
        var cookies = response.Headers["Set-Cookie"].ToArray();
        Assert.NotEmpty(cookies);

        var accessTokenSet = cookies.Any(cookie => cookie.StartsWith("AccessToken="));
        var refreshTokenSet = cookies.Any(cookie => cookie.StartsWith("RefreshToken="));

        Assert.True(accessTokenSet, "Access token cookie should be set.");
        Assert.True(refreshTokenSet, "Refresh token cookie should be set.");
        Assert.NotNull(result);
    }


    [Fact]
    public async Task Login_WithInvalidEmail_ThrowsArgumentException()
    {
        // Arrange
        var loginRequest = new LoginRequest
        {
            Email = "nonexistent@example.com",
            Password = "Test@1234"
        };

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() =>
            _authenticationService.Login(loginRequest, new DefaultHttpContext().Response));
    }

    [Fact]
    public async Task Login_WithIncorrectPassword_ThrowsArgumentException()
    {
        // Arrange
        var user = new User { Email = "test@example.com", UserName = "testUser" };
        await _userManager.CreateAsync(user, "Test@1234");

        var loginRequest = new LoginRequest
        {
            Email = "test@example.com",
            Password = "WrongPassword"
        };

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() =>
            _authenticationService.Login(loginRequest, new DefaultHttpContext().Response));
    }

    [Fact]
    public async Task Logout_UserLogsOutSuccessfully_ClearsCookies()
    {
        // Arrange
        var user = new User { Email = "test12@example.com", UserName = "213testUser" };
        await _userManager.CreateAsync(user, "Test@1234123");

        var context = new DefaultHttpContext();
        await _authenticationService.Login(new LoginRequest { Email = "test12@example.com", Password = "Test@1234123" }, context.Response);

        // Act
        await _authenticationService.Logout(user.Id, context.Response);

        // Assert
        var cookies = context.Response.Headers.SetCookie.ToArray();
        Assert.NotEmpty(cookies);

        var accessTokenCleared = cookies.Any(cookie => cookie.StartsWith("AccessToken=") && cookie.Contains("expires="));
        var refreshTokenCleared = cookies.Any(cookie => cookie.StartsWith("RefreshToken=") && cookie.Contains("expires="));

        Assert.True(accessTokenCleared, "Access token cookie should be cleared.");
        Assert.True(refreshTokenCleared, "Refresh token cookie should be cleared.");
    }

    [Fact]
    public async Task Logout_InvalidUser_NoExceptionThrown()
    {
        // Arrange
        var context = new DefaultHttpContext();

        // Act & Assert
        var exception = await Record.ExceptionAsync(() =>
            _authenticationService.Logout("NonExistentUserId", context.Response));

        Assert.Null(exception); 
    }

    [Fact]
    public async Task RefreshToken_WithOutdatedAccessToken_ReturnsNewToken()
    {
        // Arrange
        var user = new User { Email = "test@example.com", UserName = "testUser" };
        await _userManager.CreateAsync(user, "Test@1234");
        var refreshTokenValue = Guid.NewGuid().ToString();
        var outdatedAccessToken = GenerateExpiredAccessToken(user);
        var validRefreshToken = await GenerateValidRefreshToken( user.Id, refreshTokenValue);
        var refreshTokenId = validRefreshToken.Id.ToString();
        var context = new DefaultHttpContext();
        await AppendTokensToResponse(context.Response, outdatedAccessToken, refreshTokenValue, refreshTokenId);
        var responseCookies = ExtractCookiesFromResponse(context.Response);
        var formattedCookieHeader = FormatCookieHeader(responseCookies);
        var newRequestContext = new DefaultHttpContext();
        newRequestContext.Request.Headers["Cookie"] = formattedCookieHeader;

        // Act
        var (IsSuccess, Message) = await _authenticationService.RefreshToken(newRequestContext.Request, new DefaultHttpContext().Response);

        // Assert
        Assert.Equal("Token refreshed successfully", Message);
        Assert.True(IsSuccess, "Expected IsSuccess to be true.");
    }

    [Fact]
    public async Task RefreshToken_WithExpiredRefreshToken_ReturnsFailure()
    {
        // Arrange
        var user = new User { Email = "expired@example.com", UserName = "expiredUser" };
        await _userManager.CreateAsync(user, "Expired@1234");
        var refreshTokenValue = Guid.NewGuid().ToString();
        var expiredAccessToken = GenerateExpiredAccessToken(user);
        var expiredRefreshToken = await GenerateExpiredRefreshToken(user.Id, refreshTokenValue);
        var refreshTokenId = expiredRefreshToken.Id.ToString();
        var context = new DefaultHttpContext();
        await AppendTokensToResponse(context.Response, expiredAccessToken, refreshTokenValue, refreshTokenId);
        var responseCookies = ExtractCookiesFromResponse(context.Response);
        var formattedCookieHeader = FormatCookieHeader(responseCookies);
        var newRequestContext = new DefaultHttpContext();
        newRequestContext.Request.Headers.Cookie = formattedCookieHeader;

        // Act
        var (IsSuccess, Message) = await _authenticationService.RefreshToken(newRequestContext.Request, new DefaultHttpContext().Response);

        // Assert
        Assert.False(IsSuccess, "Expected IsSuccess to be false for an expired refresh token.");
        Assert.Equal("Invalid refresh token", Message); 
    }


    private static string GenerateExpiredAccessToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("oqJDaGQkCOdqTFQ-rB87UmpFB6mxbQa39MI8QfZmLpg\r\n"));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
        new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
        new Claim(JwtRegisteredClaimNames.Email, user.Email),
    };

        var token = new JwtSecurityToken(
            issuer: "YourIssuer",
            audience: "YourAudience",
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(-30), // Set to a past time to simulate outdated token
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private async Task<RefreshToken> GenerateExpiredRefreshToken(string userId, string tokenValue)
    {
        var salt = "wkjerbgf39478ht3975hbf2";
        var hashedToken = AuthenticationService.GenerateSaltedHash(tokenValue, salt);

        var expiredRefreshToken = new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Token = hashedToken, 
            ExpiryTime = DateTime.UtcNow.AddDays(-1), // Set expiry time in the past to ensure the token is expired
            Salt = salt,
            IsRevoked = false
        };

        _context.RefreshTokens.Add(expiredRefreshToken);
        await _context.SaveChangesAsync();

        return expiredRefreshToken;
    }


    private async Task<RefreshToken> GenerateValidRefreshToken(string userId, string refreshTokenValue)
    {
        var salt = "wieudhbfiwebcwiebu273846273";
        var hashedToken = AuthenticationService.GenerateSaltedHash(refreshTokenValue, salt);

        var refreshToken = new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Token = hashedToken,
            ExpiryTime = DateTime.UtcNow.AddDays(7),
            Salt = salt,
            IsRevoked = false
        };

        _context.RefreshTokens.Add(refreshToken);
        await _context.SaveChangesAsync();

        return refreshToken;
    }

    private static async Task AppendTokensToResponse(HttpResponse response, string accessToken, string refreshToken, string refreshTokenId)
    {
        response.Cookies.Append("AccessToken", accessToken, new CookieOptions { HttpOnly = true, Secure = true });
        response.Cookies.Append("RefreshToken", refreshToken, new CookieOptions { HttpOnly = true, Secure = true });
        response.Cookies.Append("RefreshTokenId", refreshTokenId, new CookieOptions { HttpOnly = true, Secure = true });

        await Task.CompletedTask;
    }


    private static string ExtractCookiesFromResponse(HttpResponse response)
    {
        var setCookieHeaders = response.Headers.SetCookie;
        return string.Join("; ", setCookieHeaders);
    }


    private static string FormatCookieHeader(string setCookieHeader)
    {
        var cookieParts = setCookieHeader.Split(new[] { ';' }, StringSplitOptions.RemoveEmptyEntries)
                                         .Where(part => part.Contains("AccessToken=") ||
                                                        part.Contains("RefreshToken=") ||
                                                        part.Contains("RefreshTokenId="))
                                         .ToArray();

        return string.Join("; ", cookieParts);
    }


}