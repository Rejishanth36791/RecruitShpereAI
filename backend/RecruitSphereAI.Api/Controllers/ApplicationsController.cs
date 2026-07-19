using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecruitSphereAI.Core.Common.Dtos;
using RecruitSphereAI.Core.Entities;
using RecruitSphereAI.Core.Interfaces;
using RecruitSphereAI.Persistence;
using System.Security.Claims;

namespace RecruitSphereAI.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ApplicationsController : ControllerBase
{
    private readonly IApplicationService _applicationService;
    private readonly RecruitSphereDbContext _context;
    private readonly ILogger<ApplicationsController> _logger;

    public ApplicationsController(
        IApplicationService applicationService,
        RecruitSphereDbContext context,
        ILogger<ApplicationsController> logger)
    {
        _applicationService = applicationService;
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Submit a new application for a job
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Candidate")]
    public async Task<IActionResult> SubmitApplication([FromBody] SubmitApplicationRequest request)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdString, out var userId)) return Unauthorized();

        var candidate = await _context.Candidates.FirstOrDefaultAsync(c => c.UserId == userId);
        if (candidate == null)
        {
            candidate = new Candidate { UserId = userId };
            _context.Candidates.Add(candidate);
            await _context.SaveChangesAsync();
        }

        try
        {
            var application = await _applicationService.SubmitApplicationAsync(candidate.Id, request.JobPostingId);
            _logger.LogInformation($"Candidate {candidate.Id} applied for job {request.JobPostingId}");
            return CreatedAtAction(nameof(GetApplicationDetails), new { id = application.Id }, application);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// List current candidate's applications
    /// </summary>
    [HttpGet("my")]
    [Authorize(Roles = "Candidate")]
    public async Task<IActionResult> GetMyApplications()
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdString, out var userId)) return Unauthorized();

        var candidate = await _context.Candidates.FirstOrDefaultAsync(c => c.UserId == userId);
        if (candidate == null) return Ok(Enumerable.Empty<Application>());

        var applications = await _applicationService.GetApplicationsByCandidateAsync(candidate.Id);
        return Ok(applications);
    }

    /// <summary>
    /// Get applications for a specific job posting
    /// </summary>
    [HttpGet("job/{jobPostingId}")]
    [Authorize(Roles = "Recruiter,HiringManager,Admin")]
    public async Task<IActionResult> GetApplicationsByJob(Guid jobPostingId)
    {
        var applications = await _applicationService.GetApplicationsByJobAsync(jobPostingId);
        return Ok(applications);
    }

    /// <summary>
    /// Get details of a specific application
    /// </summary>
    [HttpGet("{id}")]
    [Authorize]
    public async Task<IActionResult> GetApplicationDetails(Guid id)
    {
        var application = await _applicationService.GetApplicationDetailsAsync(id);
        if (application == null) return NotFound();

        // Enforce basic candidate data isolation
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
        if (userRole == "Candidate")
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdString, out var userId) || application.Candidate.UserId != userId)
            {
                return Forbid();
            }
        }

        return Ok(application);
    }

    /// <summary>
    /// Update the status of an application
    /// </summary>
    [HttpPut("{id}/status")]
    [Authorize(Roles = "Recruiter,HiringManager,Admin")]
    public async Task<IActionResult> UpdateApplicationStatus(
        Guid id, 
        [FromBody] UpdateApplicationStatusRequest request)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdString, out var userId)) return Unauthorized();

        var success = await _applicationService.UpdateApplicationStatusAsync(id, request.Status, userId);
        if (!success) return BadRequest("Unable to update status. Ensure the status value is valid.");

        return Ok(new { message = "Application status updated successfully." });
    }
}
