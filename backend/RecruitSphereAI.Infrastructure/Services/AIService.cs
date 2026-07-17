// RecruitSphereAI.Infrastructure/Services/AIService.cs
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using RecruitSphereAI.Core.Interfaces;

namespace RecruitSphereAI.Infrastructure.Services;

public class AIService : IAIService
{
    private const string AnthropicApiUrl = "https://api.anthropic.com/v1/messages";
    private const string AnthropicVersion = "2023-06-01";
    private const string Model = "claude-3-5-haiku-latest";

    private readonly HttpClient _httpClient;
    private readonly ILogger<AIService> _logger;
    private readonly string _apiKey;

    // HttpClient is injected via IHttpClientFactory (see the AddHttpClient<> registration
    // in Program.cs) rather than "new HttpClient()"'d here, to avoid socket exhaustion.
    public AIService(HttpClient httpClient, IConfiguration configuration, ILogger<AIService> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
        _apiKey = configuration["Anthropic:ApiKey"] ?? string.Empty;
    }

    public async Task<string> ParseResumeAsync(string resumeText)
    {
        if (string.IsNullOrWhiteSpace(_apiKey))
            return MockParseResume();

        const string systemPrompt =
            "You are a resume parser for a recruitment platform. Given raw resume text, extract and " +
            "summarize the candidate's key skills, years of experience, and education in 2-4 concise " +
            "sentences of plain text. Do not use markdown formatting or headers.";

        try
        {
            return await CallClaudeAsync(systemPrompt, resumeText, maxTokens: 400);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Claude API call failed in ParseResumeAsync; falling back to a mock summary.");
            return MockParseResume();
        }
    }

    public async Task<decimal> CalculateMatchScoreAsync(string candidateProfile, string jobDescription)
    {
        if (string.IsNullOrWhiteSpace(_apiKey))
            return MockMatchScore();

        const string systemPrompt =
            "You are an ATS matching engine. Compare a candidate's profile against a job description and " +
            "score how well they match from 0 to 100. Respond with ONLY a JSON object in the exact form " +
            "{\"score\": <integer 0-100>} and nothing else - no markdown, no explanation.";

        var userMessage = $"Candidate profile:\n{candidateProfile}\n\nJob description:\n{jobDescription}";

        try
        {
            var raw = await CallClaudeAsync(systemPrompt, userMessage, maxTokens: 50);
            var json = ExtractJson(raw);
            using var doc = JsonDocument.Parse(json);
            var score = doc.RootElement.GetProperty("score").GetInt32();
            return Math.Clamp(score, 0, 100);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Claude API call failed in CalculateMatchScoreAsync; falling back to a mock score.");
            return MockMatchScore();
        }
    }

    public async Task<List<string>> ExtractSkillsAsync(string text)
    {
        if (string.IsNullOrWhiteSpace(_apiKey))
            return MockSkills();

        const string systemPrompt =
            "You extract professional skills (technologies, tools, methodologies, soft skills) mentioned in " +
            "a piece of text. Respond with ONLY a JSON array of short skill strings and nothing else - no " +
            "markdown, no explanation. Example: [\"React\", \"SQL Server\", \"Team Leadership\"]";

        try
        {
            var raw = await CallClaudeAsync(systemPrompt, text, maxTokens: 300);
            var json = ExtractJson(raw);
            var skills = JsonSerializer.Deserialize<List<string>>(json);
            return skills ?? MockSkills();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Claude API call failed in ExtractSkillsAsync; falling back to a mock skill list.");
            return MockSkills();
        }
    }

    public async Task<string> GenerateJobRecommendationAsync(string candidateSkills)
    {
        if (string.IsNullOrWhiteSpace(_apiKey))
            return MockRecommendation(candidateSkills);

        const string systemPrompt =
            "You are a career advisor for a recruitment platform. Given a candidate's skills, recommend 2-3 " +
            "specific job titles that would suit them and briefly say why, in 2-4 concise sentences of plain " +
            "text. Do not use markdown formatting or headers.";

        try
        {
            return await CallClaudeAsync(systemPrompt, candidateSkills, maxTokens: 300);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Claude API call failed in GenerateJobRecommendationAsync; falling back to a mock recommendation.");
            return MockRecommendation(candidateSkills);
        }
    }

