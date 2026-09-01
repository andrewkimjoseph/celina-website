import { createFileRoute } from "@tanstack/react-router";
import { ToolsKindHub } from "@/components/tools/kind-hub";
import { READ_TOOL_COUNT } from "@/data/tools";

export const Route = createFileRoute("/tools/read")({
  head: () => ({
    meta: [
      { title: "Read tools — Celina" },
      {
        name: "description",
        content: `Celina read tools on Celo mainnet — chain state and quotes, no keys. ${READ_TOOL_COUNT} operations.`,
      },
    ],
  }),
  component: ReadToolsPage,
});

function ReadToolsPage() {
  return (
    <ToolsKindHub
      kind="read"
      title="Read"
      description="Chain state, quotes, and lookups. No keys."
    />
  );
}
