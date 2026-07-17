import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select } from "@/components/ui/Input";
import { ErrorAlert } from "@/components/common/ErrorAlert";
import { useRegister } from "@/hooks/useAuth";
import { extractErrorMessage } from "@/api/client";
import { homeForRole } from "@/routes/guards";
import { UserRole } from "@/types/enums";

const roleDescriptions: Record<string, string> = {
  Candidate: "Search jobs, apply, and track interviews",
  Recruiter: "Post jobs and manage your pipeline",
  HiringManager: "Review candidates and make decisions",
  Admin: "Oversee jobs and platform activity",
};

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<string>("Candidate");
  const [error, setError] = useState<string | null>(null);
  const register = useRegister();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const result = await register.mutateAsync({ fullName, email, password, confirmPassword, role });
      if (!result.success) {
        setError(result.message || "Registration failed.");
        return;
      }
      navigate(homeForRole(result.user?.role), { replace: true });
    } catch (err) {
      setError(extractErrorMessage(err, "Registration failed. Please try again."));
    }
  }

  return (
    <AuthLayout>
      <h1 className="text-2xl font-display font-bold text-ink mb-1.5">Create your account</h1>
      <p className="text-sm text-ink-muted mb-8">Join RecruitSphere AI in under a minute.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <ErrorAlert message={error} />

        <div>
          <Label htmlFor="fullName">Full name</Label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint" />
            <Input
              id="fullName"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Jane Cooper"
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint" />
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm</Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="role">I am a</Label>
          <Select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
            {UserRole.map((r) => (
              <option key={r} value={r}>
                {r === "HiringManager" ? "Hiring Manager" : r}
              </option>
            ))}
          </Select>
          <p className="text-xs text-ink-faint mt-1.5">{roleDescriptions[role]}</p>
        </div>

        <Button type="submit" className="w-full" size="lg" loading={register.isPending}>
          Create account
        </Button>
      </form>

      <p className="text-sm text-ink-muted mt-8 text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-indigo-accent font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
