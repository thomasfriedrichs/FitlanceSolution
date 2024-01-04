using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Fitlance.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedTrainerUserRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Trainers_TrainerId",
                schema: "Fitlance",
                table: "AspNetUsers");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_TrainerId",
                schema: "Fitlance",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "TrainerId",
                schema: "Fitlance",
                table: "AspNetUsers");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TrainerId",
                schema: "Fitlance",
                table: "AspNetUsers",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_TrainerId",
                schema: "Fitlance",
                table: "AspNetUsers",
                column: "TrainerId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Trainers_TrainerId",
                schema: "Fitlance",
                table: "AspNetUsers",
                column: "TrainerId",
                principalSchema: "Fitlance",
                principalTable: "Trainers",
                principalColumn: "TrainerId");
        }
    }
}
