using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class CourseMaterialsAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CourseMaterial_Courses_CourseId",
                table: "CourseMaterial");

            migrationBuilder.DropForeignKey(
                name: "FK_CourseMaterial_MaterialTypes_MaterialTypeId",
                table: "CourseMaterial");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CourseMaterial",
                table: "CourseMaterial");

            migrationBuilder.RenameTable(
                name: "CourseMaterial",
                newName: "CourseMaterials");

            migrationBuilder.RenameIndex(
                name: "IX_CourseMaterial_MaterialTypeId",
                table: "CourseMaterials",
                newName: "IX_CourseMaterials_MaterialTypeId");

            migrationBuilder.RenameIndex(
                name: "IX_CourseMaterial_CourseId",
                table: "CourseMaterials",
                newName: "IX_CourseMaterials_CourseId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CourseMaterials",
                table: "CourseMaterials",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_CourseMaterials_Courses_CourseId",
                table: "CourseMaterials",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_CourseMaterials_MaterialTypes_MaterialTypeId",
                table: "CourseMaterials",
                column: "MaterialTypeId",
                principalTable: "MaterialTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CourseMaterials_Courses_CourseId",
                table: "CourseMaterials");

            migrationBuilder.DropForeignKey(
                name: "FK_CourseMaterials_MaterialTypes_MaterialTypeId",
                table: "CourseMaterials");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CourseMaterials",
                table: "CourseMaterials");

            migrationBuilder.RenameTable(
                name: "CourseMaterials",
                newName: "CourseMaterial");

            migrationBuilder.RenameIndex(
                name: "IX_CourseMaterials_MaterialTypeId",
                table: "CourseMaterial",
                newName: "IX_CourseMaterial_MaterialTypeId");

            migrationBuilder.RenameIndex(
                name: "IX_CourseMaterials_CourseId",
                table: "CourseMaterial",
                newName: "IX_CourseMaterial_CourseId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CourseMaterial",
                table: "CourseMaterial",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_CourseMaterial_Courses_CourseId",
                table: "CourseMaterial",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_CourseMaterial_MaterialTypes_MaterialTypeId",
                table: "CourseMaterial",
                column: "MaterialTypeId",
                principalTable: "MaterialTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
