namespace RecruitSphereAI.Core.Common.Enums;

public enum UserRole
{
    Candidate,
    Recruiter,
    HiringManager,
    Admin
}

public enum JobStatus
{
    Draft,
    Published,
    Closed,
    Archived
}

public enum ApplicationStatus
{
    Submitted,
    UnderReview,
    Interviewing,
    Accepted,
    Rejected
}

public enum InterviewStatus
{
    Scheduled,
    Completed,
    Cancelled,
    NoShow
}
