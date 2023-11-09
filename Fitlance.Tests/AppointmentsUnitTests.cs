using Fitlance.Data;
using Fitlance.Controllers;
using Fitlance.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;

namespace Fitlance.Tests;

public class AppointmentsUnitTests
{
    public DbContextOptions<FitlanceContext> BuildOptions(string dbName)
    {
        var optionsBuilder = new DbContextOptionsBuilder<FitlanceContext>();
        optionsBuilder.UseInMemoryDatabase(databaseName: dbName);
        return optionsBuilder.Options;
    }

    [Fact]
    public async Task GetUserAppointments_ReturnsOkResult_WithAListOfAppointments()
    {
        // Arrange
        var options = BuildOptions("get1");


        // Insert seed data into the in-memory database
        using (var context = new FitlanceContext(options))
        {
            context.Appointments.AddRange(GetTestAppointments());
            context.SaveChanges();
        }

        // Act
        using (var context = new FitlanceContext(options))
        {
            var controller = new AppointmentsController(context);
            var result = await controller.GetUserAppointments("Client1");

            // Assert
            var actionResult = Assert.IsType<OkObjectResult>(result.Result);
            var model = Assert.IsAssignableFrom<IEnumerable<Appointment>>(actionResult.Value);
            Assert.Equal(2, model.Count());
        }
    }

    [Fact]
    public async Task GetTrainerAppointments_ReturnsOkResult_WithAListOfAppointments()
    {
        // Arrange
        var options = BuildOptions("Get2");

        using (var context = new FitlanceContext(options))
        {
            context.Appointments.AddRange(GetTestAppointments());
            await context.SaveChangesAsync();
        }

        // Act
        using (var context = new FitlanceContext(options))
        {
            var controller = new AppointmentsController(context);
            var result = await controller.GetTrainerAppointments("Trainer1");

            // Assert
            var actionResult = Assert.IsType<OkObjectResult>(result.Result);
            var model = Assert.IsAssignableFrom<IEnumerable<Appointment>>(actionResult.Value);
            Assert.Equal(3, model.Count()); 
        }
    }

    [Fact]
    public async Task GetAppointment_ReturnsOkResult_WithAnAppointment()
    {
        // Arrange
        var options = BuildOptions("Get3");

        using (var context = new FitlanceContext(options))
        {
            context.Appointments.AddRange(GetTestAppointments());
            await context.SaveChangesAsync();
        }

        // Act
        using (var context = new FitlanceContext(options))
        {
            var controller = new AppointmentsController(context);
            var result = await controller.GetAppointment(1);  

            // Assert
            var actionResult = Assert.IsType<OkObjectResult>(result.Result);
            var model = Assert.IsAssignableFrom<Appointment>(actionResult.Value);
            Assert.Equal(1, model.Id);
        }
    }

    [Fact]
    public async Task PutAppointment_ReturnsOkResult_WithUpdatedAppointment()
    {
        // Arrange
        var options = BuildOptions("Put1");

        using (var context = new FitlanceContext(options))
        {
            context.Appointments.AddRange(GetTestAppointments());
            await context.SaveChangesAsync();
        }

        var updatedAppointment = new Appointment
        {
            City = "UpdatedCity",
            Country = "UpdatedCountry",
            State = "UpdatedState",
            StreetAddress = "UpdatedStreetAddress",
            PostalCode = "UpdatedPostalCode",
            Latitude = 55.55,
            Longitude = 44.44,
            StartTimeUtc = DateTime.UtcNow.AddHours(2),
            EndTimeUtc = DateTime.UtcNow.AddHours(3),
        };

        // Act
        using (var context = new FitlanceContext(options))
        {
            var controller = new AppointmentsController(context);
            var result = await controller.PutAppointment(1, updatedAppointment);

            // Assert
            var actionResult = Assert.IsType<OkObjectResult>(result);
            var model = Assert.IsAssignableFrom<Appointment>(actionResult.Value);
            Assert.Equal("UpdatedCity", model.City);
            Assert.Equal("UpdatedCountry", model.Country);
            Assert.Equal("UpdatedState", model.State);
            Assert.Equal("UpdatedStreetAddress", model.StreetAddress);
            Assert.Equal("UpdatedPostalCode", model.PostalCode);
            Assert.Equal(55.55, model.Latitude);
            Assert.Equal(44.44, model.Longitude);
            Assert.Equal(updatedAppointment.StartTimeUtc, model.StartTimeUtc);
            Assert.Equal(updatedAppointment.EndTimeUtc, model.EndTimeUtc);
        }
        
    }

    [Fact]
    public async Task PostAppointment_ReturnsCreatedResult_WithNewAppointment()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<FitlanceContext>()
            .UseInMemoryDatabase(databaseName: "PostAppointmentDatabase")
            .Options;

