import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faLock, faBolt, faCircleNodes, faTerminal, faCopy, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { TOOL_BY_SLUG, type ToolDoc } from "@/data/tools";
import celinaLogo from "@/assets/celina-logo.png";
import { ThemeToggle } from "@/components/theme-toggle";

export const Route = createFileRoute("/$toolSlug")({
  loader: ({ params }) => {
    const tool = TOOL_BY_SLUG[params.toolSlug];
    if (!tool) throw notFound();
    return { tool };
  },
  head: ({ loaderData }) => {
    const tool = loaderData?.tool;
    if (!tool) {
      return { meta: [{ title: "Tool not found — Celina" }] };
    }
    const title = `${tool.title} — Celina MCP tool`;
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
        <Link to="/" className="mt-6 inline-flex items-center gap-2 rounded-md bg-[var(--celo-deep)] px-4 py-2 text-sm font-medium text-[var(--celo-cream)]">
          <FontAwesomeIcon icon={faArrowLeft} className="h-3.5 w-3.5" /> Back home
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
      className="inline-flex items-center gap-1.5 rounded-md border border-foreground/15 bg-background px-2 py-1 text-[11px] font-medium text-foreground/70 transition hover:bg-accent"
    >
      <FontAwesomeIcon icon={copied ? faCheck : faCopy} className="h-3 w-3" />
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function ToolPage() {
  const { tool } = Route.useLoaderData() as { tool: ToolDoc };
  const isWrite = tool.kind === "write";

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-foreground/10 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={celinaLogo} alt="Celina" className="h-9 w-9 rounded-full ring-1 ring-[var(--celo-forest)]/30" />
            <span className="font-display text-lg font-semibold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              Celina
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              hash="tools"
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-foreground/70 transition hover:text-foreground"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="h-3.5 w-3.5" /> All tools
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <article className="mx-auto max-w-4xl px-6 pb-24 pt-12 sm:pt-16">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Celina</Link>
          <span>/</span>
          <span className="text-foreground/80">{tool.category}</span>
        </div>

        {/* Header */}
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] ${
              isWrite
                ? "border border-[var(--celo-ink)]/40 bg-[var(--celo-yellow)] text-[var(--celo-ink)]"
                : "border border-[var(--celo-forest)]/40 text-[var(--celo-forest)]"
            }`}
          >
            <FontAwesomeIcon icon={isWrite ? faBolt : faCircleNodes} className="h-2.5 w-2.5" />
            {tool.kind}
          </span>
          <span className="rounded-full border border-foreground/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            {tool.category}
          </span>
        </div>

        <h1
          className="mt-4 text-balance text-4xl font-bold tracking-tight sm:text-6xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {tool.title}
        </h1>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <code className="rounded-lg bg-[var(--celo-ink)] px-3 py-1.5 font-mono text-sm font-semibold text-[var(--celo-cream)]">
            {tool.name}
          </code>
          <CopyInline text={tool.name} />
        </div>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {tool.description}
        </p>

        {/* Inputs */}
        <section className="mt-12">
          <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--celo-deep)]">§ Inputs</h2>
          {tool.inputs.length === 0 ? (
            <p className="mt-3 rounded-xl border border-foreground/10 bg-card p-5 text-sm text-muted-foreground">
              This tool takes no parameters.
            </p>
          ) : (
            <div className="mt-3 overflow-hidden rounded-xl border border-foreground/10 bg-card">
              <table className="w-full text-left text-sm">
                <thead className="bg-[var(--celo-cream)]/60 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2.5 font-semibold">Name</th>
                    <th className="px-4 py-2.5 font-semibold">Type</th>
                    <th className="px-4 py-2.5 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {tool.inputs.map((f) => (
                    <tr key={f.name} className="border-t border-foreground/10 align-top">
                      <td className="px-4 py-3">
                        <code className="font-mono text-[13px] font-semibold text-[var(--celo-deep)]">{f.name}</code>
                        {f.required && (
                          <span className="ml-2 rounded border border-[var(--celo-ink)]/30 bg-[var(--celo-yellow)]/40 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--celo-ink)]">
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

        {/* Returns */}
        <section className="mt-10">
          <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--celo-deep)]">§ Returns</h2>
          <div className="mt-3 rounded-xl border border-foreground/10 bg-card p-5 text-sm">
            <code className="font-mono text-[13px] text-foreground/85">{tool.returns}</code>
          </div>
        </section>

        {/* Examples */}
        {tool.examples && tool.examples.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--celo-deep)]">§ Try saying</h2>
            <ul className="mt-3 space-y-2">
              {tool.examples.map((e) => (
                <li
                  key={e}
                  className="flex items-center justify-between gap-3 rounded-xl border border-dashed border-[var(--celo-forest)]/40 bg-[var(--celo-cream)]/40 px-4 py-3 text-sm italic text-foreground/80"
                >
                  <span>{e}</span>
                  <CopyInline text={e} />
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Security note for write tools */}
        {(isWrite || tool.requiresEncryptedKey) && (
          <section className="mt-10 flex items-start gap-4 rounded-xl border border-[var(--celo-yellow)]/50 bg-[var(--celo-yellow)]/10 p-5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--celo-yellow)] text-[var(--celo-ink)]">
              <FontAwesomeIcon icon={faLock} className="h-4 w-4" />
            </div>
            <div className="text-sm">
              <p className="font-semibold">Signing required</p>
              <p className="mt-1 text-muted-foreground">
                {isWrite
                  ? "This tool broadcasts a transaction. "
                  : "This tool simulates a signed call. "}
                Fetch the server&apos;s public key with{" "}
                <Link to="/$toolSlug" params={{ toolSlug: "get-wallet-encryption-public-key" }} className="font-mono text-xs underline">
                  get_wallet_encryption_public_key
                </Link>
                , encrypt your private key locally (RSA-OAEP), and pass it as{" "}
                <code className="rounded bg-secondary px-1 py-0.5 text-xs">encryptedPrivateKey</code>. Running locally via{" "}
                <code className="rounded bg-secondary px-1 py-0.5 text-xs">npx</code>? Set{" "}
                <code className="rounded bg-secondary px-1 py-0.5 text-xs">CELO_PRIVATE_KEY</code> instead.
              </p>
            </div>
          </section>
        )}

        {/* Use this tool */}
        <section className="mt-12 rounded-2xl border border-foreground/10 bg-card p-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <FontAwesomeIcon icon={faTerminal} className="h-3.5 w-3.5 text-[var(--celo-forest)]" /> Use this tool
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Once Celina is wired into your MCP client, just ask in plain language. The LLM picks{" "}
            <code className="rounded bg-secondary px-1 py-0.5 text-xs">{tool.name}</code> automatically.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              to="/"
              hash="install"
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--celo-deep)] px-4 py-2 text-sm font-medium text-[var(--celo-cream)] transition hover:bg-[var(--celo-ink)]"
            >
              Install Celina
            </Link>
            <Link
              to="/"
              hash="tools"
              className="inline-flex items-center gap-2 rounded-lg border border-foreground/15 px-4 py-2 text-sm font-medium text-foreground/80 transition hover:bg-accent"
            >
              Browse all tools
            </Link>
          </div>
        </section>
      </article>
    </main>
  );
}