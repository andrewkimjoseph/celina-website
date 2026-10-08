import { describe, expect, it } from "vitest";
import { displayProjectId } from "./stats-shared";

describe("displayProjectId", () => {
  it("shows SDK device ids as celina_sdk", () => {
    expect(displayProjectId("celina_sdk")).toBe("celina_sdk");
    expect(displayProjectId("celina-sdk")).toBe("celina_sdk");
  });

  it("passes celina_mcp through", () => {
    expect(displayProjectId("celina_mcp")).toBe("celina_mcp");
  });

  it("still hides g_usdm_quote and collapses MCP install ids", () => {
    expect(displayProjectId("g_usdm_quote")).toBeNull();
    expect(displayProjectId("andrewkimjoseph_celina_mcp_88894827")).toBe("celina_mcp");
  });
});
