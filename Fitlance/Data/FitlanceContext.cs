using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

using Fitlance.Entities;

namespace Fitlance.Data;

public class FitlanceContext : IdentityDbContext<User>
{
    public FitlanceContext()
    {
    }

    public FitlanceContext(DbContextOptions<FitlanceContext> options)
        : base(options)
    {
    }

    public DbSet<Appointment>? Appointments { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            IConfiguration configuration = new ConfigurationBuilder()
                .AddJsonFile("appsettings.Development.Local.json", true, true)
                .AddJsonFile("appsettings.json", true, true)
                .Build();
            optionsBuilder.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.HasDefaultSchema("Fitlance");
        modelBuilder.Entity<User>(mb =>
        {
            mb.HasMany<Appointment>().WithOne().HasForeignKey(a => a.ClientId).IsRequired();
            mb.ToTable("AspNetUsers");
        });

        modelBuilder.Entity<Appointment>(a =>
        {
            a.Property(p => p.Id).ValueGeneratedOnAdd();
            a.ToTable("Appointments");
        });
    }
}