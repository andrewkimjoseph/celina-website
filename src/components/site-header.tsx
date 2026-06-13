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
import celinaLogoCelo from "@/assets/celina-logo-celo.png";
import celinaLogoBlack from "@/assets/celina-logo-black.png";

const NPM_URL = "https://www.npmjs.com/package/@andrewkimjoseph/celina-mcp";

const NAV_LINKS = [
  { to: "/", label: "Home", exact: true },
  { to: "/about", label: "About" },
  { to: "/tools", label: "Tools" },
  { to: "/mcp", label: "MCP" },
  { to: "/stack", label: "Stack" },
  { to: "/sdk", label: "SDK" },
  { to: "/stats", label: "Stats" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-foreground/10 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <img src={celinaLogoBlack} alt="Celina" width={36} height={36} className="h-9 w-9 dark:hidden" />
          <img src={celinaLogoCelo} alt="" aria-hidden width={36} height={36} className="hidden h-9 w-9 dark:block" />
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
              activeProps={{ className: "text-foreground" }}
              className="rounded-md px-3 py-1.5 text-foreground/70 transition hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={NPM_URL}
            target="_blank"
            rel="noreferrer"
            className="ml-1 inline-flex items-center gap-1.5 rounded-md bg-[var(--celo-forest)] px-3 py-1.5 text-sm font-medium text-[var(--celo-cream)] transition hover:bg-[var(--celo-deep)] hover:text-[var(--celo-cream)] dark:bg-white dark:text-[var(--celo-ink)] dark:hover:bg-[var(--celo-yellow)] dark:hover:text-[var(--celo-ink)]"
          >
            <FontAwesomeIcon icon={faNpm} className="h-3.5 w-3.5" /> npm
          </a>
          <ThemeToggle />
        </nav>
        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              aria-label="Open menu"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground/80 transition hover:bg-muted hover:text-foreground"
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
                        "rounded-md bg-muted px-3 py-2 font-semibold text-foreground",
                    }}
                    className="rounded-md px-3 py-2 text-foreground/75 transition hover:bg-muted hover:text-foreground"
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
                  className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-md bg-[var(--celo-forest)] px-3 py-2 text-sm font-medium text-[var(--celo-cream)] transition hover:bg-[var(--celo-deep)] dark:bg-white dark:text-[var(--celo-ink)] dark:hover:bg-[var(--celo-yellow)]"
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