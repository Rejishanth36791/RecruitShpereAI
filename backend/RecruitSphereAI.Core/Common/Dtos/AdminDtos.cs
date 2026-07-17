namespace RecruitSphereAI.Core.Common.Dtos;

/// <summary>
/// Aggregate, platform-wide statistics for the Admin dashboard.
/// Computed server-side so it reflects the full dataset (not just published jobs).
/// </summary>
public class AdminAnalyticsResponse
{
    public int TotalUsers { get; set; }
    public int TotalCandidates { get; set; }
    public int TotalRecruiters { get; set; }
    public int TotalHiringManagers { get; set; }
    public int TotalAdmins { get; set; }

    public int TotalJobPostings { get; set; }
    public Dictionary<string, int> JobsByStatus { get; set; } = new();

    public int TotalApplications { get; set; }
    public Dictionary<string, int> ApplicationsByStatus { get; set; } = new();

    public int TotalInterviews { get; set; }
    public Dictionary<string, int> InterviewsByStatus { get; set; } = new();

    public decimal? AverageDisclosedSalary { get; set; }
    public int TotalOrganizations { get; set; }
}
