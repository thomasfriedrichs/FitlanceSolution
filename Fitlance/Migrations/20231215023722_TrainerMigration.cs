using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Fitlance.Migrations
{
    public partial class TrainerMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Trainers",
                schema: "Fitlance",
                columns: table => new
                {
                    TrainerId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Gender = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Specialization = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NutritionCertification = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    YearsOfExperience = table.Column<int>(type: "int", nullable: false),
                    Rating = table.Column<double>(type: "float", nullable: false),
                    HourlyRate = table.Column<int>(type: "int", nullable: false),
                    SecondLanguage = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ReviewCount = table.Column<int>(type: "int", nullable: true),
                    ActiveClients = table.Column<int>(type: "int", nullable: true),
                    CertificationsDelimited = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AvailabilityDelimited = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClientSkillDelimited = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Trainers", x => x.TrainerId);
                    table.ForeignKey(
                        name: "FK_Trainers_AspNetUsers_TrainerId",
                        column: x => x.TrainerId,
                        principalSchema: "Fitlance",
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Trainers",
                schema: "Fitlance");
        }
    }
}
