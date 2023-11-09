using Fitlance.Controllers;
using Fitlance.Data;
using Fitlance.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Moq;

namespace Fitlance.Tests;

public class UsersUnitTests
{
    public DbContextOptions<FitlanceContext> BuildOptions()
    {
        var optionsBuilder = new DbContextOptionsBuilder<FitlanceContext>();
        optionsBuilder.UseInMemoryDatabase(databaseName: "TestDb");
        return optionsBuilder.Options;
    }

    public ServiceProvider BuildServiceProvider()
    {
        var services = new ServiceCollection();

        // Configure in-memory database
        services.AddDbContext<FitlanceContext>(options =>
            options.UseInMemoryDatabase("TestDb")
        );

        // Configure identity services
        services.AddIdentity<User, IdentityRole>()
            .AddEntityFrameworkStores<FitlanceContext>();

        services.AddLogging();


        return services.BuildServiceProvider();
    }

    [Fact]
    public async Task GetUsers_ReturnsOkResult_WithListOfUsers()
    {
        // Arrange
        var options = BuildOptions();
        var userStoreMock = new Mock<IUserStore<User>>();
        var userManager = new UserManager<User>(
            userStoreMock.Object, null, null, null, null, null, null, null, null
            );

        using (var context = new FitlanceContext(options))
        {
            context.Users.AddRange(GetTestUsers());
            await context.SaveChangesAsync();
        }

        // Act 
        using (var context = new FitlanceContext(options))
        {
            var controller = new UsersController(context, userManager);
            var result = await controller.GetUsers();

            // Assert
            var actionResult = Assert.IsType<OkObjectResult>(result.Result);
            var model = Assert.IsAssignableFrom<IEnumerable<User>>(actionResult.Value);
            Assert.Equal(3, model.Count()); 
            Assert.All(model, user => Assert.NotNull(user.UserName));  
            Assert.All(model, user => Assert.NotNull(user.Email));

        }
    }

    [Fact]
    public async Task FindTrainers_ReturnsOkResult_WithListOfTrainers()
    {
        var serviceProvider = BuildServiceProvider();
        await InitializeData(serviceProvider);

        var context = serviceProvider.GetRequiredService<FitlanceContext>();
        var userManager = serviceProvider.GetRequiredService<UserManager<User>>();

        var controller = new UsersController(context, userManager);
        var result = await controller.FindTrainers();

        // Assert
        var actionResult = Assert.IsType<OkObjectResult>(result.Result);
        var model = Assert.IsAssignableFrom<IEnumerable<User>>(actionResult.Value);
        Assert.Equal(2, model.Count());
        Assert.All(model, user => Assert.NotNull(user.UserName));
        Assert.All(model, user => Assert.NotNull(user.Email));
        Assert.All(model, async user => Assert.True(await userManager.IsInRoleAsync(user, "Trainer")));

        Cleanup(serviceProvider);
    }

    [Fact]
    public async Task GetUser_ReturnsOkResult_WithUser()
    {
        var serviceProvider = BuildServiceProvider();
        await InitializeData(serviceProvider);

        var context = serviceProvider.GetRequiredService<FitlanceContext>();
        var userManager = serviceProvider.GetRequiredService<UserManager<User>>();

        var controller = new UsersController(context, userManager);
        var testUserId = context.Users.First().Id;
        var result = await controller.GetUser(testUserId);

        // Assert
        var actionResult = Assert.IsType<OkObjectResult>(result.Result);
        var user = Assert.IsAssignableFrom<User>(actionResult.Value);
        Assert.Equal(testUserId, user.Id);

        Cleanup(serviceProvider);
    }



    [Fact]
    public async Task GetUser_ReturnsNotFound_WhenUserDoesNotExist()
    {
        var serviceProvider = BuildServiceProvider();
        await InitializeData(serviceProvider);

        var context = serviceProvider.GetRequiredService<FitlanceContext>();
        var userManager = serviceProvider.GetRequiredService<UserManager<User>>();

        var controller = new UsersController(context, userManager);
        var result = await controller.GetUser("nonexistentUserId");

        // Assert
        Assert.IsType<NotFoundResult>(result.Result);

        Cleanup(serviceProvider);
    }

    [Fact]
    public async Task PutUser_ReturnsOkResult_WithUpdatedUser()
    {
        var serviceProvider = BuildServiceProvider();
        await InitializeData(serviceProvider);

        var context = serviceProvider.GetRequiredService<FitlanceContext>();
        var userManager = serviceProvider.GetRequiredService<UserManager<User>>();

        var controller = new UsersController(context, userManager);
        var testUserId = context.Users.First().Id;  // Assume a user exists in context
        var updatedUser = new User { FirstName = "Updated", LastName = "User" };

        var result = await controller.PutUser(testUserId, updatedUser);

        // Assert
        var actionResult = Assert.IsType<OkObjectResult>(result);
        var user = Assert.IsAssignableFrom<User>(actionResult.Value);
        Assert.Equal("Updated", user.FirstName);
        Assert.Equal("User", user.LastName);

        Cleanup(serviceProvider);
    }

