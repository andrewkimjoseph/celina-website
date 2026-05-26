import { Link } from "@tanstack/react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faNpm } from "@fortawesome/free-brands-svg-icons";
import { ThemeToggle } from "@/components/theme-toggle";
import celinaLogoCelo from "@/assets/celina-logo-celo.png";
import celinaLogoBlack from "@/assets/celina-logo-black.png";

const NPM_URL = "https://www.npmjs.com/package/@andrewkimjoseph/celina";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-foreground/10 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={celinaLogoBlack} alt="Celina" width={36} height={36} className="h-9 w-9 dark:hidden" />
          <img src={celinaLogoCelo} alt="" aria-hidden width={36} height={36} className="hidden h-9 w-9 dark:block" />
          <span className="font-display text-lg font-semibold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            Celina
          </span>
          <span className="hidden text-xs uppercase tracking-[0.18em] text-muted-foreground sm:inline">· Celo MCP</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            activeProps={{ className: "text-foreground" }}
            className="hidden rounded-md px-3 py-1.5 text-foreground/70 transition hover:text-foreground sm:inline"
          >
            Home
          </Link>
          <Link
            to="/tools"
            activeProps={{ className: "text-foreground" }}
            className="hidden rounded-md px-3 py-1.5 text-foreground/70 transition hover:text-foreground sm:inline"
          >
            Tools
          </Link>
          <Link
            to="/stats"
            activeProps={{ className: "text-foreground" }}
            className="hidden rounded-md px-3 py-1.5 text-foreground/70 transition hover:text-foreground sm:inline"
          >
            Stats
          </Link>
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
      </div>
    </header>
  );
}