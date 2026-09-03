import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowUpRightFromSquare,
  faTerminal,
  faCopy,
  faCheck,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { findTool, categorySlug, getToolAvailability, availabilityLabel, type ToolDoc } from "@/data/tools";
import { SiteHeader } from "@/components/site-header";
import { PageCrumbs } from "@/components/marketing/page-hero";
import { kindBadge } from "@/components/tools/tool-card";

const CELESTE_URL = "https://celeste.usecelina.xyz";

export const Route = createFileRoute("/tools/$category/$toolSlug")({
  loader: ({ params }) => {
    const tool = findTool(params.category, params.toolSlug);
    if (!tool) throw notFound();
    return { tool };
  },
  head: ({ loaderData }) => {
    const tool = loaderData?.tool;
    if (!tool) {
      return { meta: [{ title: "Tool not found — Celina" }] };
    }
    const title =
      tool.kind === "prepare"
        ? `${tool.title} — Celina prepare tool`
        : `${tool.title} — Celina MCP tool`;
    const desc = tool.description.length > 155 ? tool.description.slice(0, 152) + "…" : tool.description;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  component: ToolPage,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 text-center">
      <div>
        <h1 className="text-3xl font-bold">Tool not found</h1>
        <p className="mt-2 text-muted-foreground">No Celina tool matches that URL.</p>
        <Link to="/tools" className="mt-6 inline-flex items-center gap-2 rounded-[2px] border-2 border-foreground bg-[var(--celo-deep)] px-4 py-2 text-sm font-medium text-[var(--celo-cream)] shadow-[var(--shadow-brutal-sm)]">
          <FontAwesomeIcon icon={faArrowLeft} className="h-3.5 w-3.5" /> All tools
        </Link>
      </div>
    </div>
  ),
});

