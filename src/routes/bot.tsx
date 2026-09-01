import { createFileRoute, Link } from "@tanstack/react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faTelegram } from "@fortawesome/free-brands-svg-icons";
import { PageHero, PageHeroSection } from "@/components/marketing/page-hero";
import { SiteHeader } from "@/components/site-header";
import { BOT_GITHUB_URL, TELEGRAM_BOT_URL } from "@/data/bot";

const COMMANDS: { command: string; does: string }[] = [
  { command: "/start", does: "Welcome + shortcut keyboard" },
  { command: "/tools", does: "Browse tools by category (tap to run or fill params)" },
  { command: "/call <tool> [key=value …] [--human]", does: "Power-user invoke" },
  { command: "/setaddress 0x…", does: "Save a default wallet, or send /setaddress then the address" },
  { command: "/clearaddress", does: "Forget the saved wallet" },
  { command: "/whoami", does: "Show the saved wallet" },
  { command: "/help / /help <tool>", does: "Commands, or one tool's inputs" },
  { command: "/cancel", does: "Abort a param prompt" },
  { command: "/<alias>", does: "Generated short name for each catalog tool (e.g. /network, /balance)" },
];

export const Route = createFileRoute("/bot")({
  head: () => ({
    meta: [
      { title: "Celina bot — Telegram on Celo" },
      {
        name: "description",
        content:
          "Read-only Celina Telegram bot on Celo mainnet. Balances, quotes, and governance via the Celina API — no keys, no signing.",
      },
    ],
  }),
  component: BotPage,
});

function BotPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <PageHeroSection>
        <PageHero
          icon={faTelegram}
          badge="Telegram · Read-only"
          title="Celina bot"
          crumbs={[{ label: "Celina", to: "/" }, { label: "Bot" }]}
          description="Read-only Celo mainnet tools — balances, quotes, governance — in Telegram. Talks to the Celina API. No keys, no signing."
        >
          <div className="flex flex-wrap gap-3">
            <a
              href={TELEGRAM_BOT_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-[2px] border-2 border-foreground bg-[var(--celo-yellow)] px-5 py-3 text-sm font-semibold text-[var(--celo-ink)] shadow-[var(--shadow-brutal)] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[var(--shadow-brutal-lg)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            >
              <FontAwesomeIcon icon={faTelegram} className="h-4 w-4" />
              Open in Telegram
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="h-3 w-3" />
            </a>
            <a
              href={BOT_GITHUB_URL}
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
            Message{" "}
            <a
              href={TELEGRAM_BOT_URL}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-foreground underline decoration-[var(--celo-yellow)] decoration-2 underline-offset-4"
            >
              @thecelinabot
            </a>{" "}
            for the same public read catalog as the{" "}
            <Link
              to="/api"
              className="font-medium text-foreground underline decoration-[var(--celo-yellow)] decoration-2 underline-offset-4"
            >
              Celina API
            </Link>
            . Shortcut keyboard after <code className="rounded-[2px] bg-secondary px-1 py-0.5 text-sm">/start</code>:
            Tools, Balance, Gov, Network.
          </p>

          <h2
            className="mt-8 text-lg font-semibold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Commands
          </h2>
          <div className="mt-4 overflow-hidden rounded-[2px] border-2 border-foreground">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-foreground bg-muted/40 text-left">
                  <th className="px-4 py-3 font-semibold text-foreground">Command</th>
                  <th className="px-4 py-3 font-semibold text-foreground">What it does</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-foreground/20">
                {COMMANDS.map((row) => (
                  <tr key={row.command}>
                    <td className="px-4 py-3 font-mono text-foreground">{row.command}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.does}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-5 text-sm text-muted-foreground">
            Successful tool replies are pretty JSON by default. Add{" "}
            <code className="rounded-[2px] bg-secondary px-1 py-0.5 text-sm">--human</code> (or{" "}
            <code className="rounded-[2px] bg-secondary px-1 py-0.5 text-sm">human=1</code>) for labeled chat
            text. Browse the same schemas on the{" "}
            <Link
              to="/tools"
              className="text-foreground underline decoration-[var(--celo-yellow)] decoration-2 underline-offset-4"
            >
              tools page
            </Link>
            .
          </p>
        </article>
      </section>
    </main>
  );
}
