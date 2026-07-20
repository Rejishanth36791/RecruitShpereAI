import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { ProtectedRoute, RoleRoute } from "@/routes/guards";
import { RootRedirect } from "@/routes/RootRedirect";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import NotFoundPage from "@/pages/NotFoundPage";

import CandidateDashboard from "@/pages/candidate/CandidateDashboard";
import JobSearchPage from "@/pages/candidate/JobSearchPage";
import JobDetailsPage from "@/pages/candidate/JobDetailsPage";
import MyApplicationsPage from "@/pages/candidate/MyApplicationsPage";
import MyInterviewsPage from "@/pages/candidate/MyInterviewsPage";
import AIToolsPage from "@/pages/candidate/AIToolsPage";

import RecruiterDashboard from "@/pages/recruiter/RecruiterDashboard";
import PostJobPage from "@/pages/recruiter/PostJobPage";
import MyJobsPage from "@/pages/recruiter/MyJobsPage";
import JobApplicantsPage from "@/pages/recruiter/JobApplicantsPage";

import ManagerDashboard from "@/pages/manager/ManagerDashboard";
import ManagerJobsPage from "@/pages/manager/ManagerJobsPage";
import ManagerApplicantsPage from "@/pages/manager/ManagerApplicantsPage";

import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";
import AdminJobsPage from "@/pages/admin/AdminJobsPage";
import AdminAnalyticsPage from "@/pages/admin/AdminAnalyticsPage";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* Candidate portal */}
            <Route
              path="/candidate"
              element={
                <RoleRoute allow={["Candidate"]}>
                  <CandidateDashboard />
                </RoleRoute>
              }
            />
            <Route
              path="/candidate/jobs"
              element={
                <RoleRoute allow={["Candidate"]}>
                  <JobSearchPage />
                </RoleRoute>
              }
            />
            <Route
              path="/candidate/jobs/:id"
              element={
                <RoleRoute allow={["Candidate"]}>
                  <JobDetailsPage />
                </RoleRoute>
              }
            />
            <Route
              path="/candidate/applications"
              element={
                <RoleRoute allow={["Candidate"]}>
                  <MyApplicationsPage />
                </RoleRoute>
              }
            />
            <Route
              path="/candidate/interviews"
              element={
                <RoleRoute allow={["Candidate"]}>
                  <MyInterviewsPage />
                </RoleRoute>
              }
            />
            <Route
              path="/candidate/ai-tools"
              element={
                <RoleRoute allow={["Candidate"]}>
                  <AIToolsPage />
                </RoleRoute>
              }
            />

            {/* Recruiter portal */}
            <Route
              path="/recruiter"
              element={
                <RoleRoute allow={["Recruiter", "Admin"]}>
                  <RecruiterDashboard />
                </RoleRoute>
              }
            />
            <Route
              path="/recruiter/jobs/new"
              element={
                <RoleRoute allow={["Recruiter", "Admin"]}>
                  <PostJobPage />
                </RoleRoute>
              }
            />
            <Route
              path="/recruiter/jobs"
              element={
                <RoleRoute allow={["Recruiter", "Admin"]}>
                  <MyJobsPage />
                </RoleRoute>
              }
            />
            <Route
              path="/recruiter/jobs/:id/applicants"
              element={
                <RoleRoute allow={["Recruiter", "Admin"]}>
                  <JobApplicantsPage />
                </RoleRoute>
              }
            />

            {/* Hiring manager portal */}
            <Route
              path="/manager"
              element={
                <RoleRoute allow={["HiringManager", "Admin"]}>
                  <ManagerDashboard />
                </RoleRoute>
              }
            />
            <Route
              path="/manager/applications"
              element={
                <RoleRoute allow={["HiringManager", "Admin"]}>
                  <ManagerJobsPage />
                </RoleRoute>
              }
            />
            <Route
              path="/manager/jobs/:id/applicants"
              element={
                <RoleRoute allow={["HiringManager", "Admin"]}>
                  <ManagerApplicantsPage />
                </RoleRoute>
              }
            />

            {/* Admin portal */}
            <Route
              path="/admin"
              element={
                <RoleRoute allow={["Admin"]}>
                  <AdminDashboard />
                </RoleRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <RoleRoute allow={["Admin"]}>
                  <AdminUsersPage />
                </RoleRoute>
              }
            />
            <Route
              path="/admin/jobs"
              element={
                <RoleRoute allow={["Admin"]}>
                  <AdminJobsPage />
                </RoleRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <RoleRoute allow={["Admin"]}>
                  <AdminAnalyticsPage />
                </RoleRoute>
              }
            />
          </Route>

          <Route path="/" element={<RootRedirect />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
