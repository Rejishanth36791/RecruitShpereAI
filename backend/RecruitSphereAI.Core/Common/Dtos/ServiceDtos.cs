using System.ComponentModel.DataAnnotations;

namespace RecruitSphereAI.Core.Common.Dtos;

public class CreateJobRequest
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(4000)]
    public string Description { get; set; } = string.Empty;

    public string? Requirements { get; set; }

    [MaxLength(200)]
    public string? Location { get; set; }

    public decimal? Salary { get; set; }

    public Guid? DepartmentId { get; set; }

    public Guid? OrganizationId { get; set; }
}

public class UpdateJobStatusRequest
{
    [Required]
    public string Status { get; set; } = string.Empty;
}

public class UpdateJobRequest
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(4000)]
    public string Description { get; set; } = string.Empty;

    public string? Requirements { get; set; }

    [MaxLength(200)]
    public string? Location { get; set; }

    public decimal? Salary { get; set; }
}

public class SubmitApplicationRequest
{
    [Required]
    public Guid JobPostingId { get; set; }
}

public class UpdateApplicationStatusRequest
{
    [Required]
    public string Status { get; set; } = string.Empty;
}

public class ScheduleInterviewRequest
{
    [Required]
    public Guid ApplicationId { get; set; }

    [Required]
    public DateTime ScheduledDate { get; set; }

    [Required]
    [MaxLength(2048)]
    public string Mode { get; set; } = string.Empty; // Mapped to MeetingLink
}

public class UpdateInterviewStatusRequest
{
    [Required]
    public string Status { get; set; } = string.Empty;
}

public class ParseResumeRequest
{
    [Required]
    public string ResumeText { get; set; } = string.Empty;
}

public class CalculateMatchScoreRequest
{
    [Required]
    public string CandidateProfile { get; set; } = string.Empty;

    [Required]
    public string JobDescription { get; set; } = string.Empty;
}

public class ExtractSkillsRequest
{
    [Required]
    public string Text { get; set; } = string.Empty;
}

public class GenerateJobRecommendationRequest
{
    public string CandidateSkills { get; set; } = string.Empty;
}

public class SubmitFeedbackRequest
{
    [Required]
    public Guid ApplicationId { get; set; }

    [Required]
    [MaxLength(4000)]
    public string Comments { get; set; } = string.Empty;

    [Range(1, 5)]
    public int? Rating { get; set; }
}
