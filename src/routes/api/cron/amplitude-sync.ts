import { createFileRoute } from "@tanstack/react-router";
import { syncAmplitudeExport } from "@/lib/amplitude.functions";

function verifyCronAuth(request: Request): Response | null {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return Response.json({ error: "Missing CRON_SECRET" }, { status: 500 });
  }
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export const Route = createFileRoute("/api/cron/amplitude-sync")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const denied = verifyCronAuth(request);
        if (denied) return denied;

        const t0 = Date.now();
        try {
          await syncAmplitudeExport();
          const durationMs = Date.now() - t0;
          return Response.json({ ok: true, durationMs });
        } catch (e) {
          const message = e instanceof Error ? e.message : "Amplitude sync failed";
          return Response.json({ ok: false, error: message }, { status: 500 });
        }
      },
    },
  },
  component: () => null,
});
