import { createMiddleware, createStart } from "@tanstack/react-start";
import {
  csrfSymbol,
  isCsrfRequestAllowed,
} from "@tanstack/start-client-core";

import { renderErrorPage } from "./lib/error-page";

// createCsrfMiddleware uses createIsomorphicFn and can be non-callable in Lovable's
// uncompiled SSR dev context; build the same middleware with createMiddleware instead.
const csrfMiddleware = createMiddleware().server(async (ctx) => {
  if (ctx.handlerType !== "serverFn") {
    return ctx.next();
  }

  if (await isCsrfRequestAllowed({ secFetchSite: "same-origin" }, ctx)) {
    return ctx.next();
  }

  return new Response("Forbidden", { status: 403 });
});

if (process.env.NODE_ENV !== "production") {
  Object.defineProperty(csrfMiddleware, csrfSymbol, { value: true });
}

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

export const startInstance = createStart(() => ({
  requestMiddleware: [csrfMiddleware, errorMiddleware],
}));
