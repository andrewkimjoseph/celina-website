import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faCopy,
  faTerminal,
  faBolt,
  faLock,
  faCoins,
  faWandMagicSparkles,
  faArrowRight,
  faCloud,
} from "@fortawesome/free-solid-svg-icons";
import { faNpm, faGithub } from "@fortawesome/free-brands-svg-icons";
import celoWordmarkOnyx from "@/assets/celo-wordmark-onyx.svg";
import celoWordmarkYellow from "@/assets/celo-wordmark-yellow.svg";
import { TOOLS as TOOL_DOCS, categorySlug } from "@/data/tools";
import { SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/")({
  component: Index,
});

const NPM_URL = "https://www.npmjs.com/package/@andrewkimjoseph/celina-mcp";

const LOCAL_BRIDGE_CONFIG = `{
  "mcpServers": {
    "celina-mcp": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@andrewkimjoseph/celina-mcp"],
      "env": {
        "CELO_PRIVATE_KEY": "0x...",
        "SELF_AGENT_PRIVATE_KEY": "0x..."
      }
    }
  }
}`;

const HOSTED_CONFIG = `{
  "mcpServers": {
    "celina-mcp": {
      "url": "https://mcp.usecelina.xyz/api/mcp"
    }
  }
}`;


function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }}
      className="inline-flex items-center gap-1.5 rounded-md border border-foreground/15 bg-background/80 px-2.5 py-1 text-xs font-medium text-foreground/80 backdrop-blur transition hover:bg-accent hover:text-accent-foreground"
    >
      <FontAwesomeIcon icon={copied ? faCheck : faCopy} className="h-3.5 w-3.5" />
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <div className="relative">
      <div className="absolute right-3 top-3 z-10">
        <CopyButton text={code} />
      </div>
      <pre className="overflow-hidden whitespace-pre-wrap break-all rounded-xl border border-[var(--celo-deep)]/40 bg-[var(--celo-ink)] p-4 pr-20 text-[12px] leading-relaxed text-[var(--celo-cream)] shadow-[var(--shadow-soft)] sm:p-5 sm:text-sm">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function BrowserFrame({ children, url = "claude.ai" }: { children: React.ReactNode; url?: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-foreground/15 bg-[var(--celo-ink)] shadow-[0_40px_80px_-30px_oklch(0_0_0/0.6)]">
      {/* Title bar */}
      <div className="flex items-center gap-3 border-b border-white/10 bg-black/40 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="mx-auto flex max-w-md flex-1 items-center justify-center gap-2 rounded-md bg-white/5 px-3 py-1 text-xs font-medium text-white/60">
          <FontAwesomeIcon icon={faLock} className="h-2.5 w-2.5 text-[var(--celo-yellow)]" />
          <span className="truncate font-mono">{url}</span>
        </div>
        <div className="w-12" />
      </div>
      {children}
    </div>
  );
}

const TOOLS = TOOL_DOCS.map((t) => ({
  name: t.name,
  slug: t.slug,
  type: t.kind,
  desc: t.summary,
  category: t.category,
}));

