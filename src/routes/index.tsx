import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTerminal,
  faBolt,
  faLock,
  faWandMagicSparkles,
  faArrowRight,
  faCloud,
  faCircleNodes,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";
import { faNpm, faGithub } from "@fortawesome/free-brands-svg-icons";
import {
  TOOLS as TOOL_DOCS,
  TOOLS_BY_NAME,
  categorySlug,
  HOSTED_TOOL_COUNT,
} from "@/data/tools";
import { MCP_INSTALL_CMD, MCP_NPM_URL } from "@/data/mcp";
import { CopyButton } from "@/components/marketing/code-block";
import { SiteHeader } from "@/components/site-header";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Celina — Celo agent stack for LLMs" },
      {
        name: "description",
        content:
          "Celina is a third-party, open-source stack that gives an LLM read, prepare, and execute access to Celo mainnet through an SDK, an MCP server, and a REST API.",
      },
      { property: "og:title", content: "Celina — Celo agent stack for LLMs" },
      {
        property: "og:description",
        content:
          "Celina is a third-party, open-source stack that gives an LLM read, prepare, and execute access to Celo mainnet through an SDK, an MCP server, and a REST API.",
      },
    ],
  }),
  component: Index,
});

function BrowserFrame({
  children,
  url = "claude.ai",
}: {
  children: React.ReactNode;
  url?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-[2px] border-2 border-[var(--celo-cream)] bg-[var(--celo-ink)] shadow-[var(--shadow-brutal-lg)]">
      <div className="flex items-center gap-3 border-b-2 border-white/10 bg-black/40 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="mx-auto flex max-w-md flex-1 items-center justify-center gap-2 rounded-[2px] bg-white/5 px-3 py-1 text-xs font-medium text-white/60">
          <FontAwesomeIcon icon={faLock} className="h-2.5 w-2.5 text-[var(--celo-yellow)]" />
          <span className="truncate font-mono">{url}</span>
        </div>
        <div className="w-12" />
      </div>
      {children}
    </div>
  );
}

const PANEL_ACCENT =
  "text-[var(--celo-forest)] dark:text-[var(--celo-yellow)]";

function Y({ children }: { children: React.ReactNode }) {
  return <span className={PANEL_ACCENT}>{children}</span>;
}

function Dim({ children }: { children: React.ReactNode }) {
  return <span className="text-muted-foreground">{children}</span>;
}

type PromptLine = { kind: "prompt"; content: React.ReactNode; divider?: boolean };
type ToolLine = {
  kind: "tool";
  tool: string;
  args?: Record<string, unknown>;
  result: React.ReactNode;
};
type TermLine = PromptLine | ToolLine;
type Scene = { lines: TermLine[] };

function formatToolArgs(args?: Record<string, unknown>): string {
  if (!args || Object.keys(args).length === 0) return "{}";
  return JSON.stringify(args);
}

