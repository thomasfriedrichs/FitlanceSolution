using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Identity;
using Moq;

using Fitlance.Services;
using Fitlance.Controllers;
using Fitlance.Dtos;
using Fitlance.Entities;
using Fitlance.Data;
using Microsoft.EntityFrameworkCore;

namespace Fitlance.Tests;

public class AuthUnitTests
{
    private readonly Mock<IAuthenticationService> _authServiceMock;
    private readonly AuthController _authController;
    private readonly FitlanceContext _inMemoryContext;

    public AuthUnitTests()
    {
        _authServiceMock = new Mock<IAuthenticationService>();
        _authController = new AuthController(_authServiceMock.Object);
        _inMemoryContext = CreateInMemoryContext();
    }

    private static FitlanceContext CreateInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<FitlanceContext>()
            .UseInMemoryDatabase(databaseName: "InMemoryFitlanceDb")
            .Options;

        var context = new FitlanceContext(options);

        return context;
    }

    [Fact]
    public async Task Register_UserRegistersSuccessfully_ReturnsOkResult()
    {
        // Arrange
        var mockAuthService = new Mock<IAuthenticationService>();
        var registerRequest = new RegisterRequest { Email = "test@example.com", Username = "testuser", Password = "Test@1234" };
        mockAuthService.Setup(x => x.Register(It.IsAny<RegisterRequest>(), It.IsAny<HttpResponse>())).ReturnsAsync("RegistrationTokenString");

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

        mockAuthService.Setup(x => x.Register(It.IsAny<RegisterRequest>(), It.IsAny<HttpResponse>()))
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
        var mockResponse = new Mock<HttpResponse>();
        var registerRequest = new RegisterRequest { Email = "test@example.com", Username = "testuser", Password = "Test@1234", Role = "" };
        var mockConfiguration = new Mock<IConfiguration>();
        var mockUserManager = new Mock<UserManager<User>>(
            new Mock<IUserStore<User>>().Object,
            null, null, null, null, null, null, null, null);

        var mockContext = new Mock<FitlanceContext>(new DbContextOptions<FitlanceContext>());

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

        var authService = new AuthenticationService(mockUserManager.Object, mockConfiguration.Object, mockContext.Object);


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
}