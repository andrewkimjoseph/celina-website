import { createFileRoute } from "@tanstack/react-router";
import { ToolsKindHub } from "@/components/tools/kind-hub";
import { WRITE_TOOL_COUNT } from "@/data/tools";

export const Route = createFileRoute("/tools/write")({
  head: () => ({
    meta: [
      { title: "Write tools — Celina" },
      {
        name: "description",
        content: `Celina write tools on Celo mainnet — execute and send with CELO_PRIVATE_KEY on stdio MCP. ${WRITE_TOOL_COUNT} operations.`,
      },
    ],
  }),
  component: WriteToolsPage,
});

function WriteToolsPage() {
  return (
    <ToolsKindHub
      kind="write"
      title="Write"
      description="Execute and send on MCP with CELO_PRIVATE_KEY — server-key writes for sends, swaps, Aave, GoodDollar, governance, and staking. Not for browser wallets; those use prepare tools instead. Click any tool for its full spec."
    />
  );
}