function CopyInline({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1400);
      }}
      className="inline-flex items-center gap-1.5 rounded-[2px] border-2 border-foreground bg-background px-2 py-1 text-[11px] font-medium text-foreground/70 transition hover:bg-accent hover:text-accent-foreground"
    >
      <FontAwesomeIcon icon={copied ? faCheck : faCopy} className="h-3 w-3" />
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function ToolPage() {
  const { tool } = Route.useLoaderData() as { tool: ToolDoc };
  const badge = kindBadge(tool.kind);
  const availability = getToolAvailability(tool);
  const catSlug = categorySlug(tool.category);
  const isPrepare = tool.kind === "prepare";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <article className="mx-auto max-w-6xl px-6 pb-24 pt-12 sm:pt-16">
        <PageCrumbs
          items={[
            { label: "Celina", to: "/" },
            { label: "Tools", to: "/tools" },
            { label: tool.category, to: "/tools/$category", params: { category: catSlug } },
            { label: tool.slug },
          ]}
        />

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-[2px] border-2 border-foreground px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] ${badge.className}`}
          >
            <FontAwesomeIcon icon={badge.icon} className="h-2.5 w-2.5" />
            {tool.kind}
          </span>
          <Link
            to="/tools/$category"
            params={{ category: catSlug }}
            className="rounded-[2px] border-2 border-foreground px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground transition hover:text-foreground"
          >
            {tool.category}
          </Link>
          <span className="rounded-[2px] border-2 border-foreground px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            {isPrepare ? "Browser · wallet" : availabilityLabel(availability)}
          </span>
        </div>

        <h1
          className="mt-4 text-balance text-4xl font-bold tracking-tight sm:text-6xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {tool.title}
        </h1>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <code className="rounded-[2px] border-2 border-foreground bg-[var(--celo-ink)] px-3 py-1.5 font-mono text-sm font-semibold text-[var(--celo-cream)]">
            {tool.name}
          </code>
          <CopyInline text={tool.name} />
        </div>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {tool.description}
        </p>

        {isPrepare && (
          <p className="mt-4 max-w-2xl rounded-[2px] border-2 border-foreground bg-muted/40 px-4 py-3 text-sm leading-relaxed text-foreground/85 shadow-[var(--shadow-brutal-sm)]">
            Browser / SDK wallet flow — not an MCP tool. Apps like{" "}
            <a
              href={CELESTE_URL}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-foreground underline decoration-[var(--celo-yellow)] decoration-2 underline-offset-2"
            >
              Celeste
            </a>{" "}
            call this via the SDK; the user signs with their wallet. MCP agents with{" "}
            <code className="rounded bg-secondary px-1 py-0.5 text-xs">CELO_PRIVATE_KEY</code> use the
            matching{" "}
            <Link to="/tools/write" className="font-medium text-foreground underline decoration-[var(--celo-yellow)] decoration-2 underline-offset-2">
              write
            </Link>{" "}
            <code className="rounded bg-secondary px-1 py-0.5 text-xs">execute_*</code> /{" "}
            <code className="rounded bg-secondary px-1 py-0.5 text-xs">send_*</code> tools instead. See{" "}
            <Link to="/tools/prepare" className="font-medium text-foreground underline decoration-[var(--celo-yellow)] decoration-2 underline-offset-2">
              prepare tools
            </Link>{" "}
            and the{" "}
            <Link to="/sdk" className="font-medium text-foreground underline decoration-[var(--celo-yellow)] decoration-2 underline-offset-2">
              SDK
            </Link>
            .
          </p>
        )}

        <section className="mt-12">
          <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-foreground">§ Inputs</h2>
          {tool.inputs.length === 0 ? (
            <p className="mt-3 rounded-[2px] border-2 border-foreground bg-card p-5 text-sm text-muted-foreground shadow-[var(--shadow-brutal-sm)]">
              This tool takes no parameters.
            </p>
          ) : (
            <div className="mt-3 overflow-hidden rounded-[2px] border-2 border-foreground bg-card shadow-[var(--shadow-brutal)]">
              <table className="w-full text-left text-sm">
                <thead className="border-b-2 border-foreground bg-muted/40 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2.5 font-semibold">Name</th>
                    <th className="px-4 py-2.5 font-semibold">Type</th>
                    <th className="px-4 py-2.5 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {tool.inputs.map((f) => (
                    <tr key={f.name} className="border-t-2 border-foreground align-top">
                      <td className="px-4 py-3">
                        <code className="font-mono text-[13px] font-semibold text-foreground">{f.name}</code>
                        {f.required && (
                          <span className="ml-2 rounded-[2px] border border-[var(--celo-ink)] bg-[var(--celo-yellow)] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--celo-ink)]">
                            Required
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <code className="font-mono text-[12px] text-muted-foreground">{f.type}</code>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{f.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="mt-10">
          <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-foreground">
            {isPrepare ? "§ Returns (prepared flow)" : "§ Returns"}
          </h2>
          <div className="mt-3 rounded-[2px] border-2 border-foreground bg-card p-5 text-sm shadow-[var(--shadow-brutal-sm)]">
            <code className="font-mono text-[13px] text-foreground/85">{tool.returns}</code>
          </div>
        </section>

        {!isPrepare && tool.examples && tool.examples.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-foreground">§ Try saying</h2>
            <ul className="mt-3 space-y-2">
              {tool.examples.map((e) => (
                <li
                  key={e}
                  className="flex items-center justify-between gap-3 rounded-[2px] border-2 border-dashed border-[var(--celo-forest)] bg-muted/40 px-4 py-3 text-sm italic text-foreground/80 dark:border-[var(--celo-yellow)]"
                >
                  <span>{e}</span>
                  <CopyInline text={e} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-12 rounded-[2px] border-2 border-foreground bg-card p-6 shadow-[var(--shadow-brutal)]">
          {isPrepare ? (
            <>
              <h2 className="flex items-center gap-2 text-sm font-semibold">
                <FontAwesomeIcon icon={faWallet} className="h-3.5 w-3.5 text-[var(--celo-forest)]" /> Use
                this prepare
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Call{" "}
                <code className="rounded bg-secondary px-1 py-0.5 text-xs">{tool.name}</code> from a
                browser or SDK app with{" "}
                <code className="rounded bg-secondary px-1 py-0.5 text-xs">surface: &quot;browser&quot;</code>
                . It returns unsigned steps for the connected wallet to sign — it is{" "}
                <strong className="font-semibold text-foreground">not</strong> registered on celina-mcp.
                For a reference UI, try Celeste; for the API shape, see the SDK prepared-flows docs.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  to="/sdk"
                  className="inline-flex items-center gap-2 rounded-[2px] border-2 border-foreground bg-[var(--celo-deep)] px-4 py-2 text-sm font-medium text-[var(--celo-cream)] shadow-[var(--shadow-brutal-sm)] transition-[transform,box-shadow,background-color] hover:bg-[var(--celo-ink)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                >
                  SDK docs
                </Link>
                <a
                  href={CELESTE_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-[2px] border-2 border-foreground bg-background px-4 py-2 text-sm font-medium text-foreground shadow-[var(--shadow-brutal-sm)] transition-[transform,box-shadow,background-color,color] hover:bg-accent hover:text-accent-foreground active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                >
                  Open Celeste <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="h-2.5 w-2.5" />
                </a>
                <Link
                  to="/tools/$category"
                  params={{ category: catSlug }}
                  className="inline-flex items-center gap-2 rounded-[2px] border-2 border-foreground bg-background px-4 py-2 text-sm font-medium text-foreground shadow-[var(--shadow-brutal-sm)] transition-[transform,box-shadow,background-color,color] hover:bg-accent hover:text-accent-foreground active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                >
                  More {tool.category} tools
                </Link>
              </div>
            </>
          ) : (
            <>
              <h2 className="flex items-center gap-2 text-sm font-semibold">
                <FontAwesomeIcon icon={faTerminal} className="h-3.5 w-3.5 text-[var(--celo-forest)]" /> Use
                this tool
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Once Celina is wired into your MCP client, just ask in plain language. The LLM picks{" "}
                <code className="rounded bg-secondary px-1 py-0.5 text-xs">{tool.name}</code>{" "}
                automatically.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  to="/"
                  hash="install"
                  className="inline-flex items-center gap-2 rounded-[2px] border-2 border-foreground bg-[var(--celo-deep)] px-4 py-2 text-sm font-medium text-[var(--celo-cream)] shadow-[var(--shadow-brutal-sm)] transition-[transform,box-shadow,background-color] hover:bg-[var(--celo-ink)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                >
                  Install Celina
                </Link>
                <Link
                  to="/tools/$category"
                  params={{ category: catSlug }}
                  className="inline-flex items-center gap-2 rounded-[2px] border-2 border-foreground bg-background px-4 py-2 text-sm font-medium text-foreground shadow-[var(--shadow-brutal-sm)] transition-[transform,box-shadow,background-color,color] hover:bg-accent hover:text-accent-foreground active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                >
                  More {tool.category} tools
                </Link>
              </div>
            </>
          )}
        </section>
      </article>
    </main>
  );
}
