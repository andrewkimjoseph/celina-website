import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faBolt,
  faCheck,
  faCopy,
  faGaugeHigh,
  faLock,
  faMagnifyingGlass,
  faPenRuler,
  faArrowUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import { faNpm, faGithub } from "@fortawesome/free-brands-svg-icons";
import { SiteHeader } from "@/components/site-header";

const SDK_NPM_URL = "https://www.npmjs.com/package/@andrewkimjoseph/celina-sdk";
const SDK_DOCS_URL = "https://andrewkimjoseph.gitbook.io/celina-sdk";
const MCP_NPM_URL = "https://www.npmjs.com/package/@andrewkimjoseph/celina-mcp";
const SELF_AGENT_URL = "https://www.npmjs.com/package/@selfxyz/agent-sdk";

const INSTALL_CMD = "npm i @andrewkimjoseph/celina-sdk@latest";

const QUICK_START = `import { createCelinaClient } from "@andrewkimjoseph/celina-sdk";

const celina = createCelinaClient({
  rpcUrl: "https://forno.celo.org",
  ethRpcUrl: "https://ethereum.publicnode.com", // optional, for ENS
});

// Reads
await celina.token.getStablecoinBalances("0xYourAddress");
await celina.mentoFx.getFxQuote("USDm", "EURm", "100");

// Prepare unsigned txs (user signs in wallet)
const flow = await celina.transaction.prepareSend(
  "0xFrom",
  "0xTo",
  "USDm",
  "10",
);
// flow.steps → pass to wagmi sendTransaction`;

type Row = { service: string; reads: string; prepare: string };

const API_ROWS: Row[] = [
  { service: "blockchain", reads: "network status, blocks, transactions", prepare: "—" },
  { service: "account", reads: "CELO balance, nonce", prepare: "—" },
  { service: "token", reads: "balances, token info, stablecoins", prepare: "—" },
  { service: "ens", reads: "resolve ENS names", prepare: "—" },
  { service: "gooddollar", reads: "whitelist status", prepare: "—" },
  { service: "transaction", reads: "gas fees, estimates", prepare: "prepareSend" },
  { service: "mentoFx", reads: "getFxQuote, estimateFx", prepare: "prepareFx" },
  { service: "aave", reads: "—", prepare: "prepareSupply, prepareWithdraw" },
  { service: "governance", reads: "proposals list, details", prepare: "—" },
  { service: "staking", reads: "balances, validator groups", prepare: "—" },
  { service: "nft", reads: "NFT info, balance", prepare: "—" },
  { service: "contract", reads: "callFunction, estimateGas", prepare: "—" },
];

export const Route = createFileRoute("/sdk")({
  head: () => ({
    meta: [
      { title: "Celina SDK — frontend library for Celo" },
      {
        name: "description",
        content:
          "Celina-linked mainnet SDK for frontend apps — reads, gas estimates, and unsigned transaction preparation. Pair with wagmi/viem; users sign in their wallet.",
      },
      { property: "og:title", content: "Celina SDK — frontend library for Celo" },
      {
        property: "og:description",
        content:
          "Celina-linked mainnet SDK for frontend apps — reads, gas estimates, and unsigned transaction preparation. Pair with wagmi/viem; users sign in their wallet.",
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

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-12 pb-10 sm:px-6 sm:pt-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--celo-forest)]/40 bg-card/80 px-3 py-1 text-xs font-medium text-foreground">
          <FontAwesomeIcon icon={faBookOpen} className="h-3 w-3 text-[var(--celo-forest)] dark:text-foreground" />
          <span className="uppercase tracking-[0.18em]">SDK · Frontend library</span>
        </div>
        <h1
          className="mt-5 text-4xl font-bold tracking-tight sm:text-6xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Celina SDK
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Celina-linked mainnet library for frontend apps — <span className="font-medium text-foreground">reads</span> and{" "}
          <span className="font-medium text-foreground">unsigned transaction preparation</span> (no private keys).
          Pair with <a className="underline decoration-[var(--celo-yellow)] decoration-2 underline-offset-4 hover:text-foreground" href="https://wagmi.sh/" target="_blank" rel="noreferrer">wagmi</a>{" "}
          / viem in the browser — users sign prepared transactions in their wallet.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-3">
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
      </section>

      {/* What you can do */}
      <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
        <h2
          className="mb-5 text-2xl font-bold tracking-tight sm:text-3xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          What you can do
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <CapabilityCard
            icon={faMagnifyingGlass}
            title="Reads"
            body="Token balances, Mento FX quotes, governance proposals, ENS resolution."
          />
          <CapabilityCard
            icon={faGaugeHigh}
            title="Estimates"
            body="Gas for sends, FX swaps, and generic contract calls."
          />
          <CapabilityCard
            icon={faPenRuler}
            title="Prepare"
            body="Unsigned tx flows for sends, Mento FX, and Aave supply/withdraw."
          />
        </div>
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-[var(--celo-forest)]/30 bg-[var(--celo-forest)]/5 p-4 text-sm text-foreground">
          <FontAwesomeIcon icon={faLock} className="mt-0.5 h-4 w-4 text-[var(--celo-forest)] dark:text-[var(--celo-yellow)]" />
          <span>
            The SDK never holds or uses private keys. Call <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">prepare*</span> methods with the user&apos;s wallet address, then pass the returned <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">steps</span> to wagmi for signing.
          </span>
        </div>
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
          and{" "}
          <a className="text-foreground underline decoration-[var(--celo-yellow)] decoration-2 underline-offset-4" href={`${SDK_DOCS_URL}/guides/wagmi-integration`} target="_blank" rel="noreferrer">
            wagmi integration
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
                  <th className="px-5 py-3 font-semibold">Prepare (unsigned)</th>
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
                      {r.prepare === "—" ? (
                        <span className="text-muted-foreground">—</span>
                      ) : (
                        <code className="font-mono text-xs text-foreground">{r.prepare}</code>
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
          <a className="text-foreground underline decoration-[var(--celo-yellow)] decoration-2 underline-offset-4" href={`${SDK_DOCS_URL}/api-reference/api-reference`} target="_blank" rel="noreferrer">
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
          <a
            href={MCP_NPM_URL}
            target="_blank"
            rel="noreferrer"
            className="group rounded-2xl border border-foreground/10 bg-card p-5 shadow-[var(--shadow-soft)] transition hover:border-[var(--celo-forest)]"
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--celo-forest)] dark:text-[var(--celo-yellow)]">
              <FontAwesomeIcon icon={faNpm} className="h-3.5 w-3.5" /> MCP server
            </div>
            <h3 className="mt-2 font-mono text-sm font-semibold text-foreground">@andrewkimjoseph/celina-mcp</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              MCP server for IDE / CLI agents — server-key writes and Self Agent ID.
            </p>
          </a>
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