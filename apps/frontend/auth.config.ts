import Credentials from "next-auth/providers/credentials";
import { createAppClient, viemConnector } from "@farcaster/auth-client";
import type { NextAuthConfig } from "next-auth";
import { loginAuthorizeSchema } from "./features/auth/schemas";
import { getUserByAddress } from "./helpers/read-db";
import { getDomainParts } from "./utils";

const isLocal = process.env.NODE_ENV === "development";

export default {
  providers: [
    Credentials({
      name: "Sign in with farcaster",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
        nonce: {
          label: "Nonce",
          type: "text",
          placeholder: "0x0",
        },
        address: {
          label: "Address",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(authReq, req) {
        try {
          const parsedReq = loginAuthorizeSchema.safeParse(authReq);
          if (!parsedReq.success) return null;

          const { message, signature, nonce, address } = parsedReq.data;

          const user = await getUserByAddress(address);
          if (!user) return null;

          const appClient = createAppClient({
            relay: "https://relay.farcaster.xyz",
            ethereum: viemConnector(),
          });

          const { host: domain } = getDomainParts(req);

          const verifyResponse = await appClient.verifySignInMessage({
            domain: isLocal ? "app.localhost:3000" : domain,
            message,
            signature: signature as `0x${string}`,
            nonce,
          });

          const { success, error } = verifyResponse;

          if (error || !success) {
            console.log("error", error);
            return null;
          }

          return {
            address,
            id: user.id,
            image: user.pfpUrl,
            name: user.username,
          };
        } catch (error) {
          console.log("error", error);

          return null;
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
