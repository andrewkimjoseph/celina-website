import { createFileRoute, Link } from "@tanstack/react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNodes, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { PageHero, PageHeroSection } from "@/components/marketing/page-hero";
import { SiteHeader } from "@/components/site-header";
import { CopyButton } from "@/components/marketing/code-block";
import {
  A2A_AGENT_CARD_URL,
  A2A_JSONRPC_URL,
  CELINA_TOOL_MIME,
  HOSTED_TOOL_COUNT,
} from "@/data/mcp";
import { A2A_SKILL_IDS_CSV, A2A_SKILLS } from "@/data/a2a";

const EXAMPLE_PAYLOAD = `{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "message/send",
  "params": {
    "message": {
      "messageId": "550e8400-e29b-41d4-a716-446655440000",
      "role": "user",
      "kind": "message",
      "parts": [
        {
          "kind": "data",
          "data": {
            "tool": "get_network_status",
            "arguments": {}
          }
        }
      ]
    }
  }
}`;

export const Route = createFileRoute("/a2a")({
  head: () => ({
    meta: [
      { title: "Celina A2A — agent-to-agent on Celo" },
      {
        name: "description",
        content:
          "Celina A2A specialist agent for Celo mainnet — discover via Agent Card, delegate hosted read-only chain tools over JSON-RPC.",
      },
      { property: "og:title", content: "Celina A2A — agent-to-agent on Celo" },
      {
        property: "og:description",
        content:
          "Celina A2A specialist agent for Celo mainnet — discover via Agent Card, delegate hosted read-only chain tools over JSON-RPC.",
      },
    ],
  }),
  component: A2APage,
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

function A2APage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <PageHeroSection compact>
        <PageHero
          icon={faCircleNodes}
          badge="A2A · Agent2Agent"
          title="Celina as a peer agent"
          description="Other autonomous agents discover Celina via an Agent Card and delegate Celo mainnet reads over A2A JSON-RPC — the same hosted tool profile as mcp.usecelina.xyz."
        />
      </PageHeroSection>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="max-w-3xl space-y-4 text-base leading-relaxed text-muted-foreground">
          <p>
            Celina exposes a <strong className="text-foreground">read-only</strong> A2A server
            with {HOSTED_TOOL_COUNT} hosted tools (balances, Mento FX quotes, GoodDollar reserve,
            governance, staking, Self verification, and more). Send structured tool invocations in
            a message <code className="rounded bg-secondary px-1 py-0.5 text-sm">DataPart</code> —
            natural-language routing is not required on v1.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-foreground/10 bg-card p-6">
            <h2
              className="text-lg font-semibold tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Agent Card
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Machine-readable skills and JSON-RPC endpoint URL.
            </p>
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2">
              <code className="flex-1 overflow-x-auto text-xs">{A2A_AGENT_CARD_URL}</code>
              <CopyButton text={A2A_AGENT_CARD_URL} />
            </div>
          </div>

          <div className="rounded-2xl border border-foreground/10 bg-card p-6">
            <h2
              className="text-lg font-semibold tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              JSON-RPC task server
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              POST <code className="text-xs">message/send</code> with a Celina tool payload.
            </p>
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2">
              <code className="flex-1 overflow-x-auto text-xs">{A2A_JSONRPC_URL}</code>
              <CopyButton text={A2A_JSONRPC_URL} />
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-4">
          <RegistryField
            label="Skill IDs (comma-separated)"
            value={A2A_SKILL_IDS_CSV}
            hint="Celina A2A skills from the Agent Card — use when a registry or client asks for skill identifiers."
          />
        </div>

        <div className="mt-10">
          <h2
            className="text-lg font-semibold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Skills ({A2A_SKILLS.length})
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Each skill maps to a subset of hosted MCP tools. Peers discover these via the Agent Card.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {A2A_SKILLS.map((skill) => (
              <li
                key={skill.id}
                className="rounded-xl border border-foreground/10 bg-card p-4"
              >
                <div className="flex flex-wrap items-baseline gap-2">
                  <code className="text-xs font-semibold text-[var(--celo-yellow)]">
                    {skill.id}
                  </code>
                  <span className="text-sm font-medium">{skill.name}</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {skill.description}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 rounded-2xl border border-foreground/10 bg-card p-6">
          <h2
            className="text-lg font-semibold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Task payload
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Use mime <code className="text-xs">{CELINA_TOOL_MIME}</code> semantics: a{" "}
            <code className="text-xs">data</code> part with{" "}
            <code className="text-xs">{"{ tool, arguments }"}</code> (snake_case argument keys).
          </p>
          <div className="relative mt-4">
            <pre className="overflow-x-auto rounded-xl bg-[var(--celo-ink)] p-4 text-xs leading-relaxed text-[var(--celo-cream)]">
              {EXAMPLE_PAYLOAD}
            </pre>
            <div className="absolute right-3 top-3">
              <CopyButton text={EXAMPLE_PAYLOAD} />
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            to="/oasf"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold transition hover:border-[var(--celo-yellow)]"
          >
            OASF discovery
            <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3" />
          </Link>
          <Link
            to="/mcp/remote"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold transition hover:border-[var(--celo-yellow)]"
          >
            MCP hosted endpoint
            <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3" />
          </Link>
          <a
            href={A2A_AGENT_CARD_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--celo-yellow)] px-5 py-2.5 text-sm font-semibold text-[var(--celo-ink)]"
          >
            Open Agent Card
            <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3" />
          </a>
        </div>
      </section>
    </main>
  );
}
