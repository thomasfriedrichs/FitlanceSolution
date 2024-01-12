using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Moq;
using Xunit.Abstractions;

using Fitlance.Data;
using Fitlance.Dtos;
using Fitlance.Entities;
using Fitlance.Services;
using Azure;

namespace Fitlance.Tests;

public class AuthenticationServiceTests
{
    private readonly UserManager<User> _userManager;
    private readonly Mock<IConfiguration> _configurationMock;
    private readonly Mock<ILogger<AuthenticationService>> _loggerMock;
    private readonly AuthenticationService _authenticationService;
    private readonly FitlanceContext _context;
    private readonly ITestOutputHelper _output;
    private readonly RoleManager<IdentityRole> _roleManager;

    public AuthenticationServiceTests(ITestOutputHelper output)
    { 
        _output = output;

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
        _output.WriteLine($"User role creation result: {userRoleResult.Succeeded}");
        if (!userRoleResult.Succeeded)
        {
            throw new InvalidOperationException("Failed to create 'User' role.");
        }


        _context.SaveChangesAsync().Wait();

        _configurationMock = new Mock<IConfiguration>();
        _configurationMock.Setup(c => c["JWT:Secret"]).Returns("YourLongSecretKeyHereWithAtLeast32Characters");

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
            Username = "JohnAdams",
            Email = "JohnAdams@gmail.com",
            Password = "Password123!",
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
        // Arrange: Create a user
        var user = new User { Email = "test@example.com", UserName = "testUser" };
        await _userManager.CreateAsync(user, "Test@1234");

        var loginRequest = new LoginRequest
        {
            Email = "test@example.com",
            Password = "Test@1234"
        };

        var context = new DefaultHttpContext(); // Create a new HttpContext
        var response = context.Response; // Get the Response from the context

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
        // Arrange: Create a user
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


}