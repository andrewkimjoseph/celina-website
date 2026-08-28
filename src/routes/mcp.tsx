import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlug } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faNpm } from "@fortawesome/free-brands-svg-icons";
import { PageHero, PageHeroSection, type Crumb } from "@/components/marketing/page-hero";
import { SiteHeader } from "@/components/site-header";
import { MCP_GITHUB_URL, MCP_NPM_URL } from "@/data/mcp";

export const Route = createFileRoute("/mcp")({
  head: () => ({
    meta: [
      { title: "Celina MCP — connect LLMs to Celo" },
      {
        name: "description",
        content:
          "Celina MCP server for Celo mainnet — local stdio with full execution or remote hosted reads.",
      },
      { property: "og:title", content: "Celina MCP — connect LLMs to Celo" },
      {
        property: "og:description",
        content:
          "Celina MCP server for Celo mainnet — local stdio with full execution or remote hosted reads.",
      },
    ],
  }),
  component: McpLayout,
});

function SubNavLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      activeOptions={{ exact: true }}
      className="rounded-[2px] border-2 border-transparent px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
      activeProps={{
        className:
          "rounded-[2px] border-2 border-foreground bg-[var(--celo-forest)] px-3.5 py-1.5 text-sm font-semibold !text-white shadow-[var(--shadow-brutal-sm)] dark:bg-[var(--celo-yellow)] dark:!text-black",
      }}
    >
      {label}
    </Link>
  );
}

function McpLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const crumbs: Crumb[] = [
    { label: "Celina", to: "/" },
    { label: "MCP", to: "/mcp" },
  ];
  if (pathname.startsWith("/mcp/local")) crumbs.push({ label: "Local" });
  else if (pathname.startsWith("/mcp/remote")) crumbs.push({ label: "Remote" });

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <PageHeroSection compact>
        <PageHero
          icon={faPlug}
          badge="MCP · Model Context Protocol"
          title="Celina MCP"
          description="Register the Celina SDK tool catalog as MCP tools for Cursor, Claude Desktop, and other LLM clients."
          crumbs={crumbs}
        />

        <div className="mt-8 flex flex-wrap items-center gap-2 border-b-2 border-foreground pb-4">
          <SubNavLink to="/mcp" label="Overview" />
          <SubNavLink to="/mcp/local" label="Local" />
          <SubNavLink to="/mcp/remote" label="Remote" />
        </div>
      </PageHeroSection>

      <Outlet />

      <footer className="border-t-2 border-foreground">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            Built by{" "}
            <a
              className="font-medium text-foreground hover:underline"
              href="https://www.npmjs.com/~andrewkimjoseph"
              target="_blank"
              rel="noreferrer"
            >
              @andrewkimjoseph
            </a>{" "}
            · MIT
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link to="/tools" className="hover:text-foreground">
              Tools
            </Link>
            <a href={MCP_NPM_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-foreground">
              <FontAwesomeIcon icon={faNpm} className="h-4 w-4" /> npm
            </a>
            <a href={MCP_GITHUB_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-foreground">
              <FontAwesomeIcon icon={faGithub} className="h-4 w-4" /> GitHub
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
