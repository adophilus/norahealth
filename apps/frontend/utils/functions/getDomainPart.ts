import type { NextRequest } from "next/server";

type Req = Request | NextRequest;

export function getPlainDomain(domain: string): string {
  try {
    // Remove protocol if somehow present
    domain = domain.replace(/^https?:\/\//, "").split("/")[0];

    // Handle localhost or IPs
    if (domain === "localhost" || /^\d{1,3}(\.\d{1,3}){3}$/.test(domain)) {
      return domain;
    }

    // Split into parts
    const parts = domain.split(".").filter(Boolean);

    // For common cases like www.nora-health.xyz → nora-health.xyz
    if (parts.length > 2) {
      // Handle ccTLDs like .co.uk or .com.ng properly
      const last = parts[parts.length - 1];
      const secondLast = parts[parts.length - 2];

      // Known compound TLDs
      const compoundTLDs = ["co.uk", "com.ng", "com.au", "com.br"];

      const tld = `${secondLast}.${last}`;
      if (compoundTLDs.includes(tld) && parts.length > 3) {
        return parts.slice(-3).join(".");
      }

      // Default: return last two parts
      return parts.slice(-2).join(".");
    }

    return domain;
  } catch {
    return domain;
  }
}

export default function getDomainParts(req?: Req) {
  let origin = "";
  let host = "";

  if (typeof window !== "undefined") {
    // Browser
    origin = window.location.origin;
    host = window.location.host;
  } else if (req) {
    // NextRequest (Edge / Middleware)
    if ("nextUrl" in req) {
      origin = req.nextUrl.origin;
      host = req.nextUrl.host;
    } else {
      // Standard Request (like in App Router or NextAuth in edge runtime)
      const url = new URL(req.url);
      origin = url.origin;
      host = url.host;
    }
  } else if (process.env.NEXT_PUBLIC_URL) {
    // Fallback to env
    const url = new URL(process.env.NEXT_PUBLIC_URL);
    origin = url.origin;
    host = url.host;
  }

  const planeHost = getPlainDomain(host);

  return { origin, host, planeHost };
}
