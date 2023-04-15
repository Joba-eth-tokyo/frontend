import { ConnectKitProvider } from 'connectkit';
import type { ReactNode } from 'react';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { goerli, mainnet, polygon, polygonMumbai } from 'wagmi/chains';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { publicProvider } from 'wagmi/providers/public';

const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, goerli, polygon, polygonMumbai],
  [
    publicProvider(),
    // infuraProvider({ apiKey: `${process.env.NEXT_PUBLIC_INFURA_API_KEY}` }),
  ]
);

const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    // new WalletConnectConnector({
    //   chains,
    //   options: {
    //     projectId: `${process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID}`,
    //   },
    // }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'wagmi',
      },
    }),
  ],
  provider,
  webSocketProvider,
});

// Pass client to React Context Provider
const WagmiProvider = ({ children }: { children: ReactNode }) => {
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider theme="auto" mode="light">
        {children}
      </ConnectKitProvider>
    </WagmiConfig>
  );
};

export default WagmiProvider;
