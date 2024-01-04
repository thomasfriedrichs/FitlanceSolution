using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Fitlance.Migrations
{
    /// <inheritdoc />
    public partial class EditTrainerPlaceHolder : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Trainers_TrainerDataTrainerId",
                schema: "Fitlance",
                table: "AspNetUsers");

            migrationBuilder.RenameColumn(
                name: "TrainerDataTrainerId",
                schema: "Fitlance",
                table: "AspNetUsers",
                newName: "TrainerId");

            migrationBuilder.RenameIndex(
                name: "IX_AspNetUsers_TrainerDataTrainerId",
                schema: "Fitlance",
                table: "AspNetUsers",
                newName: "IX_AspNetUsers_TrainerId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Trainers_TrainerId",
                schema: "Fitlance",
                table: "AspNetUsers",
                column: "TrainerId",
                principalSchema: "Fitlance",
                principalTable: "Trainers",
                principalColumn: "TrainerId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Trainers_TrainerId",
                schema: "Fitlance",
                table: "AspNetUsers");

            migrationBuilder.RenameColumn(
                name: "TrainerId",
                schema: "Fitlance",
                table: "AspNetUsers",
                newName: "TrainerDataTrainerId");

            migrationBuilder.RenameIndex(
                name: "IX_AspNetUsers_TrainerId",
                schema: "Fitlance",
                table: "AspNetUsers",
                newName: "IX_AspNetUsers_TrainerDataTrainerId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Trainers_TrainerDataTrainerId",
                schema: "Fitlance",
                table: "AspNetUsers",
                column: "TrainerDataTrainerId",
                principalSchema: "Fitlance",
                principalTable: "Trainers",
                principalColumn: "TrainerId");
        }
    }
}