function SceneLines({ scene, animate }: { scene: Scene; animate: boolean }) {
  return (
    <>
      {scene.lines.map((line, i) => {
        const enter = animate ? "terminal-line-in" : undefined;
        const delay = animate ? { animationDelay: `${i * 70}ms` } : undefined;

        if (line.kind === "prompt") {
          return (
            <div
              key={i}
              className={cn(
                enter,
                "flex gap-3 text-sm text-foreground",
                line.divider && "border-t-2 border-foreground pt-4",
              )}
              style={delay}
            >
              <span className={cn("shrink-0", PANEL_ACCENT)}>{">"}</span>
              <span>{line.content}</span>
            </div>
          );
        }

        const doc = TOOLS_BY_NAME[line.tool];
        if (!doc) return null;
        const isWrite = doc.kind === "write";

        return (
          <div
            key={i}
            className={cn(
              enter,
              "rounded-[2px] border-2 bg-muted px-3 py-2 shadow-[var(--shadow-brutal-sm)]",
              isWrite
                ? "border-[var(--celo-forest)] dark:border-[var(--celo-yellow)]"
                : "border-foreground",
            )}
            style={delay}
          >
            <div className={cn("text-xs", PANEL_ACCENT)}>
              tool ·{" "}
              <Link
                to="/tools/$category/$toolSlug"
                params={{
                  category: categorySlug(doc.category),
                  toolSlug: doc.slug,
                }}
                className="font-mono font-semibold hover:underline"
              >
                {doc.name}
              </Link>
              {isWrite ? " · write" : null}
            </div>
            <div className="mt-1.5 font-mono whitespace-pre-wrap break-all text-[12px] text-foreground">
              {formatToolArgs(line.args)}
            </div>
            <div className="mt-2 flex gap-3 text-[12px] text-foreground">
              <span className={cn("shrink-0", PANEL_ACCENT)}>↳</span>
              <span className="min-w-0">{line.result}</span>
            </div>
          </div>
        );
      })}
      <div className="flex gap-3 pt-1">
        <span className={cn("terminal-cursor", PANEL_ACCENT)}>▍</span>
      </div>
    </>
  );
}

const AGENT_STACK_SCENES: Scene[] = [
  {
    lines: [
      {
        kind: "prompt",
        content: (
          <>
            What&apos;s the USDm balance of <Y>0x4a…f10c</Y>?
          </>
        ),
      },
      {
        kind: "tool",
        tool: "get_stablecoin_balances",
        args: { address: "0x4a…f10c", stablecoins: ["USDm"] },
        result: (
          <>
            <span className="text-foreground">USDm</span> <Y>1,248.32</Y>
          </>
        ),
      },
      {
        kind: "prompt",
        divider: true,
        content: (
          <>
            Now send <Y>5 USDm</Y> to andrewkimjoseph.celo.eth.
          </>
        ),
      },
      {
        kind: "tool",
        tool: "send_token",
        args: { to: "andrewkimjoseph.celo.eth", token: "USDm", amount: "5" },
        result: (
          <>
            hash <Y>0x9c2…aa31</Y>
            <Dim> · status confirmed · blockNumber 30418224</Dim>
          </>
        ),
      },
    ],
  },
  {
    lines: [
      { kind: "prompt", content: <>Any governance proposals I can vote on?</> },
      {
        kind: "tool",
        tool: "get_votable_proposals",
        result: (
          <>
            id <Y>142</Y>
            <Dim> · stage referendum · dequeueIndex 3</Dim>
          </>
        ),
      },
      {
        kind: "prompt",
        divider: true,
        content: (
          <>
            Vote yes on proposal <Y>142</Y>.
          </>
        ),
      },
      {
        kind: "tool",
        tool: "execute_vote",
        args: { proposal_id: 142, vote: "Yes" },
        result: (
          <>
            hash <Y>0x71e…4c02</Y>
            <Dim> · status confirmed · blockNumber 30419015</Dim>
          </>
        ),
      },
    ],
  },
  {
    lines: [
      { kind: "prompt", content: <>Am I eligible for today&apos;s GoodDollar UBI?</> },
      {
        kind: "tool",
        tool: "get_gooddollar_ubi_entitlement",
        args: { address: "0x4a…f10c" },
        result: (
          <>
            claimableAmount <Y>178.4 G$</Y>
            <Dim> · isEligibleToClaim true</Dim>
          </>
        ),
      },
      { kind: "prompt", divider: true, content: <>Claim it.</> },
      {
        kind: "tool",
        tool: "claim_daily_gooddollar_ubi",
        result: (
          <>
            hash <Y>0x2af…9b10</Y>
            <Dim> · status confirmed · amountClaimed 178.4 G$</Dim>
          </>
        ),
      },
    ],
  },
  {
    lines: [
      { kind: "prompt", content: <>What do I have supplied on Aave?</> },
      {
        kind: "tool",
        tool: "get_aave_balances",
        args: { address: "0x4a…f10c" },
        result: (
          <>
            <Y>USDm</Y> formatted <Y>500.00</Y>
          </>
        ),
      },
      {
        kind: "prompt",
        divider: true,
        content: (
          <>
            Supply <Y>100 more USDm</Y>.
          </>
        ),
      },
      {
        kind: "tool",
        tool: "supply_aave",
        args: { token: "USDm", amount: "100" },
        result: (
          <>
            supplyHash <Y>0x3b7…e819</Y>
            <Dim> · status confirmed · blockNumber 30419780</Dim>
          </>
        ),
      },
    ],
  },
];

