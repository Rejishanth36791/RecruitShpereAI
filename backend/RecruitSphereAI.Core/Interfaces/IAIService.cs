// RecruitSphereAI.Core/Interfaces/IAIService.cs
namespace RecruitSphereAI.Core.Interfaces;

public interface IAIService
{
    Task<string> ParseResumeAsync(string resumeText);
    Task<decimal> CalculateMatchScoreAsync(string candidateProfile, string jobDescription);
    Task<List<string>> ExtractSkillsAsync(string text);
    Task<string> GenerateJobRecommendationAsync(string candidateSkills);
}