        var newAppointment = new Appointment
        {
            ClientId = "Client1",
            TrainerId = "Trainer1",
            CreateTimeUtc = DateTime.UtcNow.AddDays(-10),
            UpdateTimeUtc = DateTime.UtcNow.AddDays(-7),
            StartTimeUtc = DateTime.UtcNow.AddDays(-5),
            EndTimeUtc = DateTime.UtcNow.AddDays(-4),
            StreetAddress = "123 Main St",
            City = "TestCity",
            State = "CA",
            PostalCode = "12345",
            Country = "USA",
            Latitude = 34.0522,
            Longitude = -118.2437,
            IsActive = true
        };

        // Act
        using (var context = new FitlanceContext(options))
        {
            var controller = new AppointmentsController(context);
            var result = await controller.PostAppointment(newAppointment);

            // Assert
            var actionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var model = Assert.IsAssignableFrom<Appointment>(actionResult.Value);
            Assert.Equal("Client1", model.ClientId);
            Assert.Equal("Trainer1", model.TrainerId);
            Assert.Equal(DateTime.UtcNow.AddDays(-10).Date, model.CreateTimeUtc.Date);
            Assert.Equal(DateTime.UtcNow.AddDays(-7).Date, model.UpdateTimeUtc.Date);
            Assert.Equal(DateTime.UtcNow.AddDays(-5).Date, model.StartTimeUtc.Date);
            Assert.Equal(DateTime.UtcNow.AddDays(-4).Date, model.EndTimeUtc.Date);
            Assert.Equal("123 Main St", model.StreetAddress);
            Assert.Equal("TestCity", model.City);
            Assert.Equal("CA", model.State);
            Assert.Equal("12345", model.PostalCode);
            Assert.Equal("USA", model.Country);
            Assert.Equal(34.0522, model.Latitude);
            Assert.Equal(-118.2437, model.Longitude);
            Assert.True(model.IsActive);
        }
    }

    [Fact]
    public async Task DeleteAppointment_ReturnsNoContentResult_WhenAppointmentExists()
    {
        // Arrange
        var options = BuildOptions("Delete1");
        using (var context = new FitlanceContext(options))
        {
            context.Appointments.AddRange(GetTestAppointments());
            await context.SaveChangesAsync();
        }

        // Act
        using (var context = new FitlanceContext(options))
        {
            var controller = new AppointmentsController(context);
            var result = await controller.DeleteAppointment(1);  // Assuming an appointment with ID 1 exists

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        // Verify the appointment is deleted
        using (var context = new FitlanceContext(options))
        {
            var appointment = await context.Appointments.FindAsync(1);
            Assert.Null(appointment);
        }
    }

    private List<Appointment> GetTestAppointments()
    {
        var appointments = new List<Appointment>
        {
            new Appointment
            {
                Id = 1,
                ClientId = "Client1",
                TrainerId = "Trainer1",
                CreateTimeUtc = DateTime.UtcNow.AddDays(-10),
                UpdateTimeUtc = DateTime.UtcNow.AddDays(-7),
                StartTimeUtc = DateTime.UtcNow.AddDays(-5),
                EndTimeUtc = DateTime.UtcNow.AddDays(-4),
                StreetAddress = "123 Main St",
                City = "TestCity",
                State = "CA",
                PostalCode = "12345",
                Country = "USA",
                Latitude = 34.0522,
                Longitude = -118.2437,
                IsActive = true
            },
            new Appointment
            {
                Id = 2,
                ClientId = "Client1",
                TrainerId = "Trainer2",
                CreateTimeUtc = DateTime.UtcNow.AddDays(-20),
                UpdateTimeUtc = DateTime.UtcNow.AddDays(-17),
                StartTimeUtc = DateTime.UtcNow.AddDays(-15),
                EndTimeUtc = DateTime.UtcNow.AddDays(-14),
                StreetAddress = "456 Elm St",
                City = "TestCity",
                State = "CA",
                PostalCode = "12345",
                Country = "USA",
                Latitude = 34.0522,
                Longitude = -118.2437,
                IsActive = true
            },
            new Appointment
            {
                Id = 3,
                ClientId = "Client2",
                TrainerId = "Trainer1",
                CreateTimeUtc = DateTime.UtcNow.AddDays(-30),
                UpdateTimeUtc = DateTime.UtcNow.AddDays(-27),
                StartTimeUtc = DateTime.UtcNow.AddDays(-25),
                EndTimeUtc = DateTime.UtcNow.AddDays(-24),
                StreetAddress = "789 Oak St",
                City = "TestCity",
                State = "CA",
                PostalCode = "12345",
                Country = "USA",
                Latitude = 34.0522,
                Longitude = -118.2437,
                IsActive = true
            },
            new Appointment
            {
                Id = 4,
                ClientId = "Client3",
                TrainerId = "Trainer1",
                CreateTimeUtc = DateTime.UtcNow.AddDays(-40),
                UpdateTimeUtc = DateTime.UtcNow.AddDays(-37),
                StartTimeUtc = DateTime.UtcNow.AddDays(-35),
                EndTimeUtc = DateTime.UtcNow.AddDays(-34),
                StreetAddress = "101 Pine St",
                City = "TestCity",
                State = "CA",
                PostalCode = "12345",
                Country = "USA",
                Latitude = 34.0522,
                Longitude = -118.2437,
                IsActive = true
            }
        };
    return appointments;
    }
}