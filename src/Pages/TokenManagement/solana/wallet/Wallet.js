// import React from "react";
// import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
// import { useWallet } from "@solana/wallet-adapter-react";

// const Wallet = () => {
//   let { connected } = useWallet();
//   return (
//     <>
//       <WalletMultiButton>
//         {connected ? "Disconnect Wallet" : "Connect Wallet"}
//       </WalletMultiButton>
//     </>
//   );
// };

// export default Wallet;

import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';

const Wallet = () => {
  const { connected, connect, disconnect } = useWallet();

  const handleConnect = () => {
    if (connected) {
      disconnect();
    } else {
      connect();
    }
  };

  // Define your options array without the "Change Wallet" option
  const optionsWithoutChangeWallet = [
    {
      label: 'Connect Wallet A',
      onClick: () => console.log('Connect Wallet A'),
    },
    {
      label: 'Connect Wallet B',
      onClick: () => console.log('Connect Wallet B'),
    },
    // Add more options as needed
  ];

  return (
    <WalletMultiButton
    // onClick={handleConnect}
    // options={optionsWithoutChangeWallet}
    // labels={{
    //   "copy-address": "Copy address",
    //   copied: "Copied",
    //   disconnect: "Disconnect",
    //   "has-wallet": "Connect",
    //   "no-wallet": "Select Wallet",
    // }}
    >
      {connected ? 'Disconnect Wallet' : 'Connect Wallet'}
    </WalletMultiButton>
  );
};

export default Wallet;
