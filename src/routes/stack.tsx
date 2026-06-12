import { createFileRoute } from "@tanstack/react-router";
import { faCircleNodes } from "@fortawesome/free-solid-svg-icons";
import { PageHero, PageHeroSection } from "@/components/marketing/page-hero";
import {
  ArchitectureSection,
  StackProductsSection,
} from "@/components/marketing/stack-sections";
import { SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/stack")({
  head: () => ({
    meta: [
      { title: "The Celina stack — SDK, MCP, and browser apps" },
      {
        name: "description",
        content:
          "Architecture and products for the Celina agent stack on Celo mainnet — one shared tool catalog powering celina-sdk, celina-mcp, the hosted endpoint, and browser wallet apps.",
      },
      {
        property: "og:title",
        content: "The Celina stack — SDK, MCP, and browser apps",
      },
      {
        property: "og:description",
        content:
          "Architecture and products for the Celina agent stack on Celo mainnet — one shared tool catalog powering celina-sdk, celina-mcp, the hosted endpoint, and browser wallet apps.",
      },
    ],
  }),
  component: StackPage,
});

function StackPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <PageHeroSection>
        <PageHero
          icon={faCircleNodes}
          badge="Open-source agent stack"
          title="The Celina stack"
          wide
          description={
            <>
              One shared tool catalog on Celo mainnet —{" "}
              <span className="font-medium text-foreground">celina-sdk</span> defines reads,
              wallet flows, and LLM tools;{" "}
              <span className="font-medium text-foreground">celina-mcp</span> and the hosted
              endpoint register them for agents; browser apps filter the same definitions with{" "}
              <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">
                surface: &quot;browser&quot;
              </span>
              .
            </>
          }
        />
      </PageHeroSection>

      <ArchitectureSection />
      <StackProductsSection />
    </main>
  );
}
