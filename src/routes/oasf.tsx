import { createFileRoute, Link } from "@tanstack/react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiagramProject, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { PageHero, PageHeroSection } from "@/components/marketing/page-hero";
import { SiteHeader } from "@/components/site-header";
import { CopyButton } from "@/components/marketing/code-block";
import {
  AGENT_JSON_URL,
  A2A_AGENT_CARD_URL,
  OASF_DOMAINS_CSV,
  OASF_MANIFEST_URL,
  OASF_REPO_URL,
  OASF_SKILLS_CSV,
} from "@/data/mcp";

export const Route = createFileRoute("/oasf")({
  head: () => ({
    meta: [
      { title: "Celina OASF — ERC-8004 discovery" },
      {
        name: "description",
        content:
          "OASF capability metadata for Celina on Celo — skills, domains, and hosted manifest for ERC-8004 agent registries.",
      },
      { property: "og:title", content: "Celina OASF — ERC-8004 discovery" },
      {
        property: "og:description",
        content:
          "OASF capability metadata for Celina on Celo — skills, domains, and hosted manifest for ERC-8004 agent registries.",
      },
    ],
  }),
  component: OasfPage,
});

function RegistryField({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-foreground/10 bg-card p-6">
      <h2
        className="text-lg font-semibold tracking-tight"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {label}
      </h2>
      {hint ? <p className="mt-2 text-sm text-muted-foreground">{hint}</p> : null}
      <div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2">
        <code className="flex-1 overflow-x-auto text-xs whitespace-pre-wrap break-all">
          {value}
        </code>
        <CopyButton text={value} />
      </div>
    </div>
  );
}

function OasfPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <PageHeroSection compact>
        <PageHero
          icon={faDiagramProject}
          badge="OASF · Open Agentic Schema Framework"
          title="Celina OASF discovery"
          description="Standardized skills and domains for ERC-8004 registries. Copy the values below into 8004scan or similar UIs — execution still goes through MCP and A2A on the MCP host."
        />
      </PageHeroSection>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="max-w-3xl space-y-4 text-base leading-relaxed text-muted-foreground">
          <p>
            <strong className="text-foreground">OASF</strong> describes what Celina
            can do in a standard taxonomy (v0.8.0). The hosted manifest is for
            registry forms that ask for a Service URL. The EIP-8004{" "}
            <code className="rounded bg-secondary px-1 py-0.5 text-sm">agent.json</code>{" "}
            OASF service uses the canonical repo endpoint per spec; skills and domains
            are listed inline there too.
          </p>
        </div>

        <div className="mt-10 grid gap-4">
          <RegistryField
            label="Service URL (hosted manifest)"
            value={OASF_MANIFEST_URL}
            hint="Use this in registry UIs that want a fetchable OASF record."
          />
          <RegistryField
            label="Skills (comma-separated)"
            value={OASF_SKILLS_CSV}
          />
          <RegistryField
            label="Domains (comma-separated)"
            value={OASF_DOMAINS_CSV}
          />
          <RegistryField
            label="EIP-8004 OASF repo endpoint (agent.json)"
            value={OASF_REPO_URL}
            hint="Canonical endpoint field on the OASF service in agent.json."
          />
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            to="/a2a"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold transition hover:border-[var(--celo-yellow)]"
          >
            A2A task server
            <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3" />
          </Link>
          <a
            href={AGENT_JSON_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold transition hover:border-[var(--celo-yellow)]"
          >
            agent.json
            <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3" />
          </a>
          <a
            href={OASF_MANIFEST_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--celo-yellow)] px-5 py-2.5 text-sm font-semibold text-[var(--celo-ink)]"
          >
            Open OASF manifest
            <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3" />
          </a>
          <a
            href={A2A_AGENT_CARD_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold transition hover:border-[var(--celo-yellow)]"
          >
            A2A Agent Card
            <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3" />
          </a>
        </div>
      </section>
    </main>
  );
}
