using System.Text.RegularExpressions;

namespace RecruitSphereAI.Core.Common.ValueObjects;

public sealed record EmailAddress
{
    public string Value { get; }

    public EmailAddress(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new ArgumentException("Email address is required.", nameof(value));
        }

        if (!Regex.IsMatch(value, "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$", RegexOptions.IgnoreCase))
        {
            throw new ArgumentException("Email address is invalid.", nameof(value));
        }

        Value = value.Trim().ToLowerInvariant();
    }

    public override string ToString() => Value;

    public static implicit operator string(EmailAddress emailAddress) => emailAddress.Value;

    public static implicit operator EmailAddress(string value) => new(value);
}
