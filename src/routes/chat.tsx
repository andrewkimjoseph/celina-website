import { createFileRoute, Link } from "@tanstack/react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faCode,
  faCoins,
  faComments,
  faImage,
  faLandmark,
  faPaperPlane,
  faRightLeft,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { PageHero, PageHeroSection } from "@/components/marketing/page-hero";
import { SiteHeader } from "@/components/site-header";

const CHAT_URL = "https://chat.usecelina.xyz";
const CHAT_GITHUB_URL = "https://github.com/andrewkimjoseph/celina-chat";

const CAPABILITIES = [
  {
    icon: faPaperPlane,
    title: "Send",
    body: "Transfer CELO, stablecoins, and GoodDollar to any address or ENS name.",
  },
  {
    icon: faRightLeft,
    title: "Swap",
    body: "Mento FX oracle-priced swaps and Uniswap v4 AMM routes.",
  },
  {
    icon: faLandmark,
    title: "Govern",
    body: "Lock CELO, upvote queued proposals, and vote in Referendum.",
  },
  {
    icon: faCoins,
    title: "Stake",
    body: "Delegate to validator groups, activate pending stakes, and unstake.",
  },
  {
    icon: faImage,
    title: "NFTs",
    body: "View ERC-721 and ERC-1155 balances and token metadata.",
  },
  {
    icon: faCode,
    title: "Contracts",
    body: "Read contract state and estimate gas for arbitrary calls.",
  },
];

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Celina Chat — full-catalog wallet chat" },
      {
        name: "description",
        content:
          "Celina Chat is the full-catalog browser chat for Celo mainnet. Send, swap, govern, and stake — you sign in your wallet.",
      },
    ],
  }),
  component: ChatPage,
});

function ChatPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <PageHeroSection>
        <PageHero
          icon={faComments}
          badge="Wallet chat"
          title="Celina Chat"
          wide
          crumbs={[{ label: "Celina", to: "/" }, { label: "Chat" }]}
          description="Every browser-surface SDK tool in one chat — sends, swaps, governance, staking, NFTs, and contract calls. You sign in your wallet."
        >
          <div className="flex flex-wrap gap-3">
            <a
              href={CHAT_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-[2px] border-2 border-foreground bg-[var(--celo-yellow)] px-5 py-3 text-sm font-semibold text-[var(--celo-ink)] shadow-[var(--shadow-brutal)] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[var(--shadow-brutal-lg)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            >
              Open chat
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="h-3 w-3" />
            </a>
            <a
              href={CHAT_GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-[2px] border-2 border-foreground bg-card px-5 py-3 text-sm font-semibold text-foreground shadow-[var(--shadow-brutal-sm)] transition-[transform,box-shadow,background-color] hover:bg-muted active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            >
              <FontAwesomeIcon icon={faGithub} className="h-4 w-4" />
              GitHub
            </a>
          </div>
        </PageHero>
      </PageHeroSection>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
          Celina Chat runs at{" "}
          <a
            href={CHAT_URL}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-foreground underline decoration-[var(--celo-yellow)] decoration-2 underline-offset-4"
          >
            chat.usecelina.xyz
          </a>
          . Keys stay in your browser wallet — the site never holds a private key. For read-only
          balances, quotes, and governance in Telegram, use the{" "}
          <Link
            to="/bot"
            className="font-medium text-foreground underline decoration-[var(--celo-yellow)] decoration-2 underline-offset-4"
          >
            Celina bot
          </Link>
          .
        </p>

        <h2
          className="mb-5 mt-10 text-2xl font-bold tracking-tight sm:text-3xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          What you can do
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((item) => (
            <div
              key={item.title}
              className="rounded-[2px] border-2 border-foreground bg-card p-6 shadow-[var(--shadow-brutal)]"
            >
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-[2px] border-2 border-foreground bg-[var(--celo-yellow)] text-[var(--celo-ink)]">
                <FontAwesomeIcon icon={item.icon} className="h-4 w-4" />
              </div>
              <h3
                className="mt-4 text-lg font-semibold tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {item.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
