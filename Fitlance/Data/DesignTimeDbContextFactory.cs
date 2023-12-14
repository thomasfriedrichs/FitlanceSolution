using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Fitlance.Data
{
    //Automatically used by EF Core CLI tools during design time operations
    //Built to assist with trainer seeding operations 
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<FitlanceContext>
    {
        public FitlanceContext CreateDbContext(string[] args)
        {
            IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.Development.Local.json", true, true)
                .AddJsonFile("appsettings.json", true, true)
                .Build();

            var builder = new DbContextOptionsBuilder<FitlanceContext>();
            var connectionString = configuration.GetConnectionString("DefaultConnection");
            builder.UseSqlServer(connectionString);

            return new FitlanceContext(builder.Options);
        }
    }
}
