# RecruitSphere AI — Frontend

A React 18 + TypeScript + Tailwind frontend for the RecruitSphere AI recruitment platform, built directly against
the ASP.NET Core backend in `../backend`. Every screen calls a real backend endpoint — there is no mock/fake data.

## Stack

- React 18, TypeScript, Vite
- Tailwind CSS (custom dark, indigo/violet/cyan design tokens — see `tailwind.config.ts`)
- React Router v6 (role-based route guards)
- Zustand (auth session, persisted to localStorage)
- TanStack React Query (server state, caching, invalidation)
- Axios (typed API clients, automatic token refresh on 401)
- Framer Motion (page/modal transitions), Lucide React (icons)

## Getting started

```bash
cd frontend
npm install
npm run dev
```

The dev server runs on `http://localhost:5173` and proxies `/api/*` to `http://localhost:5150` (see
`vite.config.ts`), so make sure the backend (`RecruitSphereAI.Api`) is running on that port — that's its default
`http` launch profile. The backend's CORS policy already allows any origin, so the proxy is a convenience, not a
requirement.

Copy `.env.example` to `.env` if you want to point at a different API origin (e.g. the `https://localhost:7126`
profile, or a deployed backend) — just set `VITE_API_BASE_URL` to the full `.../api` URL and skip the proxy.

```bash
npm run build    # type-check + production build to dist/
npm run preview  # preview the production build
```

## How the frontend maps to the backend

| Area | Backend controller | Frontend pages |
|---|---|---|
| Auth (register/login/refresh) | `AuthController` | `/login`, `/register` |
| Job postings | `JobPostingsController` | Candidate job search/detail, Recruiter/Admin "my jobs" + post job |
| Applications | `ApplicationsController` | Candidate applications, Recruiter/Manager applicant review board |
| Interviews | `InterviewsController` | Candidate interviews list, "Schedule interview" modal |
| Feedback | `FeedbackController` *(added)* | "Leave feedback" modal on the applicant review board, expandable feedback view on candidate's applications |
| Admin (users, analytics) | `AdminController` *(added)* | Admin → Users page, Admin → Analytics page |
| AI features | `AIController` | Candidate → AI tools page (resume parsing, skill extraction, match score, job recommendations) |

`FeedbackController` and `AdminController`, along with their `IFeedbackService`/`IAdminService` interfaces and
implementations, were added to `../backend` to close the gap between the original brief (Hiring Manager "give
feedback", Admin "user management, analytics") and what the API exposed. They follow the exact same patterns as
the existing controllers/services (same DI style, same `_context` + service split, same `[Authorize(Roles = ...)]`
usage) — see `backend/RecruitSphereAI.Api/Controllers/{Feedback,Admin}Controller.cs`.

Types in `src/types/api.ts` are hand-mirrored from the backend's `Entities`/`Dtos`. One backend quirk worth knowing:
**`Program.cs` doesn't register a `JsonStringEnumConverter`**, so `JobPosting.Status`, `Application.Status`, and
`Interview.Status` come back over the wire as **numbers** (enum ordinals), while the corresponding `Update*Request`
DTOs expect **strings**. `src/types/enums.ts` centralizes that mapping — always read status through
`jobStatusLabel()` / `applicationStatusLabel()` / `interviewStatusLabel()` rather than comparing raw numbers.

## Known gaps (backend, not frontend)

- **Refresh token flow mirrors the backend as written.** `POST /api/auth/refresh` reads the caller's identity off
  the *existing* access token's claims even though the endpoint is `[AllowAnonymous]` — which only works within
  the ~15s clock-skew window after the 15-minute access token expires. The frontend replicates this faithfully
  (attaches the still-parseable token + refresh token, retries the original request once), but if the token is
  fully expired the user will be redirected to `/login` rather than silently refreshed.
- **`GET /api/jobpostings` (used by "all jobs" views) only returns `Published` postings** — that's how
  `JobService.GetAllJobsAsync` is written. The Admin "All job postings" page and analytics both note this;
  `GET /api/admin/analytics` is the one place that reports true platform-wide totals across every status.
- **`SkillAssessment`, `Document`, `Notification`, and `AuditLog`** have entities and DB tables but no
  controllers — they weren't part of the four portals in the original brief, so no frontend pages were built
  against them. Straightforward to add later following the same controller/service pattern if needed.

## Project structure

```
src/
  api/          Axios instance + one module per backend controller (incl. feedback.ts, admin.ts)
  components/
    ui/         Button, Card, Input, Badge, Modal, Skeleton — shared primitives
    common/     Logo, PageHeader, EmptyState, StatusBadge, StatCard, ErrorAlert
    layout/     Sidebar, Topbar, DashboardLayout, AuthLayout, role-based nav config
    jobs/       JobCard
    applications/ ApplicantsBoard, FeedbackModal (recruiter/manager applicant review + feedback)
    interviews/ ScheduleInterviewModal
  hooks/        React Query hooks per domain (useJobs, useApplications, useInterviews, useAI, useAuth, useFeedback, useAdmin)
  pages/
    auth/       Login, Register
    candidate/  Dashboard, job search, job details, applications (+ feedback view), interviews, AI tools
    recruiter/  Dashboard, post job, my jobs, applicant review
    manager/    Dashboard, job picker, applicant review
    admin/      Dashboard, users, all jobs, analytics
  routes/       ProtectedRoute / RoleRoute guards, role → home-route mapping
  store/        Zustand auth store (persisted)
  types/        Hand-mirrored API types + enum-ordinal mapping
  styles/       Tailwind entry + glass/gradient utility classes
```
