using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RecruitSphereAI.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class WorkingDB : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Feedbacks_Applications_ApplicationId",
                table: "Feedbacks");

            migrationBuilder.DropForeignKey(
                name: "FK_Feedbacks_Candidates_CandidateId",
                table: "Feedbacks");

            migrationBuilder.DropForeignKey(
                name: "FK_Feedbacks_Users_UserId",
                table: "Feedbacks");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Feedbacks",
                table: "Feedbacks");

            migrationBuilder.RenameTable(
                name: "Feedbacks",
                newName: "Feedback");

            migrationBuilder.RenameIndex(
                name: "IX_Feedbacks_UserId",
                table: "Feedback",
                newName: "IX_Feedback_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Feedbacks_CandidateId",
                table: "Feedback",
                newName: "IX_Feedback_CandidateId");

            migrationBuilder.RenameIndex(
                name: "IX_Feedbacks_ApplicationId",
                table: "Feedback",
                newName: "IX_Feedback_ApplicationId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Feedback",
                table: "Feedback",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Feedback_Applications_ApplicationId",
                table: "Feedback",
                column: "ApplicationId",
                principalTable: "Applications",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Feedback_Candidates_CandidateId",
                table: "Feedback",
                column: "CandidateId",
                principalTable: "Candidates",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Feedback_Users_UserId",
                table: "Feedback",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Feedback_Applications_ApplicationId",
                table: "Feedback");

            migrationBuilder.DropForeignKey(
                name: "FK_Feedback_Candidates_CandidateId",
                table: "Feedback");

            migrationBuilder.DropForeignKey(
                name: "FK_Feedback_Users_UserId",
                table: "Feedback");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Feedback",
                table: "Feedback");

            migrationBuilder.RenameTable(
                name: "Feedback",
                newName: "Feedbacks");

            migrationBuilder.RenameIndex(
                name: "IX_Feedback_UserId",
                table: "Feedbacks",
                newName: "IX_Feedbacks_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Feedback_CandidateId",
                table: "Feedbacks",
                newName: "IX_Feedbacks_CandidateId");

            migrationBuilder.RenameIndex(
                name: "IX_Feedback_ApplicationId",
                table: "Feedbacks",
                newName: "IX_Feedbacks_ApplicationId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Feedbacks",
                table: "Feedbacks",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Feedbacks_Applications_ApplicationId",
                table: "Feedbacks",
                column: "ApplicationId",
                principalTable: "Applications",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Feedbacks_Candidates_CandidateId",
                table: "Feedbacks",
                column: "CandidateId",
                principalTable: "Candidates",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Feedbacks_Users_UserId",
                table: "Feedbacks",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
