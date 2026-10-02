import { createFileRoute } from "@tanstack/react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare, faSignal } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { PageHero, PageHeroSection } from "@/components/marketing/page-hero";
import { SiteHeader } from "@/components/site-header";

const STATUS_URL = "https://status.usecelina.xyz";
const STATUS_GITHUB_URL = "https://github.com/andrewkimjoseph/celina-status";

export const Route = createFileRoute("/status")({
  head: () => ({
    meta: [
      { title: "Celina Status — uptime and usage" },
      {
        name: "description",
        content:
          "Live health, 30-day uptime, and usage stats for the Celina stack — MCP, API, bot, website, Celeste, and Chat.",
      },
    ],
  }),
  component: StatusPage,
});

function StatusPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <PageHeroSection>
        <PageHero
          icon={faSignal}
          badge="Uptime and usage"
          title="Status"
          crumbs={[{ label: "Celina", to: "/" }, { label: "Status" }]}
          description="Live health for the hosted stack, 30-day uptime, and on-chain, off-chain, and download stats."
        >
          <div className="flex flex-wrap gap-3">
            <a
              href={STATUS_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-[2px] border-2 border-foreground bg-[var(--celo-yellow)] px-5 py-3 text-sm font-semibold text-[var(--celo-ink)] shadow-[var(--shadow-brutal)] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[var(--shadow-brutal-lg)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            >
              Open status
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="h-3 w-3" />
            </a>
            <a
              href={STATUS_GITHUB_URL}
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
            The live dashboard is at{" "}
            <a
              href={STATUS_URL}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-foreground underline decoration-[var(--celo-yellow)] decoration-2 underline-offset-4"
            >
              status.usecelina.xyz
            </a>
            . It checks MCP Remote, the API, the bot, the stats API, this website, Celeste AI, Celina Chat, and the status page itself.
          </p>
        </article>
      </section>
    </main>
  );
}
