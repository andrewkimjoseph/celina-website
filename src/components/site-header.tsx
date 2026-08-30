import { Link } from "@tanstack/react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faNpm } from "@fortawesome/free-brands-svg-icons";
import { Menu } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const NPM_URL = "https://www.npmjs.com/package/@andrewkimjoseph/celina-mcp";

type NavLink = { to: string; label: string; exact?: boolean };
const NAV_LINKS: NavLink[] = [
  { to: "/", label: "Home", exact: true },
  { to: "/about", label: "About" },
  { to: "/api", label: "API" },
  { to: "/tools", label: "Tools" },
  { to: "/mcp", label: "MCP" },
  { to: "/a2a", label: "A2A" },
  { to: "/oasf", label: "OASF" },
  { to: "/stack", label: "Stack" },
  { to: "/sdk", label: "SDK" },
  { to: "/stats", label: "Stats" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b-2 border-foreground bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <img src="/celina-logo-black.png" alt="Celina" width={36} height={36} className="h-9 w-9 dark:hidden" />
          <img src="/celina-logo-yellow.png" alt="" aria-hidden width={36} height={36} className="hidden h-9 w-9 dark:block" />
          <span className="font-display text-lg font-semibold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            Celina
          </span>
        </Link>
        <nav className="hidden items-center gap-1 text-sm lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeOptions={link.exact ? { exact: true } : undefined}
              activeProps={{ className: "border-2 border-foreground text-foreground" }}
              className="rounded-[2px] border-2 border-transparent px-3 py-1.5 text-foreground/70 transition hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={NPM_URL}
            target="_blank"
            rel="noreferrer"
            className="ml-1 inline-flex items-center gap-1.5 rounded-[2px] border-2 border-foreground bg-[var(--celo-forest)] px-3 py-1.5 text-sm font-medium text-[var(--celo-cream)] shadow-[var(--shadow-brutal-sm)] transition-[transform,box-shadow] hover:bg-[var(--celo-deep)] hover:text-[var(--celo-cream)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none dark:bg-[var(--celo-yellow)] dark:text-[var(--celo-ink)] dark:hover:bg-[var(--celo-cream)] dark:hover:text-[var(--celo-ink)]"
          >
            <FontAwesomeIcon icon={faNpm} className="h-3.5 w-3.5" /> npm
          </a>
          <ThemeToggle className="ml-3" />
        </nav>
        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              aria-label="Open menu"
              className="inline-flex h-9 w-9 items-center justify-center rounded-[2px] border-2 border-transparent text-foreground/80 transition hover:border-foreground hover:bg-muted hover:text-foreground"
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72 sm:max-w-xs">
              <SheetHeader>
                <SheetTitle style={{ fontFamily: "var(--font-display)" }}>Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1 text-base">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    activeOptions={link.exact ? { exact: true } : undefined}
                    activeProps={{
                      className:
                        "rounded-[2px] border-2 border-foreground bg-muted px-3 py-2 font-semibold text-foreground",
                    }}
                    className="rounded-[2px] border-2 border-transparent px-3 py-2 text-foreground/75 transition hover:bg-muted hover:text-foreground"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <a
                  href={NPM_URL}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setOpen(false)}
                  className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-[2px] border-2 border-foreground bg-[var(--celo-forest)] px-3 py-2 text-sm font-medium text-[var(--celo-cream)] shadow-[var(--shadow-brutal-sm)] transition-[transform,box-shadow] hover:bg-[var(--celo-deep)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none dark:bg-[var(--celo-yellow)] dark:text-[var(--celo-ink)] dark:hover:bg-[var(--celo-cream)]"
                >
                  <FontAwesomeIcon icon={faNpm} className="h-4 w-4" /> npm
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}