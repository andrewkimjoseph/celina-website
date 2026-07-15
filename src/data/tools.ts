import { GENERATED_HOSTED_TOOL_COUNT, GENERATED_TOOLS } from "./tools.generated.js";
import { TOOL_OVERRIDES } from "./tools.overrides.js";
import type { ToolAvailability, ToolDoc } from "./tools.types.js";

function mergeTool(
  base: Omit<ToolDoc, "returns">,
  override: (typeof TOOL_OVERRIDES)[string] | undefined,
): ToolDoc {
  return {
    ...base,
    ...override,
    description: override?.description ?? base.description,
    summary: override?.summary ?? base.summary,
    inputs: override?.inputs ?? base.inputs,
    returns: override?.returns ?? "{ … }",
    examples: override?.examples,
    availability: override?.availability,
  };
}

export type { ToolAvailability, ToolDoc, ToolField, ToolKind } from "./tools.types.js";

export const TOOLS: ToolDoc[] = GENERATED_TOOLS.map((base) =>
  mergeTool(base, TOOL_OVERRIDES[base.name]),
);

export const TOOLS_BY_NAME: Record<string, ToolDoc> = Object.fromEntries(
  TOOLS.map((tool) => [tool.name, tool]),
);

export function categorySlug(category: ToolDoc["category"]): string {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const CATEGORY_SLUGS = Array.from(
  new Set(TOOLS.map((t) => categorySlug(t.category))),
);

export const CATEGORY_BY_SLUG: Record<string, ToolDoc["category"]> =
  Object.fromEntries(TOOLS.map((t) => [categorySlug(t.category), t.category]));

export function findTool(catSlug: string, toolSlug: string): ToolDoc | undefined {
  return TOOLS.find(
    (t) => categorySlug(t.category) === catSlug && t.slug === toolSlug,
  );
}

/** Hosted endpoint tool count — derived from SDK catalog filter profile. */
export const HOSTED_TOOL_COUNT = GENERATED_HOSTED_TOOL_COUNT;

const STDIO_ONLY_TOOLS = new Set([
  "send_token",
  "execute_mento_fx",
  "execute_uniswap_swap",
  "supply_aave",
  "withdraw_aave",
  "claim_daily_gooddollar_ubi",
  "execute_gooddollar_reserve_swap",
  "execute_contract_function",
  "get_wallet_address",
  "get_self_identity",
  "sign_self_request",
  "authenticated_self_fetch",
  "refresh_self_proof",
  "deregister_self_agent",
  "register_self_agent",
  "check_self_registration",
]);

export function getToolAvailability(tool: ToolDoc): ToolAvailability {
  if (tool.availability) return tool.availability;
  if (tool.name.startsWith("estimate_")) return "stdio";
  if (STDIO_ONLY_TOOLS.has(tool.name)) return "stdio";
  return "both";
}

export function availabilityLabel(availability: ToolAvailability): string {
  switch (availability) {
    case "both":
      return "Hosted · Stdio";
    case "hosted":
      return "Hosted only";
    case "stdio":
      return "Stdio only";
  }
}
