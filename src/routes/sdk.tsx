import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faBolt,
  faCheck,
  faCopy,
  faGaugeHigh,
  faLayerGroup,
  faLock,
  faMagnifyingGlass,
  faPenRuler,
  faShieldHalved,
  faArrowUpRightFromSquare,
  faTags,
} from "@fortawesome/free-solid-svg-icons";
import { faNpm, faGithub } from "@fortawesome/free-brands-svg-icons";
import { PageHero, PageHeroSection } from "@/components/marketing/page-hero";
import { SiteHeader } from "@/components/site-header";
import { HOSTED_TOOL_COUNT } from "@/data/tools";

const SDK_NPM_URL = "https://www.npmjs.com/package/@andrewkimjoseph/celina-sdk";
const SDK_DOCS_URL = "https://andrewkimjoseph.gitbook.io/celina-sdk";
const MCP_NPM_URL = "https://www.npmjs.com/package/@andrewkimjoseph/celina-mcp";
const SELF_AGENT_URL = "https://www.npmjs.com/package/@selfxyz/agent-sdk";

const INSTALL_CMD = "npm i @andrewkimjoseph/celina-sdk@latest";

const TOOL_CATALOG_START = `import { createCelinaClient } from "@andrewkimjoseph/celina-sdk";
import {
  ALL_TOOL_DEFINITIONS,
  filterToolDefinitions,
} from "@andrewkimjoseph/celina-sdk/tools";

const celina = createCelinaClient({ rpcUrl: "https://forno.celo.org" });

// Browser wallet app — user signs in wallet
const browserTools = filterToolDefinitions(ALL_TOOL_DEFINITIONS, {
  surface: "browser",
});

// MCP server — full catalog with executors when CELO_PRIVATE_KEY is set
const mcpTools = filterToolDefinitions(ALL_TOOL_DEFINITIONS, {
  surface: "mcp",
});`;

const QUICK_START = `import { createCelinaClient } from "@andrewkimjoseph/celina-sdk";

const celina = createCelinaClient({
  rpcUrl: "https://forno.celo.org",
  ethRpcUrl: "https://ethereum.publicnode.com", // optional, for ENS
});

// Reads
await celina.token.getStablecoinBalances("0xYourAddress");
await celina.mentoFx.getFxQuote("USDm", "EURm", "100");

// Unsigned txs (user signs in wallet)
const flow = await celina.transaction.prepareSend(
  "0xFrom",
  "0xTo",
  "USDm",
  "10",
);
// flow.steps → pass to wagmi sendTransactionAsync`;

type Row = { service: string; reads: string; wallet: string };

const API_ROWS: Row[] = [
  { service: "blockchain", reads: "network status, blocks, transactions", wallet: "—" },
  { service: "account", reads: "CELO balance, nonce", wallet: "—" },
  { service: "token", reads: "balances, token info, stablecoins", wallet: "—" },
  { service: "ens", reads: "resolve ENS names", wallet: "—" },
  { service: "gooddollar", reads: "whitelist status, UBI entitlement, reserve quote/estimate", wallet: "claim UBI, reserve swap; MCP execute: executeReserveSwap" },
  { service: "transaction", reads: "gas fees, estimates", wallet: "send" },
  { service: "mentoFx", reads: "getFxQuote, estimateFx", wallet: "FX swap" },
  { service: "uniswap", reads: "getSwapQuote, estimateSwap", wallet: "swap" },
  { service: "aave", reads: "getBalances (supplied aToken positions)", wallet: "supply, withdraw" },
  { service: "governance", reads: "proposals list, details", wallet: "—" },
  { service: "staking", reads: "balances, validator groups", wallet: "—" },
  { service: "nft", reads: "NFT info, balance", wallet: "—" },
  { service: "contract", reads: "callFunction, estimateGas", wallet: "prepareFunction" },
];

