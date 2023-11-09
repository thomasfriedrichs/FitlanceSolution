using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Moq;

using Fitlance.Services;
using Fitlance.Controllers;
using Fitlance.Dtos;
using Fitlance.Entities;
using Microsoft.AspNetCore.Identity;

namespace Fitlance.Tests;

public class AuthUnitTests
{
    private readonly Mock<IAuthenticationService> _authServiceMock;
    private readonly AuthController _authController;

    public AuthUnitTests()
    {
        _authServiceMock = new Mock<IAuthenticationService>();
        _authController = new AuthController(_authServiceMock.Object);
    }

    [Fact]
    public async Task Register_UserRegistersSuccessfully_ReturnsOkResult()
    {
        // Arrange
        var mockAuthService = new Mock<IAuthenticationService>();
        var registerRequest = new RegisterRequest { Email = "test@example.com", Username = "testuser", Password = "Test@1234" };
        mockAuthService.Setup(x => x.Register(It.IsAny<RegisterRequest>())).ReturnsAsync("RegistrationTokenString");

        var mockCookies = new Mock<IResponseCookies>();
        var mockResponse = new Mock<HttpResponse>();
        mockResponse.SetupGet(r => r.Cookies).Returns(mockCookies.Object);

        var mockHttpContext = new Mock<HttpContext>();
        mockHttpContext.SetupGet(x => x.Response).Returns(mockResponse.Object);

        var controller = new AuthController(mockAuthService.Object)
        {
            ControllerContext = new ControllerContext()
            {
                HttpContext = mockHttpContext.Object
            }
        };

        // Act
        var result = await controller.Register(registerRequest);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal("RegistrationTokenString", okResult.Value);
    }

    [Fact]
    public async Task Register_WithExistingEmail_ThrowsArgumentException()
    {
        // Arrange
        var mockAuthService = new Mock<IAuthenticationService>();
        var registerRequest = new RegisterRequest { Email = "existing@example.com", Username = "existinguser", Password = "Test@1234" };

        mockAuthService.Setup(x => x.Register(It.IsAny<RegisterRequest>()))
                       .ThrowsAsync(new ArgumentException($"User with email {registerRequest.Email} already exists."));

        var mockHttpContext = new Mock<HttpContext>();
        var mockResponse = new Mock<HttpResponse>();
        mockHttpContext.SetupGet(x => x.Response).Returns(mockResponse.Object);

        var controller = new AuthController(mockAuthService.Object)
        {
            ControllerContext = new ControllerContext()
            {
                HttpContext = mockHttpContext.Object
            }
        };

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() => controller.Register(registerRequest));
    }

    [Fact]
    public async Task Register_WithNoRole_ThrowsArgumentException()
    {
        // Arrange
        var registerRequest = new RegisterRequest { Email = "test@example.com", Username = "testuser", Password = "Test@1234", Role = "" };
        var mockConfiguration = new Mock<IConfiguration>();
        var mockUserManager = new Mock<UserManager<User>>(
            new Mock<IUserStore<User>>().Object,
            null, null, null, null, null, null, null, null);

        mockUserManager.Setup(x => x.CreateAsync(It.IsAny<User>(), It.IsAny<string>()))
                       .ReturnsAsync(IdentityResult.Success);
        mockUserManager.Setup(x => x.FindByEmailAsync(It.IsAny<string>()))
                       .ReturnsAsync((User)null);
        mockUserManager.Setup(x => x.FindByNameAsync(It.IsAny<string>()))
                       .ReturnsAsync((User)null);
        mockUserManager.Setup(x => x.AddToRoleAsync(It.IsAny<User>(), It.IsAny<string>()))
                       .ReturnsAsync(IdentityResult.Success); 

        // Simulating that AddToRole will throw an exception when an invalid role is provided
        mockUserManager.Setup(x => x.AddToRoleAsync(It.IsAny<User>(), ""))
                       .ThrowsAsync(new ArgumentException("Unable to register user, role required"));

        var authService = new AuthenticationService(mockUserManager.Object, mockConfiguration.Object);


        var controller = new AuthController(authService)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext() 
            }
        };

        // Act & Assert
        var exception = await Assert.ThrowsAsync<ArgumentException>(() => controller.Register(registerRequest));
        Assert.Equal("Unable to register user, role required", exception.Message);
    }


    [Fact]
    public async Task Login_UserLogsInSuccessfully_ReturnsOkResult()
    {
        // Arrange
        var mockAuthService = new Mock<IAuthenticationService>();
        var loginRequest = new LoginRequest { Email = "test@example.com", Password = "Test@1234" };
        mockAuthService.Setup(x => x.Login(It.IsAny<LoginRequest>())).ReturnsAsync("LoginTokenString");

        var mockCookies = new Mock<IResponseCookies>();
        var mockResponse = new Mock<HttpResponse>();
        mockResponse.SetupGet(r => r.Cookies).Returns(mockCookies.Object);

        var mockHttpContext = new Mock<HttpContext>();
        mockHttpContext.SetupGet(x => x.Response).Returns(mockResponse.Object);

        var controller = new AuthController(mockAuthService.Object)
        {
            ControllerContext = new ControllerContext()
            {
                HttpContext = mockHttpContext.Object
            }
        };

        // Act
        var result = await controller.Login(loginRequest);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal("LoginTokenString", okResult.Value);
    }



}
