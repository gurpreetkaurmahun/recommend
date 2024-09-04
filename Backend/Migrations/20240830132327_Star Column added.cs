using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FinalYearProject.Migrations
{
    /// <inheritdoc />
    public partial class StarColumnadded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WebScrappers_Products_ProductId",
                table: "WebScrappers");

            migrationBuilder.DropIndex(
                name: "IX_WebScrappers_ProductId",
                table: "WebScrappers");

            migrationBuilder.DropColumn(
                name: "ProductId",
                table: "WebScrappers");

            migrationBuilder.AddColumn<int>(
                name: "stars",
                table: "Reviews",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "stars",
                table: "Reviews");

            migrationBuilder.AddColumn<int>(
                name: "ProductId",
                table: "WebScrappers",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_WebScrappers_ProductId",
                table: "WebScrappers",
                column: "ProductId");

            migrationBuilder.AddForeignKey(
                name: "FK_WebScrappers_Products_ProductId",
                table: "WebScrappers",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "ProductId");
        }
    }
}
