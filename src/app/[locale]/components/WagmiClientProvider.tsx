"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { polygon } from "viem/chains";
import { injected, walletConnect } from "wagmi/connectors";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a QueryClient instance
const queryClient = new QueryClient();

// Wagmi configuration
const config = createConfig({
  chains: [polygon],
  connectors: [
    injected(),
    walletConnect({ projectId: "YOUR_WALLETCONNECT_PROJECT_ID" }),
  ],
  transports: {
    [polygon.id]: http("https://polygon-rpc.com"),
  },
});

export default function WagmiClientProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>{children}</WagmiProvider>
    </QueryClientProvider>
  );
}
