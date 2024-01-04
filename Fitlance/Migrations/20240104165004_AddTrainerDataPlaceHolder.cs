using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Fitlance.Migrations
{
    /// <inheritdoc />
    public partial class AddTrainerDataPlaceHolder : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TrainerDataTrainerId",
                schema: "Fitlance",
                table: "AspNetUsers",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_TrainerDataTrainerId",
                schema: "Fitlance",
                table: "AspNetUsers",
                column: "TrainerDataTrainerId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Trainers_TrainerDataTrainerId",
                schema: "Fitlance",
                table: "AspNetUsers",
                column: "TrainerDataTrainerId",
                principalSchema: "Fitlance",
                principalTable: "Trainers",
                principalColumn: "TrainerId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Trainers_TrainerDataTrainerId",
                schema: "Fitlance",
                table: "AspNetUsers");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_TrainerDataTrainerId",
                schema: "Fitlance",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "TrainerDataTrainerId",
                schema: "Fitlance",
                table: "AspNetUsers");
        }
    }
}
