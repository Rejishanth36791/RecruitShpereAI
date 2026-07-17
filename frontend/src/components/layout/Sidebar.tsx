import { NavLink } from "react-router-dom";
import { Logo } from "@/components/common/Logo";
import { navByRole } from "@/components/layout/navConfig";
import { cn } from "@/lib/utils";

export function Sidebar({ role, mobileOpen, onClose }: { role: string; mobileOpen: boolean; onClose: () => void }) {
  const items = navByRole[role] ?? [];

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden" onClick={onClose} />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 shrink-0 border-r border-base-border bg-base-surface/80 backdrop-blur-xl px-4 py-6 flex flex-col transition-transform duration-300 lg:static lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="px-2 mb-8">
          <Logo />
        </div>

        <nav className="flex-1 space-y-1">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-brand-gradient-soft text-ink border border-indigo-accent/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                    : "text-ink-muted hover:text-ink hover:bg-base-elevated",
                )
              }
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-base-border/60 px-1">
          <p className="text-xs text-ink-faint leading-relaxed">
            RecruitSphere AI
          </p>
        </div>
      </aside>
    </>
  );
}
