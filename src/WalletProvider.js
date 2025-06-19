import React, { useMemo } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import "@solana/wallet-adapter-react-ui/styles.css";
import { clusterApiUrl } from "@solana/web3.js";

const WalletContextProvider = ({ children }) => {
  const network = WalletAdapterNetwork.Mainnet;
  // console.log("children ", children);
  // console.log("NETWORKKKK ", network);
  const endpoint = useMemo(
    () => process.env.REACT_APP_RPC_URL || clusterApiUrl("mainnet-beta"),
    [network]
  );
  // console.log("endpointsss ", endpoint);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], [network]);
  // console.log("walletswallets ", wallets);
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets ? wallets : []} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletContextProvider;
