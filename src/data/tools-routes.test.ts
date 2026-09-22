import { describe, expect, it } from "vitest";
import { CATEGORY_BY_SLUG, findToolByName, findToolBySlug } from "./tools";

describe("flat tool URL lookup", () => {
  it("keeps category slugs for category pages", () => {
    expect(CATEGORY_BY_SLUG.gooddollar).toBe("GoodDollar");
    expect(findToolBySlug("gooddollar")).toBeUndefined();
    expect(findToolBySlug("read")).toBeUndefined();
  });

  it("resolves a kebab slug and the snake_case tool name to the same doc", () => {
    const bySlug = findToolBySlug("get-gooddollar-reserve-quote");
    const byName = findToolByName("get_gooddollar_reserve_quote");
    expect(bySlug?.name).toBe("get_gooddollar_reserve_quote");
    expect(byName).toBe(bySlug);
    expect(bySlug?.category).toBe("GoodDollar");
  });

  it("returns nothing for names that are not in the catalog", () => {
    expect(findToolBySlug("not-a-tool")).toBeUndefined();
    expect(findToolByName("not_a_tool")).toBeUndefined();
  });
});
