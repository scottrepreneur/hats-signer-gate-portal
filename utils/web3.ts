import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { SUPPORTED_NETWORKS } from "./constants";

const { chains, publicClient, webSocketPublicClient } = configureChains(
	Object.values(SUPPORTED_NETWORKS),
	[publicProvider()],
);

const { connectors } = getDefaultWallets({
	appName: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_NAME || "",
	projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "",
	chains,
});

export const wagmiConfig = createConfig({
	autoConnect: true,
	connectors,
	publicClient,
	webSocketPublicClient,
});

export { chains };
