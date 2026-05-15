import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthorDnaDataset } from "@/lib/author-dna-data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useAdminSession } from "@/stores/use-admin-session";

type AppHeaderProps = {
  title?: ReactNode;
  children?: ReactNode;
  showThemeToggle?: boolean;
  showBrandIcon?: boolean;
};

export default function AppHeader({
  title = "AuthorDNA",
  children,
  showThemeToggle = true,
  showBrandIcon = true,
}: AppHeaderProps) {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { session, isAuthenticated } = useAdminSession();
  const [userName, setUserName] = useState("Unknown");

  useEffect(() => {
    let isMounted = true;

    getAuthorDnaDataset()
      .then((dataset) => {
        if (isMounted) {
          setUserName(dataset.profile.name || "Unknown");
        }
      })
      .catch(() => {
        if (isMounted) {
          setUserName("Unknown");
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const displayName = session?.username || userName;
  const initials =
    displayName
      .split(/[_\s-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "AD";

  return (
    <header className="fixed inset-x-0 top-0 z-50 shrink-0 border-b border-border/70 bg-card/85 shadow-soft backdrop-blur-[20px]">
      <div className="flex items-center justify-between gap-4 px-6 py-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="app-title font-serif text-base font-semibold text-ink text-[1.2rem]">{title}</div>
            {showBrandIcon ? (
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 text-brand"
                aria-hidden="true"
                style={{height: '1.5rem', width: '1.5rem'}}
              >
                <path
                  d="M7 4c3 2 7 2 10 4s4 6 0 8-7 2-10 4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17 4c-3 2-7 2-10 4S3 14 7 16s7 2 10 4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.7"
                />
                <circle cx="12" cy="6" r="1" fill="currentColor" />
                <circle cx="12" cy="18" r="1" fill="currentColor" />
              </svg>
            ) : null}
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          {children ? <div className="flex items-center gap-3">{children}</div> : null}
          {showThemeToggle ? (
            <button
              type="button"
              className={cn("theme-toggle rounded-md p-1 flex items-center", "hover:border-brand")}
              aria-label="Toggle color theme"
              role="switch"
              aria-checked={isDark}
              onClick={toggleTheme}
            >
              <span className="sr-only">Toggle dark mode</span>
              {isDark ? <Sun className="h-5 w-5 text-ink-muted" /> : <Moon className="h-5 w-5 text-ink-muted" />}
            </button>
          ) : null}
          {isAuthenticated ? (
            <button
              type="button"
              className={cn(
                "group flex items-center gap-3 rounded-2xl px-3 text-left transition-colors",
                "hover:bg-highlight/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0",
              )}
              aria-label="进入 Workspace"
              onClick={() => navigate('/workspace/home')}
            >
              <div className="hidden text-right md:block">
                <div className="text-sm font-medium text-ink group-hover:text-brand">{displayName}</div>
              </div>
              <Avatar className="size-9 border border-border/80 bg-brand-muted shadow-sm group-hover:border-brand">
                <AvatarFallback className="bg-brand-muted text-xs font-semibold text-brand">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                className="h-9 rounded-xl border border-transparent bg-transparent px-4 text-sm font-medium text-ink-muted shadow-none hover:bg-component-hover hover:text-ink"
                onClick={() => navigate('/login')}
              >
                Sign in
              </Button>
              <Button
                type="button"
                className="h-9 rounded-xl bg-brand px-4 text-sm font-medium text-brand-foreground shadow-sm hover:bg-brand/90"
                onClick={() => navigate('/register')}
              >
                Sign up
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
