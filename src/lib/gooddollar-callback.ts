function decodeBase64(value: string): string {
  if (typeof atob === "function") {
    try {
      return atob(value);
    } catch {
      // fall through to Buffer in Node / test environments
    }
  }
  return Buffer.from(value, "base64").toString("utf8");
}

export function decodeCallbackParam(raw: string | null): string | null {
  if (!raw) return null;
  const urlDecoded = decodeURIComponent(raw);
  try {
    const decoded = decodeBase64(urlDecoded);
    if (/^[\x20-\x7E]+$/.test(decoded)) {
      return decoded;
    }
    return urlDecoded;
  } catch {
    return urlDecoded;
  }
}

export type GoodDollarCallbackResult = {
  verified: boolean | null;
  chain: string | null;
  reason: string | null;
  raw: {
    verified: string | null;
    chain: string | null;
    isVerified: string | null;
    reason: string | null;
  };
};

export function parseGoodDollarCallbackSearch(search: string): GoodDollarCallbackResult {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const rawVerified = params.get("verified");
  const rawChain = params.get("chain");
  const rawIsVerified = params.get("isVerified");
  const rawReason = params.get("reason");

  const decodedVerified = decodeCallbackParam(rawVerified);
  const decodedChain = decodeCallbackParam(rawChain);

  let verified: boolean | null = null;
  if (decodedVerified === "true" || decodedVerified === "false") {
    verified = decodedVerified === "true";
  } else if (rawIsVerified != null) {
    verified = rawIsVerified.toLowerCase() === "true";
  }

  const chain = decodedChain ?? rawChain;
  const reason = rawReason ?? null;

  return {
    verified,
    chain,
    reason,
    raw: {
      verified: rawVerified,
      chain: rawChain,
      isVerified: rawIsVerified,
      reason: rawReason,
    },
  };
}
