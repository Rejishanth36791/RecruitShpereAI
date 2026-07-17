using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecruitSphereAI.Core.Common.Dtos;
using RecruitSphereAI.Core.Interfaces;

namespace RecruitSphereAI.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AIController : ControllerBase
{
    private readonly IAIService _aiService;
    private readonly ILogger<AIController> _logger;

    public AIController(IAIService aiService, ILogger<AIController> logger)
    {
        _aiService = aiService;
        _logger = logger;
    }

    /// <summary>
    /// Parse raw resume text into structured summary
    /// </summary>
    [HttpPost("parse-resume")]
    [Authorize(Roles = "Candidate,Recruiter,Admin")]
    public async Task<IActionResult> ParseResume([FromBody] ParseResumeRequest request)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var result = await _aiService.ParseResumeAsync(request.ResumeText);
        return Ok(new { parsedResult = result });
    }

    /// <summary>
    /// Calculate match score between a candidate profile and job description
    /// </summary>
    [HttpPost("match-score")]
    [Authorize(Roles = "Candidate,Recruiter,Admin")]
    public async Task<IActionResult> CalculateMatchScore([FromBody] CalculateMatchScoreRequest request)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var score = await _aiService.CalculateMatchScoreAsync(request.CandidateProfile, request.JobDescription);
        return Ok(new { matchScore = score });
    }

    /// <summary>
    /// Extract a list of skills from arbitrary text
    /// </summary>
    [HttpPost("extract-skills")]
    [Authorize(Roles = "Candidate,Recruiter,Admin")]
    public async Task<IActionResult> ExtractSkills([FromBody] ExtractSkillsRequest request)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var skills = await _aiService.ExtractSkillsAsync(request.Text);
        return Ok(new { skills = skills });
    }

    /// <summary>
    /// Generate job recommendations based on candidate's skills
    /// </summary>
    [HttpPost("recommend-jobs")]
    [Authorize(Roles = "Candidate")]
    public async Task<IActionResult> GenerateJobRecommendation([FromBody] GenerateJobRecommendationRequest request)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var recommendation = await _aiService.GenerateJobRecommendationAsync(request.CandidateSkills);
        return Ok(new { recommendation = recommendation });
    }
}
