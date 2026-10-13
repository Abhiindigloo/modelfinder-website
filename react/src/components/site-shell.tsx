import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

const NAV = [
  { to: "/analytics", label: "Analytics" },
  { to: "/start", label: "Get started" },
  { to: "/support", label: "Support" },
] as const;

export function SiteShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-line bg-paper/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <Link to="/" className="flex items-center gap-3 text-xl font-semibold no-underline">
            <span className="rounded-lg bg-ink px-2 font-display text-3xl leading-none text-lime italic">
              m<span className="text-paper">f</span>
            </span>
            Model Finder
          </Link>
          <nav className="hidden items-center gap-8 text-sm md:flex" aria-label="Main">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="no-underline hover:underline"
                activeProps={{ className: "underline" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-md border border-line bg-card md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
        {open ? (
          <nav id="mobile-nav" className="border-t border-line px-5 py-3 md:hidden" aria-label="Main">
            <ul className="flex flex-col">
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="flex min-h-11 items-center text-base no-underline"
                    activeProps={{ className: "font-semibold" }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </header>
      {children}
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-5 py-8 text-sm text-muted">
          <Link to="/" className="font-semibold text-ink no-underline">
            Model Finder
          </Link>
          <p>Published by Indigloo.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 md:ml-auto">
            <Link to="/security" className="text-ink no-underline hover:underline">
              Security
            </Link>
            <Link to="/support" className="text-ink no-underline hover:underline">
              Support
            </Link>
            <Link to="/privacy" className="text-ink no-underline hover:underline">
              Privacy
            </Link>
            <Link to="/terms" className="text-ink no-underline hover:underline">
              Terms
            </Link>
            <a
              className="text-ink hover:underline"
              href="https://github.com/Abhiindigloo/modelfinder-website"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function Doc({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <SiteShell>
      <main className="mx-auto min-h-[70vh] max-w-3xl px-5 py-12">
        <p className="mb-4 text-xs font-semibold tracking-widest">{eyebrow}</p>
        <h1 className="mb-8 font-display text-5xl leading-none font-medium tracking-tight">{title}</h1>
        <div className="space-y-4 text-muted [&_a]:text-ink [&_a]:underline [&_h2]:mt-8 [&_h2]:mb-2 [&_h2]:font-sans [&_h2]:text-2xl [&_h2]:font-medium [&_h2]:tracking-tight [&_h2]:text-ink [&_strong]:text-ink">
          {children}
        </div>
      </main>
    </SiteShell>
  );
}
