/**
 * The backend's System.Text.Json options only set `ReferenceHandler.IgnoreCycles`
 * — there is no JsonStringEnumConverter registered in Program.cs. That means:
 *
 *  - Enum values on ENTITIES returned directly from controllers (JobPosting.Status,
 *    Application.Status, Interview.Status) come back over the wire as plain numbers,
 *    matching the C# enum's declaration order.
 *  - Enum-like values sent in REQUEST DTOs (UpdateJobStatusRequest.Status,
 *    UpdateApplicationStatusRequest.Status, UpdateInterviewStatusRequest.Status) are
 *    plain strings, parsed with Enum.Parse on the server.
 *  - UserRole is the one place the API already converts to string for us
 *    (`user.Role.ToString()`), so UserDto.role arrives as a string.
 *
 * These maps mirror RecruitSphereEnums.cs exactly so the numbers line up.
 */

export const JobStatus = ["Draft", "Published", "Closed", "Archived"] as const;
export type JobStatusLabel = (typeof JobStatus)[number];

export const ApplicationStatus = ["Submitted", "UnderReview", "Interviewing", "Accepted", "Rejected"] as const;
export type ApplicationStatusLabel = (typeof ApplicationStatus)[number];

export const InterviewStatus = ["Scheduled", "Completed", "Cancelled", "NoShow"] as const;
export type InterviewStatusLabel = (typeof InterviewStatus)[number];

export const UserRole = ["Candidate", "Recruiter", "HiringManager", "Admin"] as const;
export type UserRoleLabel = (typeof UserRole)[number];

/** Convert a raw numeric enum value (or an already-stringified one) from the API into its label. */
export function jobStatusLabel(value: number | string): JobStatusLabel {
  return (typeof value === "number" ? JobStatus[value] : (value as JobStatusLabel)) ?? "Draft";
}
export function applicationStatusLabel(value: number | string): ApplicationStatusLabel {
  return (typeof value === "number" ? ApplicationStatus[value] : (value as ApplicationStatusLabel)) ?? "Submitted";
}
export function interviewStatusLabel(value: number | string): InterviewStatusLabel {
  return (typeof value === "number" ? InterviewStatus[value] : (value as InterviewStatusLabel)) ?? "Scheduled";
}
