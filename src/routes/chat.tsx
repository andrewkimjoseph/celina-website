import { createFileRoute, Link } from "@tanstack/react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare, faComments } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { PageHero, PageHeroSection } from "@/components/marketing/page-hero";
import { SiteHeader } from "@/components/site-header";

const CHAT_URL = "https://chat.usecelina.xyz";
const CHAT_GITHUB_URL = "https://github.com/andrewkimjoseph/celina-chat";

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
        <article className="min-w-0 overflow-hidden rounded-[2px] border-2 border-foreground bg-card p-7 shadow-[var(--shadow-brutal)]">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Celina Chat runs at{" "}
            <a
              href={CHAT_URL}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-foreground underline decoration-[var(--celo-yellow)] decoration-2 underline-offset-4"
            >
              chat.usecelina.xyz
            </a>
            . Keys stay in your browser wallet — the site never holds a private key. For read-only balances, quotes, and governance in Telegram, use the{" "}
            <Link
              to="/bot"
              className="font-medium text-foreground underline decoration-[var(--celo-yellow)] decoration-2 underline-offset-4"
            >
              Celina bot
            </Link>
            .
          </p>
        </article>
      </section>
    </main>
  );
}
