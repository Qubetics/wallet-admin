import React from 'react';
import WalletConnect from '../solana/walletConnector';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import SelectTokenComponent from './ui/ReferralTokens/selecttoken';

export default function IndexSolana() {
  const navigate = useNavigate();

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

      {}
    </div>
  );
}
