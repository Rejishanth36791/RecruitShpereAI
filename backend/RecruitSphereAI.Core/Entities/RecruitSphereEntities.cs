using RecruitSphereAI.Core.Common.Enums;
using RecruitSphereAI.Core.Common.ValueObjects;

namespace RecruitSphereAI.Core.Entities;

public class User
{
    public Guid Id { get; private set; } = Guid.NewGuid();
    public EmailAddress Email { get; set; } = default!;
    public string PasswordHash { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public Candidate? Candidate { get; set; }
    public Recruiter? Recruiter { get; set; }
    public HiringManager? HiringManager { get; set; }
    public ICollection<Notification> Notifications { get; } = new List<Notification>();
    public ICollection<AuditLog> AuditLogs { get; } = new List<AuditLog>();
}

public class Candidate
{
    public Guid Id { get; private set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public User User { get; set; } = default!;
    public string? Bio { get; set; }
    public int ExperienceYears { get; set; }
    public string? Education { get; set; }
    public string? Skills { get; set; }
    public string? ResumeUrl { get; set; }

    public ICollection<Application> Applications { get; } = new List<Application>();
    public ICollection<Feedback> Feedbacks { get; } = new List<Feedback>();
    public ICollection<SkillAssessment> SkillAssessments { get; } = new List<SkillAssessment>();
    public ICollection<Document> Documents { get; } = new List<Document>();
}

public class Recruiter
{
    public Guid Id { get; private set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public User User { get; set; } = default!;
    public Guid OrganizationId { get; set; }
    public Organization Organization { get; set; } = default!;
    public string? PositionTitle { get; set; }

    public ICollection<JobPosting> JobPostings { get; } = new List<JobPosting>();
}

public class HiringManager
{
    public Guid Id { get; private set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public User User { get; set; } = default!;
    public Guid OrganizationId { get; set; }
    public Organization Organization { get; set; } = default!;
    public Guid? DepartmentId { get; set; }
    public Department? Department { get; set; }
    public string? PositionTitle { get; set; }
}

public class Organization
{
    public Guid Id { get; private set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Industry { get; set; }
    public string? Website { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public ICollection<Department> Departments { get; } = new List<Department>();
    public ICollection<Recruiter> Recruiters { get; } = new List<Recruiter>();
    public ICollection<HiringManager> HiringManagers { get; } = new List<HiringManager>();
    public ICollection<JobPosting> JobPostings { get; } = new List<JobPosting>();
}

public class Department
{
    public Guid Id { get; private set; } = Guid.NewGuid();
    public Guid OrganizationId { get; set; }
    public Organization Organization { get; set; } = default!;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }

    public ICollection<HiringManager> HiringManagers { get; } = new List<HiringManager>();
    public ICollection<JobPosting> JobPostings { get; } = new List<JobPosting>();
}

public class JobPosting
{
    public Guid Id { get; private set; } = Guid.NewGuid();
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Requirements { get; set; }
    public string? Location { get; set; }
    public decimal? Salary { get; set; }
    public JobStatus Status { get; set; }
    public Guid RecruiterId { get; set; }
    public Recruiter Recruiter { get; set; } = default!;
    public Guid? DepartmentId { get; set; }
    public Department? Department { get; set; }
    public Guid? OrganizationId { get; set; }
    public Organization? Organization { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public ICollection<Application> Applications { get; } = new List<Application>();
    public ICollection<SkillAssessment> SkillAssessments { get; } = new List<SkillAssessment>();
}

public class Application
{
    public Guid Id { get; private set; } = Guid.NewGuid();
    public Guid JobPostingId { get; set; }
    public JobPosting JobPosting { get; set; } = default!;
    public Guid CandidateId { get; set; }
    public Candidate Candidate { get; set; } = default!;
    public ApplicationStatus Status { get; set; }
    public DateTimeOffset AppliedDate { get; set; } = DateTimeOffset.UtcNow;

    public ICollection<Interview> Interviews { get; } = new List<Interview>();
    public ICollection<Feedback> Feedbacks { get; } = new List<Feedback>();
    public ICollection<Document> Documents { get; } = new List<Document>();
}

public class Interview
{
    public Guid Id { get; private set; } = Guid.NewGuid();
    public Guid ApplicationId { get; set; }
    public Application Application { get; set; } = default!;
    public DateTimeOffset ScheduledDate { get; set; }
    public InterviewStatus Status { get; set; }
    public string? MeetingLink { get; set; }
}

public class Feedback
{
    public Guid Id { get; private set; } = Guid.NewGuid();
    public Guid ApplicationId { get; set; }
    public Application Application { get; set; } = default!;
    public Guid CandidateId { get; set; }
    public Candidate Candidate { get; set; } = default!;
    public Guid? UserId { get; set; }
    public User? User { get; set; }
    public string Comments { get; set; } = string.Empty;
    public int? Rating { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
}

public class SkillAssessment
{
    public Guid Id { get; private set; } = Guid.NewGuid();
    public Guid CandidateId { get; set; }
    public Candidate Candidate { get; set; } = default!;
    public Guid? JobPostingId { get; set; }
    public JobPosting? JobPosting { get; set; }
    public string Title { get; set; } = string.Empty;
    public int Score { get; set; }
    public string? Notes { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
}

public class Document
{
    public Guid Id { get; private set; } = Guid.NewGuid();
    public Guid? CandidateId { get; set; }
    public Candidate? Candidate { get; set; }
    public Guid? ApplicationId { get; set; }
    public Application? Application { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string FileUrl { get; set; } = string.Empty;
    public string DocumentType { get; set; } = string.Empty;
    public DateTimeOffset UploadedAt { get; set; } = DateTimeOffset.UtcNow;
}

public class Notification
{
    public Guid Id { get; private set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public User User { get; set; } = default!;
    public string Message { get; set; } = string.Empty;
    public bool IsRead { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public string? RelatedEntityType { get; set; }
    public Guid? RelatedEntityId { get; set; }
}

public class AuditLog
{
    public Guid Id { get; private set; } = Guid.NewGuid();
    public Guid? UserId { get; set; }
    public User? User { get; set; }
    public string Action { get; set; } = string.Empty;
    public string EntityName { get; set; } = string.Empty;
    public string? Details { get; set; }
    public DateTimeOffset Timestamp { get; set; } = DateTimeOffset.UtcNow;
}