function AgentStackPanel({ toolCount }: { toolCount: number }) {
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const pausedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    timerRef.current = setInterval(() => {
      if (!pausedRef.current) {
        setActiveIndex((i) => (i + 1) % AGENT_STACK_SCENES.length);
      }
    }, 6000);
  }, [clearTimer]);

  useEffect(() => {
    setMounted(true);
    startTimer();
    return clearTimer;
  }, [startTimer, clearTimer]);

  const goToScene = (i: number) => {
    setActiveIndex(i);
    startTimer();
  };

  return (
    <div
      className="relative rounded-[2px] border-2 border-foreground bg-background shadow-[var(--shadow-brutal-lg)]"
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
    >
      <div className="flex items-center justify-between border-b-2 border-foreground px-4 py-2.5">
        <div
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-foreground"
          style={{ fontFamily: "var(--font-display)" }}
        >
          <FontAwesomeIcon icon={faTerminal} className={cn("h-3 w-3", PANEL_ACCENT)} />
          celina · agent stack
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-[2px] border-2 border-[var(--celo-yellow)] bg-[var(--celo-yellow)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--celo-ink)] shadow-[var(--shadow-brutal-sm)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--celo-ink)]" /> live
        </span>
      </div>
      <div className="grid px-5 py-5 text-[13px] leading-relaxed text-foreground sm:text-sm">
        {AGENT_STACK_SCENES.map((scene, i) => {
          const active = i === activeIndex;
          return (
            <div
              key={i}
              className={cn("col-start-1 row-start-1 space-y-4", !active && "invisible")}
              aria-hidden={!active}
            >
              <SceneLines scene={scene} animate={mounted && active} />
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-center gap-2.5 border-t-2 border-foreground px-5 py-3">
        {AGENT_STACK_SCENES.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Show scene ${i + 1} of ${AGENT_STACK_SCENES.length}`}
            aria-current={i === activeIndex}
            onClick={() => goToScene(i)}
            className={cn(
              "h-2.5 w-2.5 shrink-0 rounded-[2px] border-2 border-foreground shadow-[var(--shadow-brutal-sm)] transition-[transform,box-shadow,background-color,border-color] hover:border-[var(--celo-yellow)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
              i === activeIndex && "border-[var(--celo-yellow)] bg-[var(--celo-yellow)]",
            )}
          />
        ))}
      </div>
      <div
        className="flex items-center justify-between border-t-2 border-foreground px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-foreground"
        style={{ fontFamily: "var(--font-display)" }}
      >
        <span>sdk → mcp → celo mainnet</span>
        <span>{toolCount} tools</span>
      </div>
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

const FEATURED_TOOLS = TOOLS.slice(0, 6);

function Index() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Hero */}
      <section id="top" className="relative overflow-hidden">
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
            <div className="flex flex-col items-start text-left">
              <div className="mb-6 inline-flex items-center gap-2 rounded-[2px] border-2 border-foreground bg-card px-3 py-1 text-xs font-medium text-foreground shadow-[var(--shadow-brutal-sm)]">
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
              <div className="mt-6 h-px w-24 bg-[var(--celo-yellow)]" />
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                <span className="font-semibold text-foreground">Celina</span> is a third-party,
                open-source stack that gives an LLM read, prepare, and execute access to Celo
                mainnet through an{" "}
                <Link
                  className="underline decoration-[var(--celo-yellow)] decoration-2 underline-offset-4 hover:text-foreground"
                  to="/sdk"
                >
                  SDK
                </Link>
                , an MCP server, and a REST API.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to="/mcp"
                  className="group inline-flex items-center gap-2 rounded-[2px] border-2 border-foreground bg-[var(--celo-yellow)] px-6 py-3.5 text-sm font-semibold text-[var(--celo-ink)] shadow-[var(--shadow-brutal)] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[var(--shadow-brutal-lg)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                >
                  <FontAwesomeIcon icon={faWandMagicSparkles} className="h-4 w-4" />
                  Connect via MCP
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="h-3 w-3 transition group-hover:translate-x-0.5"
                  />
                </Link>
                <Link
                  to="/stack"
                  className="inline-flex items-center gap-2 rounded-[2px] border-2 border-foreground bg-card px-6 py-3.5 text-sm font-semibold text-foreground shadow-[var(--shadow-brutal-sm)] transition-[transform,box-shadow,background-color] hover:bg-muted active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                >
                  Explore the stack
                </Link>
              </div>

              <div className="mt-8 flex w-full max-w-full items-center gap-2 overflow-hidden rounded-[2px] border-2 border-[var(--celo-cream)] bg-[var(--celo-ink)] py-2 pl-4 pr-2 text-[11px] text-[var(--celo-cream)] shadow-[var(--shadow-brutal-sm)] sm:inline-flex sm:w-auto sm:gap-3 sm:pl-5 sm:text-sm">
                <span className="font-mono text-[var(--celo-yellow)]">$</span>
                <code className="flex-1 overflow-x-auto whitespace-nowrap font-mono">
                  {MCP_INSTALL_CMD}
                </code>
                <CopyButton text={MCP_INSTALL_CMD} />
              </div>

              <div className="mt-8 flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                <span>Built on</span>
                <img
                  src="/celo-wordmark-onyx.svg"
                  alt="Celo"
                  className="h-4 w-auto opacity-80 dark:hidden"
                />
                <img
                  src="/celo-wordmark-yellow.svg"
                  alt="Celo"
                  className="hidden h-4 w-auto opacity-90 dark:inline-block"
                />
              </div>
            </div>

            <div className="relative hidden lg:block">
              <AgentStackPanel toolCount={TOOLS.length} />
            </div>
          </div>
        </div>
      </section>

      {/* Stack teaser */}
      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <div className="rounded-[2px] border-2 border-foreground bg-card px-6 py-5 shadow-[var(--shadow-brutal)] sm:flex sm:items-center sm:justify-between sm:gap-6">
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            One catalog, four surfaces. SDK, local MCP, hosted endpoint, and browser apps.
          </p>
          <Link
            to="/stack"
            className="mt-4 inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-foreground transition hover:text-[var(--celo-forest)] dark:hover:text-[var(--celo-yellow)] sm:mt-0"
          >
            Explore the stack
            <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3" />
          </Link>
        </div>
      </section>

      {/* Demo */}
      <section id="demo" className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 sm:pb-24">
        <figure className="hidden" aria-hidden>
          <div className="relative">
            <div className="absolute -left-4 -top-4 hidden h-24 w-24 border-l-4 border-t-4 border-[var(--celo-yellow)] sm:block" />
            <div className="absolute -bottom-4 -right-4 hidden h-24 w-24 border-b-4 border-r-4 border-[var(--celo-forest)] sm:block" />

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
          </div>

          <figcaption className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
            <div className="flex flex-col items-start gap-2 text-sm sm:flex-row sm:items-center sm:gap-3">
              <span className="whitespace-nowrap rounded-[2px] border-2 border-foreground bg-[var(--celo-deep)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--celo-cream)]">
                Live demo
              </span>
              <span className="text-muted-foreground">
                Claude using Celina to supply to and withdraw from Aave.
              </span>
            </div>
          </figcaption>
        </figure>

        <div className="mt-20 grid gap-[2px] overflow-hidden rounded-[2px] border-2 border-foreground bg-foreground shadow-[var(--shadow-brutal)] sm:grid-cols-3">
          {[
            {
              icon: faBolt,
              title: "One catalog, two surfaces",
              body: "The same SDK tool definitions power celina-mcp, the remote endpoint, and browser agent hosts — no duplicate schemas or drift.",
            },
            {
              icon: faCloud,
              title: "Local or remote MCP",
              body: "Streamable HTTP for instant reads. Local stdio with CELO_PRIVATE_KEY for execute/write tools.",
            },
            {
              icon: faLock,
              title: "Keys stay local",
              body: "Remote MCP never sees private keys. Set CELO_PRIVATE_KEY in your MCP client env for local execution only.",
            },
          ].map((f) => (
            <div key={f.title} className="bg-background p-8">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-[2px] border-2 border-foreground bg-[var(--celo-yellow)] text-[var(--celo-ink)]">
                <FontAwesomeIcon icon={f.icon} className="h-4 w-4" />
              </div>
              <h3
                className="mt-5 text-lg font-semibold tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {f.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Principles */}
      <section className="border-t-2 border-foreground bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2
            className="mb-5 text-2xl font-bold tracking-tight sm:text-3xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Principles
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: faShieldHalved,
                title: "MIT licensed",
                body: "Open source. Use, fork, and ship agents without license friction.",
              },
              {
                icon: faCircleNodes,
                title: "One catalog",
                body: "No duplicate tool definitions between MCP, remote, and browser hosts.",
              },
              {
                icon: faLock,
                title: "Keys stay local",
                body: "Writes require the user's wallet or your MCP env — never the remote endpoint.",
              },
              {
                icon: faBolt,
                title: "Celo mainnet",
                body: "Production registry tokens, live DeFi protocols, and real on-chain state.",
              },
            ].map((item) => (
              <li
                key={item.title}
                className="flex gap-3 rounded-[2px] border-2 border-foreground bg-card p-4 shadow-[var(--shadow-brutal-sm)]"
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  className="mt-0.5 h-4 w-4 shrink-0 text-[var(--celo-forest)] dark:text-[var(--celo-yellow)]"
                />
                <div>
                  <p className="font-semibold text-foreground">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Tools teaser */}
      <section id="tools" className="border-t-2 border-foreground">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <div className="mb-10 flex flex-col items-start sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="rounded-[2px] border-2 border-foreground bg-card px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-foreground">
                § Tools
              </span>
              <h2
                className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {TOOLS.length} tools. One agent. Whole chain.
              </h2>
              <p className="mt-3 max-w-xl text-base text-muted-foreground">
                One shared catalog for reads and writes on Celo mainnet.{" "}
                <span className="font-medium text-foreground">
                  {HOSTED_TOOL_COUNT} remote · {TOOL_DOCS.length} stdio
                </span>
                .
              </p>
            </div>
            <Link
              to="/tools"
              className="mt-4 inline-flex items-center gap-2 rounded-[2px] border-2 border-foreground bg-card px-4 py-2 text-sm font-medium text-foreground shadow-[var(--shadow-brutal-sm)] transition-[transform,box-shadow,background-color] hover:bg-muted active:translate-x-[2px] active:translate-y-[2px] active:shadow-none sm:mt-0"
            >
              Browse all tools <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURED_TOOLS.map((t) => {
              const isWrite = t.type === "write";
              return (
                <Link
                  key={t.name}
                  to="/tools/$category/$toolSlug"
                  params={{ category: categorySlug(t.category), toolSlug: t.slug }}
                  className="group relative block overflow-hidden rounded-[2px] border-2 border-foreground bg-card p-4 shadow-[var(--shadow-brutal-sm)] transition-transform duration-150 ease-out hover:-translate-y-0.5 hover:shadow-[var(--shadow-brutal-lg)]"
                >
                  <span
                    aria-hidden
                    className="absolute left-0 top-0 h-full w-1 bg-[var(--celo-yellow)] opacity-0 transition-opacity group-hover:opacity-100"
                  />
                  <div className="flex items-center justify-between gap-2">
                    <code className="truncate font-mono text-sm font-semibold text-foreground group-hover:underline">
                      {t.name}
                    </code>
                    <span
                      className={`shrink-0 rounded-[2px] border-2 border-foreground px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] ${
                        isWrite
                          ? "bg-[var(--celo-yellow)] text-[var(--celo-ink)]"
                          : "bg-[var(--celo-forest)] text-[var(--celo-yellow)] dark:bg-[var(--celo-yellow)]/15 dark:text-[var(--celo-yellow)]"
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
        <div className="relative overflow-hidden rounded-[2px] border-2 border-[var(--celo-cream)] bg-[var(--celo-ink)] p-8 text-[var(--celo-cream)] shadow-[6px_6px_0_0_var(--celo-yellow)] sm:p-12 lg:p-16">
          <div className="relative">
            <span className="rounded-[2px] border-2 border-[var(--celo-cream)] px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-[var(--celo-cream)]">
              Ship it
            </span>
            <h2
              className="mt-5 max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Give your agent a wallet.{" "}
              <span className="text-[var(--celo-yellow)]">Say hi to Celina.</span>
            </h2>
            <p className="mt-4 max-w-xl text-base text-[var(--celo-cream)]/75 sm:text-lg">
              Open source. MIT licensed. One SDK catalog — ship with MCP, remote HTTP, or your own
              browser agent.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/mcp"
                className="inline-flex items-center gap-2 rounded-[2px] border-2 border-[var(--celo-cream)] bg-[var(--celo-yellow)] px-6 py-3.5 text-sm font-bold text-[var(--celo-ink)] shadow-[4px_4px_0_0_var(--celo-cream)] transition-[transform,box-shadow] hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              >
                <FontAwesomeIcon icon={faWandMagicSparkles} className="h-4 w-4" /> Connect via MCP
              </Link>
              <a
                href={MCP_NPM_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-[2px] border-2 border-[var(--celo-cream)] px-6 py-3.5 text-sm font-semibold text-[var(--celo-cream)] shadow-[4px_4px_0_0_var(--celo-cream)] transition-[transform,box-shadow,background-color] hover:bg-[var(--celo-cream)]/10 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              >
                <FontAwesomeIcon icon={faNpm} className="h-4 w-4" /> Install from npm
              </a>
            </div>

            <div className="mt-10 flex items-center gap-3 border-t-2 border-[var(--celo-cream)]/25 pt-6 text-[10px] uppercase tracking-[0.28em] text-[var(--celo-cream)]/60">
              <span>Powered by</span>
              <img src="/celo-wordmark-yellow.svg" alt="Celo" className="h-3.5 w-auto opacity-95" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-foreground">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            Built by{" "}
            <a
              className="font-medium text-foreground hover:underline"
              href="https://www.npmjs.com/~andrewkimjoseph"
              target="_blank"
              rel="noreferrer"
            >
              @andrewkimjoseph
            </a>{" "}
            · MIT
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link to="/about" className="hover:text-foreground">
              About
            </Link>
            <Link to="/mcp" className="hover:text-foreground">
              MCP
            </Link>
            <Link to="/stats" className="hover:text-foreground">
              Stats
            </Link>
            <a
              href={MCP_NPM_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-foreground"
            >
              <FontAwesomeIcon icon={faNpm} className="h-4 w-4" /> npm
            </a>
            <a
              href="https://modelcontextprotocol.io/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-foreground"
            >
              <FontAwesomeIcon icon={faGithub} className="h-4 w-4" /> MCP spec
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
