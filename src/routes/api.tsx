import { createFileRoute, Link } from "@tanstack/react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faBookOpen,
  faBolt,
  faCode,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import { PageHero, PageHeroSection } from "@/components/marketing/page-hero";
import { CodeBlock, EndpointCopyCard } from "@/components/marketing/code-block";
import { SiteHeader } from "@/components/site-header";

const API_BASE_URL = "https://api.usecelina.xyz";
const API_DOCS_URL = "https://andrewkimjoseph.gitbook.io/celina-api/";
const API_GITHUB_URL = "https://github.com/andrewkimjoseph/celina-api";

const GET_METADATA_EXAMPLE = `curl -sS https://api.usecelina.xyz/v1/get_network_status`;
const POST_INVOKE_EXAMPLE = `curl -sS https://api.usecelina.xyz/v1/get_network_status \\
  -H 'Content-Type: application/json' \\
  -d '{}'`;

export const Route = createFileRoute("/api")({
  head: () => ({
    meta: [
      { title: "Celina API — read-only HTTP endpoints" },
      {
        name: "description",
        content:
          "Read-only Celina API on Celo mainnet. List tools with GET /v1/tools, inspect metadata with GET /v1/:name, invoke tools with POST /v1/:name.",
      },
    ],
  }),
  component: ApiPage,
});

function ApiPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <PageHeroSection>
        <PageHero
          icon={faBolt}
          badge="API · Read-only"
          title="Celina API"
          description="Public read-only HTTP API for Celo mainnet. Same snake_case tool names as Celina SDK/MCP, without server private keys."
        >
          <div className="flex flex-wrap gap-3">
            <a
              href={API_DOCS_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--celo-yellow)] px-5 py-3 text-sm font-semibold text-[var(--celo-ink)] transition hover:-translate-y-0.5"
            >
              <FontAwesomeIcon icon={faBookOpen} className="h-4 w-4" />
              Open docs
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="h-3 w-3" />
            </a>
            <a
              href={API_GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition hover:border-[var(--celo-forest)] hover:bg-muted"
            >
              GitHub
            </a>
          </div>
        </PageHero>
      </PageHeroSection>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <article className="min-w-0 overflow-hidden rounded-2xl border border-foreground/15 bg-card p-7 shadow-[var(--shadow-soft)]">
          <EndpointCopyCard label="Production base URL" value={API_BASE_URL} />

          <h2
            className="mt-8 text-lg font-semibold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Endpoints
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-foreground/10 bg-muted/30 p-5">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--celo-yellow)] text-[var(--celo-ink)]">
                <FontAwesomeIcon icon={faList} className="h-4 w-4" />
              </div>
              <h3 className="mt-3 font-semibold text-foreground">Catalog</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                <code>GET /v1/tools</code> lists available read tools and schemas.
              </p>
            </div>
            <div className="rounded-xl border border-foreground/10 bg-muted/30 p-5">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--celo-yellow)] text-[var(--celo-ink)]">
                <FontAwesomeIcon icon={faCode} className="h-4 w-4" />
              </div>
              <h3 className="mt-3 font-semibold text-foreground">Metadata</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                <code>GET /v1/:name</code> returns metadata for one tool.
              </p>
            </div>
            <div className="rounded-xl border border-foreground/10 bg-muted/30 p-5">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--celo-yellow)] text-[var(--celo-ink)]">
                <FontAwesomeIcon icon={faBolt} className="h-4 w-4" />
              </div>
              <h3 className="mt-3 font-semibold text-foreground">Invocation</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                <code>POST /v1/:name</code> executes the read tool with JSON input.
              </p>
            </div>
          </div>

          <h2
            className="mt-8 text-lg font-semibold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Examples
          </h2>
          <div className="mt-4 space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium text-foreground">Get tool metadata</p>
              <CodeBlock code={GET_METADATA_EXAMPLE} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-foreground">Invoke tool with POST</p>
              <CodeBlock code={POST_INVOKE_EXAMPLE} />
            </div>
          </div>

          <p className="mt-5 text-sm text-muted-foreground">
            Full reference and additional examples:{" "}
            <a
              href={API_DOCS_URL}
              target="_blank"
              rel="noreferrer"
              className="text-foreground underline decoration-[var(--celo-yellow)] decoration-2 underline-offset-4"
            >
              GitBook docs
            </a>
            . You can also browse tool schemas on the{" "}
            <Link
              to="/tools"
              className="text-foreground underline decoration-[var(--celo-yellow)] decoration-2 underline-offset-4"
            >
              tools page
            </Link>
            .
          </p>
        </article>
      </section>
    </main>
  );
}
