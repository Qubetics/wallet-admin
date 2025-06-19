import React, { useEffect } from 'react';
import WalletConnect from '../solana/walletConnector';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
// import { useWallet } from '@solana/wallet-adapter-react';
import SelectTokenComponent from './ui/ReferralTokens/selecttoken';
// import ReferralRevenuePage from './ui/ReferralRevenue/referralRevenue';

export default function IndexSolana() {
  const navigate = useNavigate();
  // const { publicKey, sendTransaction, wallet, connected } = useWallet();

  // useEffect(() => {
  //   console.log(
  //     'publicKey, sendTransaction, wallet, connected :: ',
  //     publicKey,
  //     sendTransaction,
  //     wallet,
  //     connected
  //   );
  // }, [publicKey, sendTransaction, wallet, connected]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <Button
        style={{ width: '150px' }}
        onClick={() => navigate('/token-management')}
      >
        Back
      </Button>
      <div
        className="connect-wallet"
        style={{ textAlign: 'right', padding: '20px' }}
      >
        <WalletConnect />
      </div>
      <div>
        <SelectTokenComponent />
      </div>

      {/* <div style={{ color: 'black' }}> */}
      {/* PPPPPPPPPPPP -- {connected} -- */}
      {/* {connected && <ReferralRevenuePage />} */}
      {/* <ReferralRevenuePage />
      </div> */}
    </div>
  );
}
