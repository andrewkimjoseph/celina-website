import { createFileRoute } from "@tanstack/react-router";
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
  faCircleNodes,
} from "@fortawesome/free-solid-svg-icons";
import { faNpm, faGithub } from "@fortawesome/free-brands-svg-icons";
import celinaLogo from "@/assets/celina-logo.png";
import celoWordmarkOnyx from "@/assets/celo-wordmark-onyx.svg";
import celoWordmarkSnow from "@/assets/celo-wordmark-snow.svg";

export const Route = createFileRoute("/")({
  component: Index,
});

const NPM_URL = "https://www.npmjs.com/package/@andrewkimjoseph/celina";

const CURSOR_CONFIG = `{
  "mcpServers": {
    "celina": {
      "type": "streamable-http",
      "url": "https://mcp.celina.andrewkimjoseph.com/mcp"
    }
  }
}`;

const LOCAL_BRIDGE_CONFIG = `{
  "mcpServers": {
    "celina": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://mcp.celina.andrewkimjoseph.com/mcp",
        "--transport",
        "http-only"
      ]
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
    <div className="relative overflow-hidden rounded-2xl border border-foreground/15 bg-[var(--celo-ink)] shadow-[0_40px_80px_-30px_oklch(0.18_0.04_165_/_0.55)]">
      {/* Title bar */}
      <div className="flex items-center gap-3 border-b border-white/10 bg-[oklch(0.22_0.04_165)] px-4 py-2.5">
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

const TOOLS = [
  { name: "get_network_status", type: "read", desc: "Chain ID, block, gas price" },
  { name: "get_celo_balances", type: "read", desc: "CELO + ERC-20 balances" },
  { name: "get_stablecoin_balances", type: "read", desc: "Mento, USDC, USDT & more" },
  { name: "get_block", type: "read", desc: "Block by number/hash/latest" },
  { name: "get_transaction", type: "read", desc: "Transaction + receipt" },
  { name: "get_account", type: "read", desc: "CELO balance, nonce" },
  { name: "get_token_info", type: "read", desc: "Token metadata" },
  { name: "estimate_send", type: "read", desc: "Gas estimate" },
  { name: "send_token", type: "write", desc: "Send CELO or ERC-20" },
  { name: "get_wallet_encryption_public_key", type: "read", desc: "RSA public key" },
  { name: "get_latest_blocks", type: "read", desc: "Recent blocks" },
  { name: "get_gooddollar_whitelisting_info", type: "read", desc: "GoodDollar IdentityV4 whitelisting status" },
];

function Index() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-foreground/10 bg-[var(--celo-cream)]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#top" className="flex items-center gap-2">
            <img src={celinaLogo} alt="Celina" className="h-9 w-9 rounded-full ring-1 ring-[var(--celo-forest)]/30" />
            <span className="font-display text-lg font-semibold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Celina</span>
            <span className="hidden text-xs uppercase tracking-[0.18em] text-muted-foreground sm:inline">· Celo MCP</span>
          </a>
          <nav className="flex items-center gap-1 text-sm">
            <a href="#demo" className="hidden rounded-md px-3 py-1.5 text-foreground/70 transition hover:text-foreground sm:inline">Demo</a>
            <a href="#install" className="hidden rounded-md px-3 py-1.5 text-foreground/70 transition hover:text-foreground sm:inline">Install</a>
            <a href="#tools" className="hidden rounded-md px-3 py-1.5 text-foreground/70 transition hover:text-foreground sm:inline">Tools</a>
            <a href={NPM_URL} target="_blank" rel="noreferrer" className="ml-1 inline-flex items-center gap-1.5 rounded-md bg-[var(--celo-forest)] px-3 py-1.5 text-sm font-medium text-[var(--celo-cream)] transition hover:bg-[var(--celo-deep)]">
              <FontAwesomeIcon icon={faNpm} className="h-3.5 w-3.5" /> npm
            </a>
          </nav>
        </div>
      </header>

      {/* Hero — magazine */}
      <section id="top" className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10" style={{ backgroundImage: "var(--gradient-hero)" }} />
        <div className="absolute inset-x-0 top-0 -z-10 h-[600px]" style={{
          backgroundImage: "linear-gradient(to right, oklch(0.36 0.08 165 / 0.06) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.36 0.08 165 / 0.06) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse at center, black 25%, transparent 70%)",
        }} />
        <div className="mx-auto max-w-6xl px-6 pt-20 pb-12 sm:pt-28">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--celo-forest)]/25 bg-[var(--celo-cream)]/70 px-3 py-1 text-xs font-medium text-[var(--celo-deep)] backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--celo-yellow)] opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--celo-forest)]" />
              </span>
              <span className="uppercase tracking-[0.18em]">v0.1 · Live on Celo mainnet</span>
            </div>
            <h1 className="max-w-5xl text-balance text-5xl font-bold tracking-tight sm:text-7xl lg:text-8xl" style={{ fontFamily: "var(--font-display)" }}>
              Give your LLM
              <br className="hidden sm:block" />
              {" "}a wallet on{" "}
              <span className="relative inline-block whitespace-nowrap">
                <span className="relative z-10 italic text-[var(--celo-deep)]">Celo</span>
                <span className="absolute inset-x-0 bottom-2 -z-0 h-4 bg-[var(--celo-yellow)]/70 sm:h-5" />
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-xl">
              <span className="font-semibold text-foreground">Celina</span> is an open-source MCP server that gives Claude, Cursor, and any agent
              read &amp; write access to Celo mainnet — balances, stablecoins, sends, and chain reads.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#install"
                className="group inline-flex items-center gap-2 rounded-lg bg-[var(--celo-deep)] px-6 py-3.5 text-sm font-semibold text-[var(--celo-cream)] shadow-[var(--shadow-pop)] ring-2 ring-transparent transition hover:-translate-y-0.5 hover:bg-[var(--celo-ink)] hover:ring-[var(--celo-yellow)]"
              >
                <FontAwesomeIcon icon={faWandMagicSparkles} className="h-4 w-4 text-[var(--celo-yellow)]" />
                Add to Cursor / Claude
                <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3 transition group-hover:translate-x-0.5" />
              </a>
              <a
                href={NPM_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--celo-deep)]/30 bg-background px-6 py-3.5 text-sm font-semibold text-foreground transition hover:border-[var(--celo-deep)] hover:bg-[var(--celo-cream)]"
              >
                <FontAwesomeIcon icon={faNpm} className="h-4 w-4" /> View on npm
              </a>
            </div>

            {/* npm install one-liner */}
            <div className="mt-8 flex w-full max-w-full items-center gap-2 overflow-hidden rounded-full border border-[var(--celo-deep)]/40 bg-[var(--celo-ink)] py-2 pl-4 pr-2 text-[11px] text-[var(--celo-cream)] shadow-[var(--shadow-soft)] sm:inline-flex sm:w-auto sm:gap-3 sm:pl-5 sm:text-sm">
              <span className="font-mono text-[var(--celo-yellow)]">$</span>
              <code className="flex-1 overflow-x-auto whitespace-nowrap font-mono">npm i @andrewkimjoseph/celina</code>
              <CopyButton text="npm i @andrewkimjoseph/celina" />
            </div>

            {/* Built on Celo */}
            <div className="mt-8 flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">
              <span>Built on</span>
              <img src={celoWordmarkOnyx} alt="Celo" className="h-4 w-auto opacity-80" />
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
            <video
              src="/claude-demo.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="block aspect-video w-full bg-[var(--celo-ink)] object-cover"
            />
          </BrowserFrame>

          <figcaption className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="flex flex-col items-start gap-2 text-sm sm:flex-row sm:items-center sm:gap-3">
              <span className="whitespace-nowrap rounded-full bg-[var(--celo-deep)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--celo-cream)]">Live demo</span>
              <span className="text-muted-foreground">
                Claude using Celina to read balances and move value on Celo mainnet.
              </span>
            </div>
            <code className="break-all text-xs text-muted-foreground/80">mcp.celina.andrewkimjoseph.com</code>
          </figcaption>
        </figure>

        {/* Features under the demo */}
        <div className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/10 sm:grid-cols-3">
          {[
            { icon: faBolt, title: "1-minute setup", body: "Drop a JSON snippet into Cursor or Claude Desktop. Done." },
            { icon: faCoins, title: "Mainnet ready", body: "CELO, cUSD, USDC, USDT, and Mento stablecoins out of the box." },
            { icon: faLock, title: "Keys never stored", body: "Write tools accept RSA-encrypted keys, decrypted ephemerally." },
          ].map((f) => (
            <div key={f.title} className="bg-background p-8">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--celo-yellow)]/20 ring-1 ring-[var(--celo-yellow)]/40">
                <FontAwesomeIcon icon={f.icon} className="h-5 w-5 text-[var(--celo-deep)]" />
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Install */}
      <section id="install" className="border-t border-foreground/10 bg-[var(--celo-cream)]/40">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="mb-12 flex flex-col items-start sm:items-center sm:text-center">
          <span className="rounded-full border border-[var(--celo-deep)]/30 bg-background px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-[var(--celo-deep)]">
            § Install
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl" style={{ fontFamily: "var(--font-display)" }}>
            Hook Celina into your agent
          </h2>
          <p className="mt-3 max-w-xl text-base text-muted-foreground sm:text-lg">
            Pick your client, copy the config, restart. Celina shows up as MCP tools your LLM can call.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Remote — Streamable HTTP */}
          <article className="min-w-0 overflow-hidden rounded-2xl border border-foreground/15 bg-card p-7 shadow-[var(--shadow-soft)]">
            <div className="mb-1 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--celo-forest)]">
              <FontAwesomeIcon icon={faCircleNodes} className="h-3.5 w-3.5" /> Remote
              <span className="rounded-full bg-[var(--celo-forest)] px-2 py-0.5 text-[10px] tracking-[0.18em] text-[var(--celo-cream)]">Recommended</span>
            </div>
            <h3 className="text-2xl font-semibold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Streamable HTTP</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              For LLMs that support MCP Streamable HTTP natively. No local install — just paste and go.
            </p>
            <ol className="mt-4 space-y-2 text-sm text-foreground/80">
              <li><span className="font-semibold text-[var(--celo-deep)]">01.</span> Open your client&apos;s MCP settings</li>
              <li><span className="font-semibold text-[var(--celo-deep)]">02.</span> Paste the snippet below into <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">mcpServers</span></li>
              <li><span className="font-semibold text-[var(--celo-deep)]">03.</span> Reload — Celina&apos;s tools appear in chat</li>
            </ol>
            <div className="mt-5">
              <CodeBlock code={CURSOR_CONFIG} />
            </div>
          </article>

          {/* Local bridge */}
          <article className="min-w-0 overflow-hidden rounded-2xl border border-foreground/15 bg-card p-7 shadow-[var(--shadow-soft)]">
            <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--celo-forest)]">
              <FontAwesomeIcon icon={faTerminal} className="h-3.5 w-3.5" /> Local bridge
            </div>
            <h3 className="text-2xl font-semibold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>stdio via mcp-remote</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              For clients that only speak stdio (older Claude Desktop builds, etc.). Requires Node.js{" "}
              <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">≥ 18</span> on your machine.
            </p>
            <ol className="mt-4 space-y-2 text-sm text-foreground/80">
              <li><span className="font-semibold text-[var(--celo-deep)]">01.</span> Open your MCP config file (e.g. <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">claude_desktop_config.json</span>)</li>
              <li><span className="font-semibold text-[var(--celo-deep)]">02.</span> Merge the snippet below into <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">mcpServers</span></li>
              <li><span className="font-semibold text-[var(--celo-deep)]">03.</span> Restart the client — <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">npx</span> spawns the bridge on first run</li>
            </ol>
            <div className="mt-5">
              <CodeBlock code={LOCAL_BRIDGE_CONFIG} />
            </div>
          </article>
        </div>

        {/* Write tools note */}
        <div className="mt-10 flex items-start gap-4 rounded-xl border border-foreground/10 bg-card p-5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--celo-yellow)] text-[var(--celo-ink)]">
            <FontAwesomeIcon icon={faLock} className="h-4 w-4" />
          </div>
          <div className="text-sm">
            <p className="font-semibold">Sending transactions?</p>
            <p className="mt-1 text-muted-foreground">
              Write tools (<code className="rounded bg-secondary px-1 py-0.5 text-xs">send_token</code>,{" "}
              <code className="rounded bg-secondary px-1 py-0.5 text-xs">estimate_send</code>) accept an
              RSA-encrypted private key per request — never plaintext. The server decrypts it
              ephemerally to sign, then discards it.
            </p>
          </div>
        </div>
        </div>
      </section>

      {/* Tools */}
      <section id="tools" className="border-t border-foreground/10">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <div className="mb-10 flex flex-col items-start sm:items-center sm:text-center">
            <span className="rounded-full border border-[var(--celo-deep)]/30 bg-background px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-[var(--celo-deep)]">
              § Tools v0.1
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl" style={{ fontFamily: "var(--font-display)" }}>
              12 tools. One agent. Whole chain.
            </h2>
            <p className="mt-3 max-w-xl text-base text-muted-foreground sm:text-lg">
              Everything your LLM needs to read state and move value on Celo mainnet.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((t) => (
              <div
                key={t.name}
                className="group rounded-xl border border-foreground/10 bg-card p-4 transition hover:-translate-y-0.5 hover:border-[var(--celo-forest)]/40 hover:shadow-[var(--shadow-soft)]"
              >
                <div className="flex items-center justify-between">
                  <code className="font-mono text-sm font-semibold text-[var(--celo-deep)]">{t.name}</code>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] ${
                      t.type === "write"
                        ? "bg-[var(--celo-yellow)] text-[var(--celo-ink)]"
                        : "border border-[var(--celo-forest)]/30 text-[var(--celo-forest)]"
                    }`}
                  >
                    {t.type}
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="relative overflow-hidden rounded-3xl bg-[var(--celo-deep)] p-8 text-[var(--celo-cream)] shadow-[var(--shadow-pop)] sm:p-12 lg:p-16">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[var(--celo-yellow)] opacity-40 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-[var(--celo-forest)] opacity-50 blur-3xl" />
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
              <img src={celoWordmarkSnow} alt="Celo" className="h-3.5 w-auto opacity-90" />
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