export const Route = createFileRoute("/sdk")({
  head: () => ({
    meta: [
      { title: "Celina SDK — shared tool catalog for Celo agents" },
      {
        name: "description",
        content:
          "Celina SDK for Celo mainnet — programmatic reads and unsigned wallet flows, plus a shared LLM tool catalog that powers celina-mcp and browser wallet apps from one source of truth.",
      },
      { property: "og:title", content: "Celina SDK — shared tool catalog for Celo agents" },
      {
        property: "og:description",
        content:
          "Celina SDK for Celo mainnet — programmatic reads and unsigned wallet flows, plus a shared LLM tool catalog that powers celina-mcp and browser wallet apps from one source of truth.",
      },
    ],
  }),
  component: SdkPage,
});

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
      <pre className="overflow-x-auto rounded-xl border border-[var(--celo-forest)]/40 bg-[color-mix(in_oklab,var(--celo-forest)_18%,var(--celo-ink))] p-4 pr-20 text-[12px] leading-relaxed text-[var(--celo-cream)] shadow-[var(--shadow-soft)] sm:p-5 sm:text-sm">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function CapabilityCard({
  icon,
  title,
  body,
}: {
  icon: typeof faMagnifyingGlass;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-foreground/10 bg-card p-6 shadow-[var(--shadow-soft)]">
      <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--celo-yellow)] text-[var(--celo-ink)]">
        <FontAwesomeIcon icon={icon} className="h-4 w-4" />
      </div>
      <h3
        className="mt-4 text-lg font-semibold tracking-tight"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}

function SdkPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <PageHeroSection>
        <PageHero
          icon={faBookOpen}
          badge="SDK · Shared tool catalog"
          title="Celina SDK"
          wide
          description={
            <>
              One mainnet library for Celo agents — <span className="font-medium text-foreground">reads</span>,{" "}
              <span className="font-medium text-foreground">unsigned wallet flows</span>, and a shared{" "}
              <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">/tools</span> export that powers{" "}
              <span className="font-medium text-foreground">celina-mcp</span> and{" "}
              <span className="font-medium text-foreground">browser wallet apps</span> from the same definitions.
              Pair with{" "}
              <a
                className="underline decoration-[var(--celo-yellow)] decoration-2 underline-offset-4 hover:text-foreground"
                href="https://wagmi.sh/"
                target="_blank"
                rel="noreferrer"
              >
                wagmi
              </a>{" "}
              / viem when users sign in their wallet.
            </>
          }
        >
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={SDK_DOCS_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--celo-yellow)] px-5 py-3 text-sm font-semibold text-[var(--celo-ink)] transition hover:-translate-y-0.5"
            >
              <FontAwesomeIcon icon={faBookOpen} className="h-4 w-4" />
              Read the docs
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="h-3 w-3" />
            </a>
            <a
              href={SDK_NPM_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition hover:border-[var(--celo-forest)] hover:bg-muted"
            >
              <FontAwesomeIcon icon={faNpm} className="h-4 w-4" /> View on npm
            </a>
          </div>
        </PageHero>
      </PageHeroSection>

      {/* What you can do */}
      <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
        <h2
          className="mb-5 text-2xl font-bold tracking-tight sm:text-3xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          What you can do
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <CapabilityCard
            icon={faMagnifyingGlass}
            title="Reads"
            body="Token balances, Mento FX quotes, GoodDollar reserve quotes (G$ ↔ USDm), governance proposals, ENS resolution."
          />
          <CapabilityCard
            icon={faGaugeHigh}
            title="Estimates"
            body="Gas for sends, FX swaps, and generic contract calls."
          />
          <CapabilityCard
            icon={faPenRuler}
            title="Wallet signing"
            body="Unsigned tx flows for sends, Mento FX, GoodDollar reserve (G$ ↔ USDm), Uniswap v4, Aave, GoodDollar UBI, and generic contract writes. Prepared flows return chainId 42220."
          />
          <CapabilityCard
            icon={faLayerGroup}
            title="Sponsored UserOps"
            body="createAAClient submits prepared steps as ERC-4337 UserOps with your Pimlico (or future) API key. MCP does not host sponsorship credentials."
          />
          <CapabilityCard
            icon={faTags}
            title="On-chain attribution"
            body="ERC-8021 Schema 0 (celina + app codes). Set attributionTags on createCelinaClient or createAAClient. Prefer check_attribution_tag for unified custom tags; verify still surfaces historical CELINA|… when present."
          />
          <CapabilityCard
            icon={faShieldHalved}
            title="Sign-time simulation"
            body="Import @andrewkimjoseph/celina-sdk/simulation — simulatePreparedStep dry-runs each PreparedTx before wagmi send; celina-mcp uses the same helper in executePreparedFlow."
          />
          <CapabilityCard
            icon={faBolt}
            title="Tool catalog"
            body="Import @andrewkimjoseph/celina-sdk/tools — filter by surface (mcp or browser), family (read/execute). Same schemas celina-mcp registers."
          />
        </div>
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-[var(--celo-forest)]/30 bg-[var(--celo-forest)]/5 p-4 text-sm text-foreground">
          <FontAwesomeIcon icon={faLock} className="mt-0.5 h-4 w-4 text-[var(--celo-forest)] dark:text-[var(--celo-yellow)]" />
          <span>
            <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">createCelinaClient</span> never holds CELO wallet keys — pass prepared <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">steps</span> to wagmi. For sponsored UserOps, <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">createAAClient</span> uses an owner key and your app-owned gas sponsorship credentials. Optional-address defaults and <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">get_wallet_address</span> are celina-mcp only (local stdio + server key).
          </span>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Browser surface apps use <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">surface: &quot;browser&quot;</span> and pass the connected wallet on every call — no server keys. MCP hosts use <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">surface: &quot;mcp&quot;</span> with optional executors when <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">CELO_PRIVATE_KEY</span> is configured.
        </p>
      </section>

      {/* Tool catalog */}
      <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
        <div className="mb-4 flex items-center gap-2">
          <FontAwesomeIcon icon={faBolt} className="h-4 w-4 text-[var(--celo-forest)] dark:text-[var(--celo-yellow)]" />
          <h2
            className="text-2xl font-bold tracking-tight sm:text-3xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Tool catalog for agent hosts
          </h2>
        </div>
        <p className="mb-4 max-w-2xl text-sm text-muted-foreground">
          From v0.5.0, the <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">/tools</span> export ships Zod schemas, descriptions, and handlers for every LLM tool. celina-mcp registers them via <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">registerSdkTools</span>; browser chat apps filter with <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">surface: &quot;browser&quot;</span>. Use <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">dynamicTool</span> when registering many tools in AI SDK hosts to avoid TypeScript OOM.
        </p>
        <CodeBlock code={TOOL_CATALOG_START} />
        <p className="mt-3 text-sm text-muted-foreground">
          Full guide:{" "}
          <a className="text-foreground underline decoration-[var(--celo-yellow)] decoration-2 underline-offset-4" href={`${SDK_DOCS_URL}/guides/tool-catalog`} target="_blank" rel="noreferrer">
            LLM tool catalog
          </a>
          .
        </p>
      </section>

      {/* Install */}
      <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
        <h2
          className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Install
        </h2>
        <div className="flex w-full items-center gap-2 overflow-hidden rounded-full border border-[var(--celo-yellow)]/20 bg-[var(--celo-ink)] py-2 pl-4 pr-2 text-[12px] text-[var(--celo-cream)] shadow-[var(--shadow-soft)] sm:w-auto sm:inline-flex sm:gap-3 sm:pl-5 sm:text-sm">
          <span className="font-mono text-[var(--celo-yellow)]">$</span>
          <code className="flex-1 overflow-x-auto whitespace-nowrap font-mono">{INSTALL_CMD}</code>
          <CopyButton text={INSTALL_CMD} />
        </div>
      </section>

      {/* Quick start */}
      <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
        <div className="mb-4 flex items-center gap-2">
          <FontAwesomeIcon icon={faBolt} className="h-4 w-4 text-[var(--celo-forest)] dark:text-[var(--celo-yellow)]" />
          <h2
            className="text-2xl font-bold tracking-tight sm:text-3xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Quick start
          </h2>
        </div>
        <CodeBlock code={QUICK_START} />
        <p className="mt-3 text-sm text-muted-foreground">
          See{" "}
          <a className="text-foreground underline decoration-[var(--celo-yellow)] decoration-2 underline-offset-4" href={`${SDK_DOCS_URL}/getting-started/quick-start`} target="_blank" rel="noreferrer">
            Quick start
          </a>{" "}
          ,{" "}
          <a className="text-foreground underline decoration-[var(--celo-yellow)] decoration-2 underline-offset-4" href={`${SDK_DOCS_URL}/guides/wagmi-integration`} target="_blank" rel="noreferrer">
            wagmi integration
          </a>
          , and{" "}
          <a className="text-foreground underline decoration-[var(--celo-yellow)] decoration-2 underline-offset-4" href={`${SDK_DOCS_URL}/guides/prepared-step-simulation`} target="_blank" rel="noreferrer">
            prepared-step simulation
          </a>{" "}
          for the full signing flow.
        </p>
      </section>

      {/* API overview */}
      <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
        <h2
          className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          API overview
        </h2>
        <div className="overflow-hidden rounded-2xl border border-foreground/10 bg-card shadow-[var(--shadow-soft)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-foreground/10 bg-muted/40 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-semibold">Service</th>
                  <th className="px-5 py-3 font-semibold">Reads</th>
                  <th className="px-5 py-3 font-semibold">Wallet signing (unsigned)</th>
                </tr>
              </thead>
              <tbody>
                {API_ROWS.map((r) => (
                  <tr key={r.service} className="border-b border-foreground/5 last:border-0">
                    <td className="px-5 py-3 align-top">
                      <code className="font-mono text-xs font-semibold text-foreground">{r.service}</code>
                    </td>
                    <td className="px-5 py-3 align-top text-muted-foreground">{r.reads}</td>
                    <td className="px-5 py-3 align-top">
                      {r.wallet === "—" ? (
                        <span className="text-muted-foreground">—</span>
                      ) : (
                        <code className="font-mono text-xs text-foreground">{r.wallet}</code>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Full method signatures are in the{" "}
          <a className="text-foreground underline decoration-[var(--celo-yellow)] decoration-2 underline-offset-4" href={`${SDK_DOCS_URL}/concepts/prepared-flows`} target="_blank" rel="noreferrer">
            Wallet signing flows
          </a>
          ,{" "}
          <a className="text-foreground underline decoration-[var(--celo-yellow)] decoration-2 underline-offset-4" href={`${SDK_DOCS_URL}/guides/account-abstraction`} target="_blank" rel="noreferrer">
            Account Abstraction
          </a>
          ,{" "}
          <a className="text-foreground underline decoration-[var(--celo-yellow)] decoration-2 underline-offset-4" href={`${SDK_DOCS_URL}/guides/on-chain-attribution`} target="_blank" rel="noreferrer">
            On-chain attribution
          </a>
          , plus the{" "}
          <a className="text-foreground underline decoration-[var(--celo-yellow)] decoration-2 underline-offset-4" href={`${SDK_DOCS_URL}/api-reference`} target="_blank" rel="noreferrer">
            API reference
          </a>
          .
        </p>
      </section>

      {/* Related packages */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <h2
          className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Related packages
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="group rounded-2xl border border-foreground/10 bg-card p-5 shadow-[var(--shadow-soft)] transition hover:border-[var(--celo-forest)]">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--celo-forest)] dark:text-[var(--celo-yellow)]">
              <FontAwesomeIcon icon={faNpm} className="h-3.5 w-3.5" /> MCP server
            </div>
            <h3 className="mt-2 font-mono text-sm font-semibold text-foreground">@andrewkimjoseph/celina-mcp</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              MCP server for IDE / CLI agents — registers the shared SDK tool catalog. {HOSTED_TOOL_COUNT} tools on remote hosted (reads, GoodDollar reserve quote, AgentKarma reputation), full stdio with <span className="font-mono text-xs">CELO_PRIVATE_KEY</span> for execute/write.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                to="/mcp"
                className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-[var(--celo-yellow)]"
              >
                MCP hub
              </Link>
              <a
                href={MCP_NPM_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-[var(--celo-yellow)]"
              >
                <FontAwesomeIcon icon={faNpm} className="h-3 w-3" /> npm
              </a>
            </div>
          </div>
          <a
            href={SELF_AGENT_URL}
            target="_blank"
            rel="noreferrer"
            className="group rounded-2xl border border-foreground/10 bg-card p-5 shadow-[var(--shadow-soft)] transition hover:border-[var(--celo-forest)]"
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--celo-forest)] dark:text-[var(--celo-yellow)]">
              <FontAwesomeIcon icon={faNpm} className="h-3.5 w-3.5" /> Self Agent ID
            </div>
            <h3 className="mt-2 font-mono text-sm font-semibold text-foreground">@selfxyz/agent-sdk</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Self Agent ID toolkit (separate from this SDK).
            </p>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-foreground/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            Built by{" "}
            <a className="font-medium text-foreground hover:underline" href="https://www.npmjs.com/~andrewkimjoseph" target="_blank" rel="noreferrer">
              @andrewkimjoseph
            </a>{" "}
            · MIT
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link to="/about" className="hover:text-foreground">About</Link>
            <Link to="/mcp" className="hover:text-foreground">MCP</Link>
            <Link to="/tools" className="hover:text-foreground">Tools</Link>
            <Link to="/stats" className="hover:text-foreground">Stats</Link>
            <a href={SDK_NPM_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-foreground">
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