    [Fact]
    public async Task PutUser_ReturnsNotFound_WhenUserDoesNotExist()
    {
        var serviceProvider = BuildServiceProvider();
        await InitializeData(serviceProvider);

        var context = serviceProvider.GetRequiredService<FitlanceContext>();
        var userManager = serviceProvider.GetRequiredService<UserManager<User>>();

        var controller = new UsersController(context, userManager);
        var updatedUser = new User { FirstName = "Updated", LastName = "User" };

        var result = await controller.PutUser("nonexistentUserId", updatedUser);

        // Assert
        Assert.IsType<NotFoundObjectResult>(result);

        Cleanup(serviceProvider);
    }

    [Fact]
    public async Task DeleteUser_ReturnsNoContent_WhenUserExists()
    {
        var serviceProvider = BuildServiceProvider();
        await InitializeData(serviceProvider);
        var context = serviceProvider.GetRequiredService<FitlanceContext>();
        var userManager = serviceProvider.GetRequiredService<UserManager<User>>();

        var user = await userManager.FindByNameAsync("trainer1");
        var controller = new UsersController(context, userManager);

        var result = await controller.DeleteUser(user.Id);

        Assert.IsType<NoContentResult>(result);
        Assert.Null(await context.Users.FindAsync(user.Id));

        Cleanup(serviceProvider);
    }

    [Fact]
    public async Task DeleteUser_ReturnsNotFound_WhenUserDoesNotExist()
    {
        var serviceProvider = BuildServiceProvider();
        var context = serviceProvider.GetRequiredService<FitlanceContext>();
        var userManager = serviceProvider.GetRequiredService<UserManager<User>>();

        var controller = new UsersController(context, userManager);

        var result = await controller.DeleteUser("nonexistentUserId");

        Assert.IsType<NotFoundResult>(result);

        Cleanup(serviceProvider);
    }


    private static async Task InitializeData(ServiceProvider serviceProvider)
    {
        var userManager = serviceProvider.GetRequiredService<UserManager<User>>();
        var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        await SeedUsers(userManager, roleManager);
    }

    public void Cleanup(ServiceProvider serviceProvider)
    {
        var context = serviceProvider.GetRequiredService<FitlanceContext>();
        context.Database.EnsureDeleted();  // This will delete the in-memory database
    }


    public static async Task SeedUsers(UserManager<User> userManager, RoleManager<IdentityRole> roleManager)
    {
        // Ensure the roles exist
        if (!await roleManager.RoleExistsAsync("Trainer"))
            await roleManager.CreateAsync(new IdentityRole("Trainer"));
        if (!await roleManager.RoleExistsAsync("User"))
            await roleManager.CreateAsync(new IdentityRole("User"));

        // Create trainers
        var trainer1 = new User { UserName = "trainer1", Email = "trainer1@example.com" };
        await userManager.CreateAsync(trainer1, "Password123!");
        await userManager.AddToRoleAsync(trainer1, "Trainer");

        var trainer2 = new User { UserName = "trainer2", Email = "trainer2@example.com" };
        await userManager.CreateAsync(trainer2, "Password123!");
        await userManager.AddToRoleAsync(trainer2, "Trainer");

        // Create user
        var user = new User { UserName = "user1", Email = "user1@example.com" };
        await userManager.CreateAsync(user, "Password123!");
        await userManager.AddToRoleAsync(user, "User");
    }



    private List<User> GetTestUsers()
    {
        var users = new List<User>
        {
            new User
            {
                UserName = "john.doe",
                Email = "john.doe@example.com",
                CreateTime = DateTime.UtcNow.AddMonths(-1),
                FirstName = "John",
                LastName = "Doe",
                City = "New York",
                ZipCode = 10001,
                Bio = "Personal Trainer"
            },
            new User
            {
                UserName = "jane.doe",
                Email = "jane.doe@example.com",
                CreateTime = DateTime.UtcNow.AddMonths(-2),
                FirstName = "Jane",
                LastName = "Doe",
                City = "Los Angeles",
                ZipCode = 90001,
                Bio = "Yoga Instructor"
            },
            new User
            {
                UserName = "mike.smith",
                Email = "mike.smith@example.com",
                CreateTime = DateTime.UtcNow.AddMonths(-3),
                FirstName = "Mike",
                LastName = "Smith",
                City = "Chicago",
                ZipCode = 60601,
                Bio = "Nutritionist"
            }
        };
        return users;
    }
}
