import { ReferralTokenAccountsWithStrategy } from '../../referral';

export const ReferralTokens = async (program, tokens, referralPubkey, connection) => {
  return ReferralTokenAccountsWithStrategy(
    referralPubkey.toString(),
    tokens,
    program,
    connection
  );
}
