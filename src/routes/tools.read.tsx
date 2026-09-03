import { createFileRoute } from "@tanstack/react-router";
import { ToolsKindHub } from "@/components/tools/kind-hub";
import { READ_TOOL_COUNT } from "@/data/tools";

export const Route = createFileRoute("/tools/read")({
  head: () => ({
    meta: [
      { title: "Read tools — Celina" },
      {
        name: "description",
        content: `Celina read tools on Celo mainnet — chain state, quotes, and lookups with no keys. ${READ_TOOL_COUNT} operations across Mento FX, GoodDollar, Uniswap v4, Aave, and governance.`,
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
      description="Chain state, quotes, and lookups with no keys — available on hosted MCP and full stdio. Browse balances, governance, Mento FX, GoodDollar, Uniswap v4, Aave, and more. Click any tool for its full spec."
    />
  );
}
