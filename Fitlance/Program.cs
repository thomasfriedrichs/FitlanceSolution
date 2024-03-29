using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Fitlance.Data;
using Fitlance.Entities;
using Fitlance.Constants;
using Fitlance.Middleware;
using IAuthenticationService = Fitlance.Services.IAuthenticationService;
using AuthenticationService = Fitlance.Services.AuthenticationService;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.Development.Local.json", optional: true, reloadOnChange: true);

var configuration = builder.Configuration;

// Add services to the container.
builder.Services.AddDbContext<FitlanceContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddScoped<AppointmentSeeder>();

builder.Services.AddControllersWithViews();

//Logging
builder.Services.AddSingleton<ILogger>(svc => svc.GetRequiredService<ILogger<Program>>());

//Identity
builder.Services.AddIdentity<User, IdentityRole>()
    .AddRoles<IdentityRole>()
    .AddRoleManager<RoleManager<IdentityRole>>()
    .AddEntityFrameworkStores<FitlanceContext>()
    .AddDefaultTokenProviders();
builder.Services.AddScoped<UserManager<User>>();
builder.Services.AddTransient<TrainerSeeder>();

//Authentication

builder.Services.Configure<CookiePolicyOptions>(options =>
{
    options.CheckConsentNeeded = context => false;
});

builder.Services.AddAuthentication(options =>
{

    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;

}).AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.RequireHttpsMetadata = false;
    options.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidAudience = configuration["JWT:ValidAudience"],
        ValidIssuer = configuration["JWT:ValidIssuer"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Secret"]))
    };
    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            var logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<JwtBearerEvents>>();
            logger.LogError("Authentication failed: {Error}", context.Exception.Message); 
            return Task.CompletedTask;
        },
        OnChallenge = context =>
        {
            var logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<JwtBearerEvents>>();
            if (!context.Response.HasStarted)
            {
                logger.LogWarning("JWT Challenge invoked");
            }
            return Task.CompletedTask;
        },
        OnMessageReceived = context =>
        {
            var refreshToken = context.Request.Cookies["RefreshToken"];
            var logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<JwtBearerEvents>>();
            if (!string.IsNullOrEmpty(refreshToken))
            {
                //logger.LogInformation("Refresh token found in cookie.");
                logger.LogInformation("Token: {Token}", refreshToken);
            }
            var token = context.Request.Cookies["AccessToken"];
            if (!string.IsNullOrEmpty(token))
            {
                context.Token = token;
            }
            return Task.CompletedTask;
        },
        OnTokenValidated = context =>
        {
            return Task.CompletedTask;
        }
    };


});

//Authorization Policies
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("TrainerRights", policy =>
        policy.RequireRole(RoleConstants.Trainer));
    options.AddPolicy("UserRights", policy =>
        policy.RequireRole(RoleConstants.User));
});

builder.Services.AddScoped<IAuthenticationService, AuthenticationService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = @"JWT Authorization header using the Bearer scheme. \r\n\r\n 
                      Enter 'Bearer' [space] and then your token in the text input below.
                      \r\n\r\nExample: 'Bearer 12345abcdef'",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement()
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header,

            },
            new List<string>()
        }
    });
});

//Cors
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("DevClient",
        b =>
        {
            b.WithOrigins("https://localhost:44406")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
        });
    opt.AddPolicy("DevClient2",
        b =>
        {
            b.WithOrigins("https://localhost:7021")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
        });
    opt.AddPolicy("Domain",
        b =>
        {
            b.WithOrigins("https://fitlance.me")
            .AllowCredentials()
            .AllowAnyHeader()
            .AllowAnyMethod();
        });
    opt.AddPolicy("Azure",
        b =>
        {
            b.WithOrigins("https://fitlance.azurewebsites.net")
            .AllowCredentials()
            .AllowAnyHeader()
            .AllowAnyMethod();
        });
});

var app = builder.Build();

/*app.Use(async (context, next) =>
{
    var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
    var token = context.Request.Headers.Cookie.FirstOrDefault()?.Split(" ").Last();
    logger.LogInformation("Token received: {Token}", token);
    await next();
});*/


if (ConfigurationBinder.GetValue<bool>(configuration, "SeedAppointmentDataOnStartup"))
{
    using var scope = app.Services.CreateScope();
    var appointmentSeeder = scope.ServiceProvider.GetRequiredService<AppointmentSeeder>();
    appointmentSeeder.SeedData();
}

if (builder.Configuration.GetValue<bool>("SeedTrainerDataOnStartup"))
{
    using var scope = app.Services.CreateScope();
    var services = scope.ServiceProvider;
    var trainerSeeder = services.GetRequiredService<TrainerSeeder>();
    var dbContext = services.GetRequiredService<FitlanceContext>();
    dbContext.Database.EnsureCreated();
    await trainerSeeder.SeedTrainers(dbContext);
}



// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
    });
    app.UseCors("DevClient");
    app.UseCors("DevClient2");
}

app.UseCors("Domain");
app.UseCors("Azure");
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
//uncomment for debugging log requests
//app.UseMiddleware<RequestLoggingMiddleware>();
app.MapControllers();

app.MapFallbackToFile("index.html");

app.Run();
