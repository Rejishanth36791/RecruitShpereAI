import { useState } from "react";
import { Menu, LogOut, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { getInitials, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-base-border bg-base/70 backdrop-blur-xl px-4 sm:px-6">
      <button
        onClick={onMenuClick}
        className="lg:hidden rounded-lg p-2 text-ink-muted hover:text-ink hover:bg-base-elevated focus-ring"
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden lg:block" />

      <div className="relative">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-3 rounded-xl px-2 py-1.5 hover:bg-base-elevated transition-colors focus-ring"
        >
          <div className="h-9 w-9 rounded-full bg-brand-gradient flex items-center justify-center text-xs font-semibold text-white shadow-glow">
            {getInitials(user?.fullName ?? "?")}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-ink leading-none">{user?.fullName}</p>
            <p className="text-xs text-ink-muted mt-0.5">{user?.email}</p>
          </div>
          <ChevronDown className={cn("h-4 w-4 text-ink-muted transition-transform", menuOpen && "rotate-180")} />
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-full mt-2 w-56 glass-panel z-20 p-2 animate-scale-in origin-top-right">
              <div className="px-3 py-2 border-b border-base-border/60 mb-1">
                <Badge tone="indigo">{user?.role}</Badge>
              </div>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink-muted hover:text-danger hover:bg-danger/10 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
