import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { ErrorAlert } from "@/components/common/ErrorAlert";
import { useLogin } from "@/hooks/useAuth";
import { extractErrorMessage } from "@/api/client";
import { homeForRole } from "@/routes/guards";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const login = useLogin();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const result = await login.mutateAsync({ email, password });
      if (!result.success) {
        setError(result.message || "Invalid email or password.");
        return;
      }
      const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
      navigate(from || homeForRole(result.user?.role), { replace: true });
    } catch (err) {
      setError(extractErrorMessage(err, "Invalid email or password."));
    }
  }

  return (
    <AuthLayout>
      <h1 className="text-2xl font-display font-bold text-ink mb-1.5">Welcome back</h1>
      <p className="text-sm text-ink-muted mb-8">Sign in to your RecruitSphere AI account.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <ErrorAlert message={error} />

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

        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint" />
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="pl-10"
            />
          </div>
        </div>

        <Button type="submit" className="w-full" size="lg" loading={login.isPending}>
          Sign in
        </Button>
      </form>

      <p className="text-sm text-ink-muted mt-8 text-center">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="text-indigo-accent font-medium hover:underline">
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
}
