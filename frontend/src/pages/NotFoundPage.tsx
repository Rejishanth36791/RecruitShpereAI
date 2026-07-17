import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/common/Logo";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <Logo className="mb-8" />
      <p className="text-sm font-semibold text-indigo-accent uppercase tracking-wider mb-2">404</p>
      <h1 className="text-3xl font-display font-bold text-ink mb-3">Page not found</h1>
      <p className="text-ink-muted max-w-sm mb-8">
        The page you're looking for doesn't exist or you don't have access to it.
      </p>
      <Link to="/">
        <Button>Back to home</Button>
      </Link>
    </div>
  );
}
