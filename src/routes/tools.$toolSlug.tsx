import { createFileRoute, redirect } from "@tanstack/react-router";
import { TOOL_BY_SLUG, categorySlug } from "@/data/tools";

export const Route = createFileRoute("/tools/$toolSlug")({
  beforeLoad: ({ params }) => {
    const tool = TOOL_BY_SLUG[params.toolSlug];
    if (!tool) {
      throw redirect({ to: "/tools" });
    }
    throw redirect({
      to: "/tools/$category/$toolSlug",
      params: { category: categorySlug(tool.category), toolSlug: tool.slug },
    });
  },
});