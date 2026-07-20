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
public class InterviewsController : ControllerBase
{
    private readonly IInterviewService _interviewService;
    private readonly RecruitSphereDbContext _context;
    private readonly ILogger<InterviewsController> _logger;

    public InterviewsController(
        IInterviewService interviewService,
        RecruitSphereDbContext context,
        ILogger<InterviewsController> logger)
    {
        _interviewService = interviewService;
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Schedule a new interview for an application
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Recruiter,HiringManager,Admin")]
    public async Task<IActionResult> ScheduleInterview([FromBody] ScheduleInterviewRequest request)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var interview = await _interviewService.ScheduleInterviewAsync(
            request.ApplicationId,
            request.ScheduledDate,
            request.Mode);

        _logger.LogInformation($"Scheduled interview {interview.Id} for application {request.ApplicationId}");
        return Created("", interview);
    }

    /// <summary>
    /// Get interviews for the logged-in candidate or recruiter
    /// </summary>
    [HttpGet("my")]
    [Authorize]
    public async Task<IActionResult> GetMyInterviews()
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdString, out var userId)) return Unauthorized();

        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

        if (userRole == "Candidate")
        {
            var candidate = await _context.Candidates.FirstOrDefaultAsync(c => c.UserId == userId);
            if (candidate == null) return Ok(Enumerable.Empty<Interview>());

            var interviews = await _interviewService.GetInterviewsByCandidateAsync(candidate.Id);
            return Ok(interviews);
        }
        else if (userRole == "Recruiter" || userRole == "HiringManager" || userRole == "Admin")
        {
            var recruiter = await _context.Recruiters.FirstOrDefaultAsync(r => r.UserId == userId);
            if (recruiter == null)
            {
                // Attempt to resolve HiringManager or Admin as recruiter role for database compatibility
                var hiringManager = await _context.HiringManagers.FirstOrDefaultAsync(h => h.UserId == userId);
                if (hiringManager == null) return Ok(Enumerable.Empty<Interview>());
                
                // Fetch using hiring manager ID or fallback to empty
                return Ok(Enumerable.Empty<Interview>());
            }

            var interviews = await _interviewService.GetInterviewsByRecruiterAsync(recruiter.Id);
            return Ok(interviews);
        }

        return Ok(Enumerable.Empty<Interview>());
    }

    /// <summary>
    /// Update status of an interview
    /// </summary>
    [HttpPut("{id}/status")]
    [Authorize(Roles = "Recruiter,HiringManager,Admin")]
    public async Task<IActionResult> UpdateInterviewStatus(Guid id, [FromBody] UpdateInterviewStatusRequest request)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var success = await _interviewService.UpdateInterviewStatusAsync(id, request.Status);
        if (!success) return BadRequest("Unable to update status. Ensure the status value is valid.");

        return Ok(new { message = "Interview status updated successfully." });
    }
}
