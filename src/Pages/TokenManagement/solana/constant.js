import { clusterApiUrl, PublicKey } from '@solana/web3.js';

export const PROGRAM_ID = new PublicKey(process.env.REACT_APP_PROGRAM_ID);

export const ReferralAccount = process.env.REACT_APP_REFERRAL_ACC_ID;

export const RPC_URL =
  process.env.REACT_APP_RPC_URL || clusterApiUrl('mainnet-beta');

export const JUPITER_PROJECT = new PublicKey(process.env.REACT_APP_JUPITER_ID);

export const TOKEN_PRICES_KEY = 'token-prices';