function Index() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Hero — magazine */}
      <section id="top" className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10" style={{ backgroundImage: "var(--gradient-hero)" }} />
        {/* Subtle dot grid */}
        <div
          className="absolute inset-x-0 top-0 -z-10 h-[700px]"
          style={{
            backgroundImage: "radial-gradient(oklch(0.55 0.02 280 / 0.18) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            maskImage: "radial-gradient(ellipse at center, black 20%, transparent 75%)",
          }}
        />
        <div className="mx-auto max-w-6xl px-6 pt-16 pb-16 sm:pt-24 sm:pb-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
            {/* Left column */}
            <div className="flex flex-col items-start text-left">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--celo-forest)]/40 bg-card/80 px-3 py-1 text-xs font-medium text-foreground backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--celo-forest)] opacity-70 dark:bg-[var(--celo-yellow)]" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--celo-forest)] dark:bg-[var(--celo-yellow)]" />
                </span>
                <span className="uppercase tracking-[0.18em]">Live on Celo mainnet</span>
              </div>
              <h1
                className="text-balance text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Give your LLM{" "}
                <span className="relative inline-block whitespace-nowrap">
                  <span className="relative z-10 italic text-foreground">a wallet</span>
                  <span className="absolute inset-x-0 bottom-1.5 -z-0 h-3 bg-[var(--celo-yellow)]/70 sm:h-4" />
                </span>{" "}
                on Celo.
              </h1>
              {/* Editorial horizon line */}
              <div className="mt-6 h-px w-24 bg-[var(--celo-yellow)]" />
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                <span className="font-semibold text-foreground">Celina</span> is an open-source{" "}
                <a
                  className="underline decoration-[var(--celo-yellow)] decoration-2 underline-offset-4 hover:text-foreground"
                  href="https://modelcontextprotocol.io"
                  target="_blank"
                  rel="noreferrer"
                >
                  Model Context Protocol
                </a>{" "}
                server that gives LLMs read &amp; write access to Celo mainnet — balances,
                stablecoins, sends, and chain reads.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#install"
                  className="group inline-flex items-center gap-2 rounded-lg bg-[var(--celo-yellow)] px-6 py-3.5 text-sm font-semibold text-[var(--celo-ink)] ring-2 ring-transparent transition hover:-translate-y-0.5 hover:ring-[var(--celo-yellow)]/40"
                >
                  <FontAwesomeIcon icon={faWandMagicSparkles} className="h-4 w-4" />
                  Add to Cursor / Claude
                  <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3 transition group-hover:translate-x-0.5" />
                </a>
                <a
                  href={NPM_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground transition hover:border-[var(--celo-yellow)] hover:bg-muted"
                >
                  <FontAwesomeIcon icon={faNpm} className="h-4 w-4" /> View on npm
                </a>
              </div>

              <div className="mt-8 flex w-full max-w-full items-center gap-2 overflow-hidden rounded-full border border-[var(--celo-yellow)]/20 bg-[var(--celo-ink)] py-2 pl-4 pr-2 text-[11px] text-[var(--celo-cream)] shadow-[var(--shadow-soft)] sm:inline-flex sm:w-auto sm:gap-3 sm:pl-5 sm:text-sm">
                <span className="font-mono text-[var(--celo-yellow)]">$</span>
                <code className="flex-1 overflow-x-auto whitespace-nowrap font-mono">npm i @andrewkimjoseph/celina-mcp@latest</code>
                <CopyButton text="npm i @andrewkimjoseph/celina-mcp@latest" />
              </div>

              <div className="mt-8 flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                <span>Built on</span>
                <img src={celoWordmarkOnyx} alt="Celo" className="h-4 w-auto opacity-80 dark:hidden" />
                <img src={celoWordmarkYellow} alt="Celo" className="hidden h-4 w-auto opacity-90 dark:inline-block" />
              </div>
            </div>

            {/* Right column — Agent panel mock */}
            <div className="relative hidden lg:block">
              <div className="absolute -inset-6 -z-10 rounded-3xl bg-[var(--celo-yellow)]/10 blur-2xl" />
              <div className="relative overflow-hidden rounded-2xl border border-[var(--celo-yellow)]/20 bg-[var(--celo-ink)] shadow-[var(--shadow-soft)]">
                {/* Panel header */}
                <div className="flex items-center justify-between border-b border-white/5 bg-black/30 px-4 py-2.5">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[var(--celo-cream)]/60">
                    <FontAwesomeIcon icon={faTerminal} className="h-3 w-3 text-[var(--celo-yellow)]" />
                    celina · agent
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--celo-yellow)]/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--celo-yellow)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--celo-yellow)]" /> live
                  </span>
                </div>

                {/* Transcript */}
                <div className="space-y-4 px-5 py-5 font-mono text-[12px] leading-relaxed text-[var(--celo-cream)]/90 sm:text-[13px]">
                  <div className="flex gap-3">
                    <span className="shrink-0 text-[var(--celo-yellow)]">{">"}</span>
                    <span>What&apos;s the USDm balance of <span className="text-[var(--celo-yellow)]">0x4a…f10c</span>?</span>
                  </div>
                  <div className="rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-[var(--celo-cream)]/70">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--celo-yellow)]/80">tool · get_stablecoin_balances</div>
                    <div className="mt-1.5 whitespace-pre text-[11px]">{"{ address: \"0x4a…f10c\", stablecoins: [\"USDm\"] }"}</div>
                  </div>
                  <div className="flex gap-3">
                    <span className="shrink-0 text-[var(--celo-yellow)]">↳</span>
                    <span>
                      <span className="text-[var(--celo-cream)]">USDm</span>{" "}
                      <span className="text-[var(--celo-yellow)]">1,248.32</span>
                      <span className="text-[var(--celo-cream)]/60"> · last block 30,418,221</span>
                    </span>
                  </div>
                  <div className="flex gap-3 border-t border-white/5 pt-4">
                    <span className="shrink-0 text-[var(--celo-yellow)]">{">"}</span>
                    <span>Now send <span className="text-[var(--celo-yellow)]">5 USDm</span> to andrewkimjosep.celo.eth.</span>
                  </div>
                  <div className="rounded-lg border border-[var(--celo-yellow)]/30 bg-[var(--celo-yellow)]/[0.06] px-3 py-2">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--celo-yellow)]">tool · send_token  ⚡ write</div>
                    <div className="mt-1.5 text-[var(--celo-cream)]/80">
                      tx <span className="text-[var(--celo-yellow)]">0x9c2…aa31</span> confirmed in block 30,418,224
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 bg-black/30 px-4 py-2 text-[10px] uppercase tracking-[0.16em] text-[var(--celo-cream)]/40">
                  <span>npx @andrewkimjoseph/celina-mcp</span>
                  <span>{TOOLS.length} tools</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo — featured magazine artifact */}
      <section id="demo" className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 sm:pb-24">
        <figure className="relative">
          {/* Gold corner accent */}
          <div className="absolute -left-4 -top-4 hidden h-24 w-24 rounded-tl-3xl border-l-4 border-t-4 border-[var(--celo-yellow)] sm:block" />
          <div className="absolute -bottom-4 -right-4 hidden h-24 w-24 rounded-br-3xl border-b-4 border-r-4 border-[var(--celo-forest)] sm:block" />

          <BrowserFrame url="claude.ai — Celina MCP">
            <div className="aspect-video w-full bg-[var(--celo-ink)]">
              <iframe
                src="https://www.youtube.com/embed/jfm27eQ-9Xo"
                title="Celina demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="block h-full w-full border-0"
              />
            </div>
          </BrowserFrame>

          <figcaption className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="flex flex-col items-start gap-2 text-sm sm:flex-row sm:items-center sm:gap-3">
              <span className="whitespace-nowrap rounded-full bg-[var(--celo-deep)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--celo-cream)]">Live demo</span>
              <span className="text-muted-foreground">
                Claude using Celina to supply to and withdraw from Aave.
              </span>
            </div>
            
          </figcaption>
        </figure>

        {/* Features under the demo */}
        <div className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/10 sm:grid-cols-3">
          {[
            { icon: faBolt, title: "1-minute setup", body: "Drop a JSON snippet into Cursor or Claude Desktop. Done." },
            { icon: faCoins, title: "Mainnet ready", body: "CELO, all 15 Mento stablecoins, USDC, USDT, GoodDollar — all built in." },
            { icon: faLock, title: "Keys stay local", body: "Set CELO_PRIVATE_KEY and SELF_AGENT_PRIVATE_KEY in your MCP client env — keys never leave your machine." },
          ].map((f) => (
            <div key={f.title} className="bg-background p-8">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--celo-yellow)] text-[var(--celo-ink)]">
                <FontAwesomeIcon icon={f.icon} className="h-4 w-4" />
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Install */}
      <section id="install" className="border-t border-foreground/10 bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="mb-12 flex flex-col items-start sm:items-center sm:text-center">
          <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-foreground">
            § Install
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl" style={{ fontFamily: "var(--font-display)" }}>
            Hook Celina into your agent
          </h2>
          <p className="mt-3 max-w-xl text-base text-muted-foreground sm:text-lg">
            Pick your client, copy the config, restart. Celina shows up as MCP tools your LLM can call.
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          {/* Local bridge */}
          <article className="min-w-0 overflow-hidden rounded-2xl border border-foreground/15 bg-card p-7 shadow-[var(--shadow-soft)]">
            <div className="mb-1 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--celo-forest)]">
              <FontAwesomeIcon icon={faTerminal} className="h-3.5 w-3.5" /> Local stdio
              <span className="rounded-full bg-[var(--celo-forest)] px-2 py-0.5 text-[10px] tracking-[0.18em] text-[var(--celo-cream)] dark:text-[var(--celo-ink)]">Recommended</span>
            </div>
            <h3 className="text-2xl font-semibold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Run it locally with Node</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Your client spawns <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">npx</span> and talks to Celina over stdio. Works in any stdio client (Cursor, Claude Desktop, LM Studio, Continue, MCP Inspector). Requires Node.js{" "}
              <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">≥ 20</span>.
            </p>
            <ol className="mt-4 space-y-2 text-sm text-foreground/80">
              <li><span className="font-semibold text-foreground">01.</span> Run <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">npm i @andrewkimjoseph/celina-mcp@latest</span></li>
              <li><span className="font-semibold text-foreground">02.</span> Open your MCP config (e.g. <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">claude_desktop_config.json</span>, Cursor <em>Settings → MCP</em>) and merge the snippet below into <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">mcpServers</span></li>
              <li><span className="font-semibold text-foreground">03.</span> Restart the client</li>
            </ol>
            <div className="mt-5">
              <CodeBlock code={LOCAL_BRIDGE_CONFIG} />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Keep <code className="rounded bg-secondary px-1 py-0.5">CELO_PRIVATE_KEY</code> and{" "}
              <code className="rounded bg-secondary px-1 py-0.5">SELF_AGENT_PRIVATE_KEY</code> out of source control — they stay on your machine.
            </p>
          </article>

        </div>


        </div>
      </section>


      {/* Tools */}
      <section id="tools" className="border-t border-foreground/10">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <div className="mb-10 flex flex-col items-start sm:items-center sm:text-center">
            <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-foreground">
              § Tools
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl" style={{ fontFamily: "var(--font-display)" }}>
              {TOOLS.length} tools. One agent. Whole chain.
            </h2>
            <p className="mt-3 max-w-xl text-base text-muted-foreground sm:text-lg">
              Everything your LLM needs to read state and move value on Celo mainnet. Click any tool for the full spec.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((t) => {
              const isWrite = t.type === "write";
              return (
                <Link
                  key={t.name}
                  to="/tools/$category/$toolSlug"
                  params={{ category: categorySlug(t.category), toolSlug: t.slug }}
                  className="group relative block overflow-hidden rounded-xl border border-foreground/10 bg-card p-4 transition hover:-translate-y-0.5 hover:border-[var(--celo-yellow)]/60"
                >
                  <span
                    aria-hidden
                    className="absolute left-0 top-0 h-full w-0.5 bg-[var(--celo-yellow)] opacity-0 transition-opacity group-hover:opacity-100"
                  />
                  <div className="flex items-center justify-between gap-2">
                    <code className="truncate font-mono text-sm font-semibold text-foreground group-hover:underline">{t.name}</code>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] ${
                        isWrite
                          ? "bg-[var(--celo-yellow)] text-[var(--celo-ink)]"
                          : "bg-[var(--celo-forest)] text-[var(--celo-yellow)] dark:bg-[var(--celo-yellow)]/15 dark:text-[var(--celo-yellow)] dark:border dark:border-[var(--celo-yellow)]/40"
                      }`}
                    >
                      {t.type}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm text-muted-foreground">{t.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="relative overflow-hidden rounded-3xl border border-[var(--celo-yellow)]/20 bg-[var(--celo-ink)] p-8 text-[var(--celo-cream)] shadow-[var(--shadow-pop)] sm:p-12 lg:p-16">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[var(--celo-yellow)] opacity-30 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-[var(--celo-forest)] opacity-60 blur-3xl" />
          <div className="relative">
            <span className="rounded-full border border-[var(--celo-cream)]/30 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-[var(--celo-cream)]/80">
              Ship it
            </span>
            <h2 className="mt-5 max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl" style={{ fontFamily: "var(--font-display)" }}>
              Give your agent a wallet. <span className="text-[var(--celo-yellow)]">Say hi to Celina.</span>
            </h2>
            <p className="mt-4 max-w-xl text-base text-[var(--celo-cream)]/75 sm:text-lg">
              Open source. MIT licensed. Built for the next wave of on-chain agents.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={NPM_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--celo-yellow)] px-6 py-3.5 text-sm font-bold text-[var(--celo-ink)] transition hover:-translate-y-0.5"
              >
                <FontAwesomeIcon icon={faNpm} className="h-4 w-4" /> Install from npm
              </a>
              <a
                href="https://modelcontextprotocol.io/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--celo-cream)]/30 px-6 py-3.5 text-sm font-semibold text-[var(--celo-cream)] transition hover:bg-[var(--celo-cream)]/10"
              >
                Learn about MCP
              </a>
            </div>

            <div className="mt-10 flex items-center gap-3 border-t border-[var(--celo-cream)]/15 pt-6 text-[10px] uppercase tracking-[0.28em] text-[var(--celo-cream)]/60">
              <span>Powered by</span>
              <img src={celoWordmarkYellow} alt="Celo" className="h-3.5 w-auto opacity-95" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-foreground/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            Built by <a className="font-medium text-foreground hover:underline" href="https://www.npmjs.com/~andrewkimjoseph" target="_blank" rel="noreferrer">@andrewkimjoseph</a> · MIT
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link to="/stats" className="hover:text-foreground">Stats</Link>
            <a href={NPM_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-foreground">
              <FontAwesomeIcon icon={faNpm} className="h-4 w-4" /> npm
            </a>
            <a href="https://modelcontextprotocol.io/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-foreground">
              <FontAwesomeIcon icon={faGithub} className="h-4 w-4" /> MCP spec
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}