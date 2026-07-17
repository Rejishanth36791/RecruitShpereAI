using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecruitSphereAI.Core.Common.Dtos;
using RecruitSphereAI.Core.Interfaces;
using RecruitSphereAI.Infrastructure.Authentication;
using System.Security.Claims;

namespace RecruitSphereAI.Api.Controllers;

/// <summary>
/// Controller for user authentication (register, login, refresh token)
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IJwtService _jwtService;
    private readonly IRefreshTokenService _refreshTokenService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(
        IAuthService authService,
        IJwtService jwtService,
        IRefreshTokenService refreshTokenService,
        ILogger<AuthController> logger)
    {
        _authService = authService;
        _jwtService = jwtService;
        _refreshTokenService = refreshTokenService;
        _logger = logger;
    }

    /// <summary>
    /// Register a new user
    /// </summary>
    /// <param name="request">Registration details</param>
    /// <returns>User info with tokens</returns>
    [HttpPost("register")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new AuthResponse 
            { 
                Success = false, 
                Message = "Invalid request" 
            });
        }

        // Validate passwords match
        if (request.Password != request.ConfirmPassword)
        {
            return BadRequest(new AuthResponse 
            { 
                Success = false, 
                Message = "Passwords do not match" 
            });
        }

        // Register user
        var (success, message, user) = await _authService.RegisterAsync(
            request.Email,
            request.FullName,
            request.Password,
            request.Role);

        if (!success || user == null)
        {
            _logger.LogWarning($"Registration failed: {message}");
            return BadRequest(new AuthResponse 
            { 
                Success = false, 
                Message = message 
            });
        }

        // Generate tokens
        var accessToken = _jwtService.GenerateAccessToken(
            user.Id, 
            user.Email.Value, 
            user.FullName, 
            user.Role.ToString());

        var refreshToken = await _refreshTokenService.CreateRefreshTokenAsync(user.Id);

        _logger.LogInformation($"User {user.Email.Value} registered successfully");

        return Ok(new AuthResponse
        {
            Success = true,
            Message = "Registration successful",
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            User = new UserDto
            {
                Id = user.Id,
                Email = user.Email.Value,
                FullName = user.FullName,
                Role = user.Role.ToString()
            }
        });
    }

    /// <summary>
    /// User login
    /// </summary>
    /// <param name="request">Login credentials</param>
    /// <returns>User info with tokens</returns>
    [HttpPost("login")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (!ModelState.IsValid)
        {
            return Unauthorized(new AuthResponse 
            { 
                Success = false, 
                Message = "Invalid credentials" 
            });
        }

        // Authenticate user
        var (success, message, user) = await _authService.LoginAsync(
            request.Email,
            request.Password);

        if (!success || user == null)
        {
            _logger.LogWarning($"Login failed for {request.Email}: {message}");
            return Unauthorized(new AuthResponse 
            { 
                Success = false, 
                Message = message 
            });
        }

        // Generate tokens
        var accessToken = _jwtService.GenerateAccessToken(
            user.Id,
            user.Email.Value,
            user.FullName,
            user.Role.ToString());

        var refreshToken = await _refreshTokenService.CreateRefreshTokenAsync(user.Id);

        _logger.LogInformation($"User {user.Email.Value} logged in successfully");

        return Ok(new AuthResponse
        {
            Success = true,
            Message = "Login successful",
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            User = new UserDto
            {
                Id = user.Id,
                Email = user.Email.Value,
                FullName = user.FullName,
                Role = user.Role.ToString()
            }
        });
    }

    /// <summary>
    /// Refresh access token using refresh token
    /// </summary>
    /// <param name="request">Current refresh token</param>
    /// <returns>New access token</returns>
    [HttpPost("refresh")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
    {
        if (string.IsNullOrEmpty(request.RefreshToken))
        {
            return Unauthorized(new AuthResponse 
            { 
                Success = false, 
                Message = "Refresh token is required" 
            });
        }

        // Extract user ID from the access token (if provided in header)
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
        {
            return Unauthorized(new AuthResponse 
            { 
                Success = false, 
                Message = "Invalid token" 
            });
        }

        // Validate refresh token
        if (!await _refreshTokenService.ValidateRefreshTokenAsync(userId, request.RefreshToken))
        {
            _logger.LogWarning($"Invalid refresh token for user {userId}");
            return Unauthorized(new AuthResponse 
            { 
                Success = false, 
                Message = "Invalid or expired refresh token" 
            });
        }

        // Get user details
        var user = await Task.Run(async () =>
        {
            var dbContext = HttpContext.RequestServices.GetRequiredService<RecruitSphereAI.Persistence.RecruitSphereDbContext>();
            return await dbContext.Users.FindAsync(userId);
        });

        if (user == null)
        {
            return Unauthorized(new AuthResponse 
            { 
                Success = false, 
                Message = "User not found" 
            });
        }

        // Generate new access token
        var accessToken = _jwtService.GenerateAccessToken(
            user.Id,
            user.Email.Value,
            user.FullName,
            user.Role.ToString());

        _logger.LogInformation($"Access token refreshed for user {user.Email.Value}");

        return Ok(new AuthResponse
        {
            Success = true,
            Message = "Token refreshed successfully",
            AccessToken = accessToken,
            RefreshToken = request.RefreshToken // Return the same refresh token
        });
    }

    /// <summary>
    /// Get current user info (requires authentication)
    /// </summary>
    /// <returns>Current user details</returns>
    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        var emailClaim = User.FindFirst(ClaimTypes.Email);
        var nameClaim = User.FindFirst(ClaimTypes.Name);
        var roleClaim = User.FindFirst(ClaimTypes.Role);

        if (userIdClaim == null)
        {
            return Unauthorized();
        }

        return Ok(new UserDto
        {
            Id = Guid.Parse(userIdClaim.Value),
            Email = emailClaim?.Value ?? string.Empty,
            FullName = nameClaim?.Value ?? string.Empty,
            Role = roleClaim?.Value ?? string.Empty
        });
    }
}
