import { describe, expect, it } from "vitest";
import { decodeCallbackParam, parseGoodDollarCallbackSearch } from "./gooddollar-callback";

describe("gooddollar-callback", () => {
  it("decodes base64 verified and chain params", () => {
    expect(decodeCallbackParam("ZmFsc2U%3D")).toBe("false");
    expect(decodeCallbackParam("NDIyMjA%3D")).toBe("42220");
    expect(decodeCallbackParam("dHJ1ZQ%3D%3D")).toBe("true");
  });

  it("parses GoodDapp-style redirect query", () => {
    const result = parseGoodDollarCallbackSearch(
      "?verified=ZmFsc2U%3D&chain=NDIyMjA%3D",
    );
    expect(result.verified).toBe(false);
    expect(result.chain).toBe("42220");
  });

  it("parses success redirect query", () => {
    const result = parseGoodDollarCallbackSearch(
      "?verified=dHJ1ZQ%3D%3D&chain=NDIyMjA%3D",
    );
    expect(result.verified).toBe(true);
    expect(result.chain).toBe("42220");
  });

  it("falls back to legacy isVerified param", () => {
    const result = parseGoodDollarCallbackSearch("?isVerified=true&reason=ok");
    expect(result.verified).toBe(true);
    expect(result.reason).toBe("ok");
  });
});
