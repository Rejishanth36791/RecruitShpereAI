using Microsoft.EntityFrameworkCore;
using RecruitSphereAI.Core.Common.Dtos;
using RecruitSphereAI.Core.Common.Enums;
using RecruitSphereAI.Core.Interfaces;
using RecruitSphereAI.Persistence;

namespace RecruitSphereAI.Infrastructure.Services;

public class AdminService : IAdminService
{
    private readonly RecruitSphereDbContext _context;

    public AdminService(RecruitSphereDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
    {
        var users = await _context.Users
            .OrderByDescending(u => u.CreatedAt)
            .ToListAsync();

        return users.Select(u => new UserDto
        {
            Id = u.Id,
            Email = u.Email.Value,
            FullName = u.FullName,
            Role = u.Role.ToString(),
        });
    }

    public async Task<AdminAnalyticsResponse> GetAnalyticsAsync()
    {
        var users = await _context.Users.ToListAsync();
        var jobs = await _context.JobPostings.ToListAsync();
        var applications = await _context.Applications.ToListAsync();
        var interviews = await _context.Interviews.ToListAsync();
        var organizationCount = await _context.Organizations.CountAsync();

        var salaries = jobs.Where(j => j.Salary.HasValue).Select(j => j.Salary!.Value).ToList();

        return new AdminAnalyticsResponse
        {
            TotalUsers = users.Count,
            TotalCandidates = users.Count(u => u.Role == UserRole.Candidate),
            TotalRecruiters = users.Count(u => u.Role == UserRole.Recruiter),
            TotalHiringManagers = users.Count(u => u.Role == UserRole.HiringManager),
            TotalAdmins = users.Count(u => u.Role == UserRole.Admin),

            TotalJobPostings = jobs.Count,
            JobsByStatus = jobs
                .GroupBy(j => j.Status.ToString())
                .ToDictionary(g => g.Key, g => g.Count()),

            TotalApplications = applications.Count,
            ApplicationsByStatus = applications
                .GroupBy(a => a.Status.ToString())
                .ToDictionary(g => g.Key, g => g.Count()),

            TotalInterviews = interviews.Count,
            InterviewsByStatus = interviews
                .GroupBy(i => i.Status.ToString())
                .ToDictionary(g => g.Key, g => g.Count()),

            AverageDisclosedSalary = salaries.Count > 0 ? salaries.Average() : null,
            TotalOrganizations = organizationCount,
        };
    }
}
