import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Copy, Github, Package, Terminal, Zap, Lock, Coins, Sparkles } from "lucide-react";
import celinaLogo from "@/assets/celina-logo.png";
import celinaBanner from "@/assets/celina-banner.png";

export const Route = createFileRoute("/")({
  component: Index,
});

const NPM_URL = "https://www.npmjs.com/package/@andrewkimjoseph/celina-mcp";

const CURSOR_CONFIG = `{
  "mcpServers": {
    "celo": {
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

const CLAUDE_CONFIG = `{
  "mcpServers": {
    "celo": {
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
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
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
      <pre className="overflow-x-auto rounded-xl border border-foreground/10 bg-[oklch(0.18_0.04_145)] p-5 pr-20 text-sm leading-relaxed text-[oklch(0.92_0.05_100)] shadow-[var(--shadow-soft)]">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function CelinaMark({ className = "" }: { className?: string }) {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <div className="absolute inset-0 rounded-full bg-[var(--celo-forest)] blur-3xl opacity-40" />
      <img
        src={celinaLogo}
        alt="Celina — Celo MCP Server"
        className="relative h-32 w-32 rounded-full shadow-[var(--shadow-pop)] sm:h-40 sm:w-40"
      />
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
  { name: "get_swap_quote", type: "read", desc: "Swap preview" },
  { name: "estimate_send", type: "read", desc: "Gas estimate" },
  { name: "send_token", type: "write", desc: "Send CELO or ERC-20" },
  { name: "get_wallet_encryption_public_key", type: "read", desc: "RSA public key" },
  { name: "get_latest_blocks", type: "read", desc: "Recent blocks" },
];

function Index() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-foreground/10 bg-background/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#top" className="flex items-center gap-2">
            <img src={celinaLogo} alt="Celina" className="h-9 w-9 rounded-full" />
            <span className="font-semibold tracking-tight">Celina</span>
            <span className="hidden text-xs text-muted-foreground sm:inline">· Celo MCP</span>
          </a>
          <nav className="flex items-center gap-1 text-sm">
            <a href="#install" className="rounded-md px-3 py-1.5 text-foreground/70 transition hover:text-foreground">Install</a>
            <a href="#tools" className="rounded-md px-3 py-1.5 text-foreground/70 transition hover:text-foreground">Tools</a>
            <a href={NPM_URL} target="_blank" rel="noreferrer" className="ml-1 inline-flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background transition hover:opacity-90">
              <Package className="h-3.5 w-3.5" /> npm
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10" style={{ backgroundImage: "var(--gradient-hero)" }} />
        <div className="absolute inset-x-0 top-0 -z-10 h-[600px]" style={{
          backgroundImage: "linear-gradient(to right, oklch(0.22 0.06 145 / 0.05) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.22 0.06 145 / 0.05) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }} />
        <div className="mx-auto max-w-6xl px-6 pt-20 pb-24 sm:pt-28 sm:pb-32">
          <div className="flex flex-col items-center text-center">
            <CelinaMark className="mb-8" />
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-background/60 px-3 py-1 text-xs font-medium text-foreground/70 backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--celo-forest)] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--celo-forest)]" />
              </span>
              v0.1 · Live on Celo mainnet
            </div>
            <h1 className="max-w-4xl text-balance text-5xl font-black tracking-tight sm:text-7xl">
              Meet <span className="relative inline-block">
                <span className="relative z-10">Celina</span>
                <span className="absolute inset-x-0 bottom-1 -z-0 h-4 bg-[var(--celo-yellow)] sm:h-5" />
              </span>
              <span className="block text-foreground/70 text-3xl sm:text-4xl font-semibold mt-3">
                Your LLM&apos;s plug into Celo.
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              An open-source MCP server that gives Claude, Cursor, and any agent read &amp; write
              access to Celo mainnet — balances, stablecoins, sends, and chain reads.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#install"
                className="inline-flex items-center gap-2 rounded-lg bg-foreground px-5 py-3 text-sm font-semibold text-background shadow-[var(--shadow-pop)] transition hover:-translate-y-0.5"
              >
                <Sparkles className="h-4 w-4" /> Add to Cursor / Claude
              </a>
              <a
                href={NPM_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-foreground bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-accent"
              >
                <Package className="h-4 w-4" /> View on npm
              </a>
            </div>

            {/* npm install one-liner */}
            <div className="mt-10 inline-flex items-center gap-3 rounded-full border border-foreground/15 bg-[oklch(0.18_0.04_145)] py-2 pl-5 pr-2 text-sm text-[oklch(0.92_0.05_100)] shadow-[var(--shadow-soft)]">
              <span className="text-[var(--celo-yellow)]">$</span>
              <code className="font-mono">npm i @andrewkimjoseph/celina-mcp</code>
              <CopyButton text="npm i @andrewkimjoseph/celina-mcp" />
            </div>
          </div>
        </div>
      </section>

      {/* Features strip */}
      <section className="border-y border-foreground/10 bg-secondary/50">
        <div className="mx-auto max-w-6xl px-6 pt-16">
          <figure className="overflow-hidden rounded-2xl border border-foreground/10 shadow-[var(--shadow-pop)]">
            <img
              src={celinaBanner}
              alt="Celina — MCP Server for the Celo Network. Connect. Build. Empower."
              className="block h-auto w-full"
              loading="lazy"
            />
          </figure>
        </div>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-px overflow-hidden bg-foreground/10 sm:grid-cols-3">
          {[
            { icon: Zap, title: "1-minute setup", body: "Drop a JSON snippet into Cursor or Claude Desktop. Done." },
            { icon: Coins, title: "Mainnet ready", body: "CELO, cUSD, USDC, USDT, and Mento stablecoins out of the box." },
            { icon: Lock, title: "Keys never stored", body: "Write tools accept RSA-encrypted keys, decrypted ephemerally." },
          ].map((f) => (
            <div key={f.title} className="bg-background p-8">
              <f.icon className="h-6 w-6 text-[var(--celo-forest)]" />
              <h3 className="mt-4 font-semibold tracking-tight">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Install */}
      <section id="install" className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-12 flex flex-col items-start sm:items-center sm:text-center">
          <span className="rounded-full bg-[var(--celo-yellow)] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--celo-ink)]">
            Install
          </span>
          <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
            Hook Celina into your agent
          </h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Pick your client, copy the config, restart. Celina shows up as MCP tools your LLM can call.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Cursor */}
          <article className="rounded-2xl border-2 border-foreground/15 bg-card p-7 shadow-[var(--shadow-soft)]">
            <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--celo-forest)]">
              <Terminal className="h-3.5 w-3.5" /> Cursor
            </div>
            <h3 className="text-2xl font-bold tracking-tight">Add to Cursor</h3>
            <ol className="mt-4 space-y-2 text-sm text-foreground/80">
              <li><span className="font-semibold">1.</span> Open Cursor → <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">Settings → MCP</span></li>
              <li><span className="font-semibold">2.</span> Click <em>Add new MCP server</em> and paste the config below</li>
              <li><span className="font-semibold">3.</span> Reload — Celina&apos;s tools appear in chat</li>
            </ol>
          <div className="mt-5">
              <CodeBlock code={CURSOR_CONFIG} />
            </div>
          </article>

          {/* Claude Desktop */}
          <article className="rounded-2xl border-2 border-foreground/15 bg-card p-7 shadow-[var(--shadow-soft)]">
            <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--celo-forest)]">
              <Terminal className="h-3.5 w-3.5" /> Claude Desktop
            </div>
            <h3 className="text-2xl font-bold tracking-tight">Add to Claude</h3>
            <ol className="mt-4 space-y-2 text-sm text-foreground/80">
              <li><span className="font-semibold">1.</span> Open <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">claude_desktop_config.json</span></li>
              <li><span className="font-semibold">2.</span> Merge the snippet below into <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">mcpServers</span></li>
              <li><span className="font-semibold">3.</span> Restart Claude Desktop</li>
            </ol>
            <div className="mt-5">
              <CodeBlock code={CLAUDE_CONFIG} />
            </div>
          </article>
        </div>

        {/* Remote */}
        <div className="mt-10 rounded-2xl border-2 border-dashed border-foreground/20 bg-secondary/30 p-7">
          <div className="flex flex-wrap items-baseline gap-3">
            <h3 className="text-xl font-bold tracking-tight">Direct Streamable HTTP endpoint</h3>
            <span className="rounded-full bg-[var(--celo-forest)] px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-[var(--celo-cream)]">Remote</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Point any MCP client directly at the deployed Render endpoint. No local install needed.
          </p>
          <div className="mt-5">
            <CodeBlock code={`https://mcp.celina.andrewkimjoseph.com/mcp`} />
          </div>
        </div>

        {/* Write tools note */}
        <div className="mt-10 flex items-start gap-4 rounded-xl border border-foreground/10 bg-background p-5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--celo-yellow)] text-[var(--celo-ink)]">
            <Lock className="h-4 w-4" />
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
      </section>

      {/* Tools */}
      <section id="tools" className="border-t border-foreground/10 bg-secondary/40">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="mb-10 flex flex-col items-start sm:items-center sm:text-center">
            <span className="rounded-full bg-[var(--celo-forest)] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--celo-cream)]">
              Tools v0.1
            </span>
            <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              12 tools. One agent. Whole chain.
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Everything your LLM needs to read state and move value on Celo mainnet.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((t) => (
              <div
                key={t.name}
                className="group rounded-xl border border-foreground/10 bg-card p-4 transition hover:-translate-y-0.5 hover:border-foreground/30 hover:shadow-[var(--shadow-soft)]"
              >
                <div className="flex items-center justify-between">
                  <code className="font-mono text-sm font-semibold text-foreground">{t.name}</code>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      t.type === "write"
                        ? "bg-[var(--celo-yellow)] text-[var(--celo-ink)]"
                        : "bg-secondary text-muted-foreground"
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
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="relative overflow-hidden rounded-3xl border-2 border-foreground bg-[var(--celo-ink)] p-10 text-[var(--celo-cream)] shadow-[var(--shadow-pop)] sm:p-16">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[var(--celo-yellow)] opacity-30 blur-3xl" />
          <div className="relative">
            <h2 className="max-w-2xl text-4xl font-black tracking-tight sm:text-5xl">
              Give your agent a wallet. <span className="text-[var(--celo-yellow)]">Say hi to Celina.</span>
            </h2>
            <p className="mt-4 max-w-xl text-base text-[var(--celo-cream)]/70">
              Open source. MIT licensed. Built for the next wave of on-chain agents.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={NPM_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--celo-yellow)] px-5 py-3 text-sm font-bold text-[var(--celo-ink)] transition hover:-translate-y-0.5"
              >
                <Package className="h-4 w-4" /> Install from npm
              </a>
              <a
                href="https://modelcontextprotocol.io/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--celo-cream)]/30 px-5 py-3 text-sm font-semibold text-[var(--celo-cream)] transition hover:bg-[var(--celo-cream)]/10"
              >
                Learn about MCP
              </a>
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
              <Package className="h-4 w-4" /> npm
            </a>
            <a href="https://modelcontextprotocol.io/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-foreground">
              <Github className="h-4 w-4" /> MCP spec
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}