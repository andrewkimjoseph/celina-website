import { createFileRoute } from "@tanstack/react-router";
import { ToolsKindHub } from "@/components/tools/kind-hub";
import { PREPARE_TOOL_COUNT } from "@/data/tools";

export const Route = createFileRoute("/tools/prepare")({
  head: () => ({
    meta: [
      { title: "Prepare tools — Celina" },
      {
        name: "description",
        content: `Celina prepare tools — unsigned wallet flows for browser/SDK apps (not MCP). ${PREPARE_TOOL_COUNT} operations across Celo mainnet protocols.`,
      },
    ],
  }),
  component: PrepareToolsPage,
});

function PrepareToolsPage() {
  return (
    <ToolsKindHub
      kind="prepare"
      title="Prepare"
      description="Unsigned wallet flows for browser apps (Celeste, wagmi); the user signs. Not on MCP — agents with CELO_PRIVATE_KEY use write/execute instead. Click any tool for its full spec."
    />
  );
}
