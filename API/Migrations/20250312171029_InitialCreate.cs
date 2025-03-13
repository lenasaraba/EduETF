using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Form_Courses_CourseId",
                table: "Form");

            migrationBuilder.DropForeignKey(
                name: "FK_Form_Messages_MessageId",
                table: "Form");

            migrationBuilder.AddForeignKey(
                name: "FK_Form_Courses_CourseId",
                table: "Form",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Form_Messages_MessageId",
                table: "Form",
                column: "MessageId",
                principalTable: "Messages",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Form_Courses_CourseId",
                table: "Form");

            migrationBuilder.DropForeignKey(
                name: "FK_Form_Messages_MessageId",
                table: "Form");

            migrationBuilder.AddForeignKey(
                name: "FK_Form_Courses_CourseId",
                table: "Form",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Form_Messages_MessageId",
                table: "Form",
                column: "MessageId",
                principalTable: "Messages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
