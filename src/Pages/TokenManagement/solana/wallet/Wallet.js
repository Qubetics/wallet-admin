

import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';

const Wallet = () => {
  const { connected, disconnect } = useWallet();

  // Define your options array without the "Change Wallet" option

  return (
    <WalletMultiButton
    //   "copy-address": "Copy address",
    //   copied: "Copied",
    //   disconnect: "Disconnect",
    //   "has-wallet": "Connect",
    //   "no-wallet": "Select Wallet",
    >
      {connected ? 'Disconnect Wallet' : 'Connect Wallet'}
    </WalletMultiButton>
  );
};

export default Wallet;