    // --- Anthropic API call --------------------------------------------------------------------

    private async Task<string> CallClaudeAsync(string systemPrompt, string userMessage, int maxTokens)
    {
        var payload = new AnthropicRequest
        {
            Model = Model,
            MaxTokens = maxTokens,
            System = systemPrompt,
            Messages = new[] { new AnthropicMessage { Role = "user", Content = userMessage } },
        };

        using var request = new HttpRequestMessage(HttpMethod.Post, AnthropicApiUrl);
        request.Headers.Add("x-api-key", _apiKey);
        request.Headers.Add("anthropic-version", AnthropicVersion);
        request.Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

        using var response = await _httpClient.SendAsync(request);
        var responseBody = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
            throw new InvalidOperationException($"Anthropic API returned {(int)response.StatusCode}: {responseBody}");

        var parsed = JsonSerializer.Deserialize<AnthropicResponse>(responseBody);
        var text = parsed?.Content?.FirstOrDefault(c => c.Type == "text")?.Text;

        if (string.IsNullOrWhiteSpace(text))
            throw new InvalidOperationException("Anthropic API returned no text content.");

        return text.Trim();
    }

    /// <summary>Strips ```json fences (or plain ``` fences) that Claude sometimes wraps structured output in.</summary>
    private static string ExtractJson(string raw)
    {
        var trimmed = raw.Trim();
        if (trimmed.StartsWith("```"))
        {
            var firstNewline = trimmed.IndexOf('\n');
            trimmed = firstNewline >= 0 ? trimmed[(firstNewline + 1)..] : trimmed;
            var lastFence = trimmed.LastIndexOf("```", StringComparison.Ordinal);
            if (lastFence >= 0) trimmed = trimmed[..lastFence];
        }
        return trimmed.Trim();
    }

    // --- Mock fallbacks (used only when no API key is configured, or the API call fails) -------

    private static string MockParseResume() =>
        "Skills: C#, ASP.NET Core, React, SQL Server, REST API | Experience: 4 years | Education: BSc Computer Science";

    private static decimal MockMatchScore() => Random.Shared.Next(65, 98);

    private static List<string> MockSkills() =>
        new() { "C#", ".NET", "React", "SQL Server", "REST API", "Entity Framework", "JavaScript" };

    private static string MockRecommendation(string candidateSkills) =>
        string.IsNullOrEmpty(candidateSkills)
            ? "We recommend applying for Senior Software Engineer and Full Stack Developer positions."
            : $"Based on your skills ({candidateSkills}), we recommend: Software Architect, Backend Developer, and Technical Lead roles.";

    // --- Anthropic API wire format (internal to this service only) -----------------------------

    private class AnthropicRequest
    {
        [JsonPropertyName("model")]
        public string Model { get; set; } = string.Empty;

        [JsonPropertyName("max_tokens")]
        public int MaxTokens { get; set; }

        [JsonPropertyName("system")]
        public string? System { get; set; }

        [JsonPropertyName("messages")]
        public AnthropicMessage[] Messages { get; set; } = Array.Empty<AnthropicMessage>();
    }

    private class AnthropicMessage
    {
        [JsonPropertyName("role")]
        public string Role { get; set; } = string.Empty;

        [JsonPropertyName("content")]
        public string Content { get; set; } = string.Empty;
    }

    private class AnthropicResponse
    {
        [JsonPropertyName("content")]
        public List<AnthropicContentBlock>? Content { get; set; }
    }

    private class AnthropicContentBlock
    {
        [JsonPropertyName("type")]
        public string Type { get; set; } = string.Empty;

        [JsonPropertyName("text")]
        public string? Text { get; set; }
    }
}