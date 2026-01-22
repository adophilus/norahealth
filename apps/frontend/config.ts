// @noErrors: 2554
import { createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { coinbaseWallet } from "wagmi/connectors";
import { farcasterMiniApp as miniAppConnector } from "@farcaster/miniapp-wagmi-connector";

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    // coinbaseWallet({
    //   appName: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || "MiniKit",
    // }),
    miniAppConnector(),
  ],
  ssr: true,
  transports: {
    [base.id]: http(),
  },
});
