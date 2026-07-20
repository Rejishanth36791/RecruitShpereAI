using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecruitSphereAI.Core.Common.Dtos;
using RecruitSphereAI.Core.Common.Enums;
using RecruitSphereAI.Core.Entities;
using RecruitSphereAI.Core.Interfaces;
using RecruitSphereAI.Persistence;
using System.Security.Claims;

namespace RecruitSphereAI.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class JobPostingsController : ControllerBase
{
    private readonly IJobService _jobService;
    private readonly RecruitSphereDbContext _context;
    private readonly ILogger<JobPostingsController> _logger;

    public JobPostingsController(
        IJobService jobService,
        RecruitSphereDbContext context,
        ILogger<JobPostingsController> logger)
    {
        _jobService = jobService;
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Get all job postings
    /// </summary>
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllJobPostings()
    {
        var jobs = await _jobService.GetAllJobsAsync();
        return Ok(jobs);
    }

    /// <summary>
    /// Get job posting by ID
    /// </summary>
    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetJobPostingById(Guid id)
    {
        var job = await _jobService.GetJobByIdAsync(id);
        if (job == null) return NotFound();
        return Ok(job);
    }

    /// <summary>
    /// Search job postings
    /// </summary>
    [HttpGet("search")]
    [AllowAnonymous]
    public async Task<IActionResult> SearchJobPostings(
        [FromQuery] string? searchTerm,
        [FromQuery] string? location,
        [FromQuery] string? status)
    {
        var jobs = await _jobService.SearchJobsAsync(searchTerm, location, status);
        return Ok(jobs);
    }

    /// <summary>
    /// Get job postings created by the current recruiter
    /// </summary>
    [HttpGet("recruiter")]
    [Authorize(Roles = "Recruiter,Admin")]
    public async Task<IActionResult> GetMyJobPostings()
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdString, out var userId)) return Unauthorized();

        var recruiter = await _context.Recruiters.FirstOrDefaultAsync(r => r.UserId == userId);
        if (recruiter == null) return Ok(Enumerable.Empty<JobPosting>());

        var jobs = await _jobService.GetJobsByRecruiterAsync(recruiter.Id);
        return Ok(jobs);
    }

    /// <summary>
    /// Create a new job posting
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Recruiter,Admin")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<IActionResult> CreateJobPosting([FromBody] CreateJobRequest request)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdString, out var userId)) return Unauthorized();

        var recruiter = await _context.Recruiters.FirstOrDefaultAsync(r => r.UserId == userId);
        if (recruiter == null)
        {
            var defaultOrg = await _context.Organizations.FirstOrDefaultAsync(o => o.Name == "Default Organization");
            if (defaultOrg == null)
            {
                defaultOrg = new Organization
                {
                    Name = "Default Organization",
                    Description = "Placeholder organization."
                };
                _context.Organizations.Add(defaultOrg);
                await _context.SaveChangesAsync();
            }

            recruiter = new Recruiter
            {
                UserId = userId,
                OrganizationId = defaultOrg.Id
            };
            _context.Recruiters.Add(recruiter);
            await _context.SaveChangesAsync();
        }

        var job = new JobPosting
        {
            Title = request.Title,
            Description = request.Description,
            Requirements = request.Requirements,
            Location = request.Location,
            Salary = request.Salary,
            DepartmentId = request.DepartmentId,
            OrganizationId = request.OrganizationId ?? recruiter.OrganizationId
        };

        var createdJob = await _jobService.CreateJobAsync(job, recruiter.Id);
        _logger.LogInformation($"Recruiter {userId} created job posting {createdJob.Id}");

        return CreatedAtAction(nameof(GetJobPostingById), new { id = createdJob.Id }, createdJob);
    }

    /// <summary>
    /// Update a job posting status
    /// </summary>
    [HttpPut("{id}/status")]
    [Authorize(Roles = "Recruiter,Admin")]
    public async Task<IActionResult> UpdateJobStatus(Guid id, [FromBody] UpdateJobStatusRequest request)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var success = await _jobService.UpdateJobStatusAsync(id, request.Status);
        if (!success) return BadRequest("Unable to update job status. Ensure the status value is valid.");

        return Ok(new { message = "Job status updated successfully." });
    }

    /// <summary>
    /// Update a job posting's details (title, description, requirements, location, salary).
    /// Recruiters can only edit their own postings; Admins can edit any.
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Roles = "Recruiter,Admin")]
    public async Task<IActionResult> UpdateJobPosting(Guid id, [FromBody] UpdateJobRequest request)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdString, out var userId)) return Unauthorized();

        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
        Guid? recruiterId = null;

        if (userRole != "Admin")
        {
            var recruiter = await _context.Recruiters.FirstOrDefaultAsync(r => r.UserId == userId);
            if (recruiter == null) return Forbid();
            recruiterId = recruiter.Id;
        }

        var updates = new JobPosting
        {
            Title = request.Title,
            Description = request.Description,
            Requirements = request.Requirements,
            Location = request.Location,
            Salary = request.Salary,
        };

        var updatedJob = await _jobService.UpdateJobAsync(id, recruiterId, updates);
        if (updatedJob == null)
            return NotFound(new { message = "Job posting not found, or you don't have permission to edit it." });

        _logger.LogInformation($"User {userId} updated job posting {id}");
        return Ok(updatedJob);
    }

    /// <summary>
    /// Delete a job posting. Recruiters can only delete their own postings; Admins can delete any.
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Roles = "Recruiter,Admin")]
    public async Task<IActionResult> DeleteJobPosting(Guid id)
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdString, out var userId)) return Unauthorized();

        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
        Guid? recruiterId = null;

        if (userRole != "Admin")
        {
            var recruiter = await _context.Recruiters.FirstOrDefaultAsync(r => r.UserId == userId);
            if (recruiter == null) return Forbid();
            recruiterId = recruiter.Id;
        }

        var deleted = await _jobService.DeleteJobAsync(id, recruiterId);
        if (!deleted)
            return NotFound(new { message = "Job posting not found, or you don't have permission to delete it." });

        _logger.LogInformation($"User {userId} deleted job posting {id}");
        return Ok(new { message = "Job posting deleted successfully." });
    }
}
