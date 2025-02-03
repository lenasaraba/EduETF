using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class Initial2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Themes_Courses_CourseId",
                table: "Themes");

            migrationBuilder.AddForeignKey(
                name: "FK_Themes_Courses_CourseId",
                table: "Themes",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Themes_Courses_CourseId",
                table: "Themes");

            migrationBuilder.AddForeignKey(
                name: "FK_Themes_Courses_CourseId",
                table: "Themes",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "Id");
        }
    }
}
