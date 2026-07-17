import type { ReactNode } from "react";
import { Sparkles, ShieldCheck, Users2 } from "lucide-react";
import { Logo } from "@/components/common/Logo";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20">
        <div className="w-full max-w-sm mx-auto">
          <div className="mb-10">
            <Logo />
          </div>
          {children}
        </div>
      </div>

      <div className="hidden lg:flex relative overflow-hidden bg-base-surface border-l border-base-border items-center justify-center p-16">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 30% 20%, rgba(99,102,241,0.35), transparent), radial-gradient(ellipse 50% 40% at 80% 80%, rgba(168,85,247,0.25), transparent)",
          }}
        />
        <div className="relative z-10 max-w-md">
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-accent mb-4">
            AI-powered talent platform
          </p>
          <h2 className="text-3xl font-display font-bold text-ink leading-tight mb-6">
            Hire faster with AI-matched candidates and one clean pipeline.
          </h2>
          <div className="space-y-4">
            {[
              { icon: Sparkles, text: "Resume parsing and match scoring on every application" },
              { icon: Users2, text: "Dedicated portals for candidates, recruiters and hiring managers" },
              { icon: ShieldCheck, text: "Role-based access, backed by JWT authentication" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-3 glass rounded-xl p-4">
                <div className="h-8 w-8 rounded-lg bg-brand-gradient flex items-center justify-center shrink-0 shadow-glow">
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <p className="text-sm text-ink-muted pt-1">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
