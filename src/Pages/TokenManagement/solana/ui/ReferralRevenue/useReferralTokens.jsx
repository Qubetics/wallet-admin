// import { useQuery } from '@tanstack/react-query';
// import { ReferralTokenAccountsWithStrategy, getReferralTokenAccountsWithStrategy } from '../../referral';
import { ReferralTokenAccountsWithStrategy } from '../../referral';
// export const useReferralTokens = (program, referralPubkey, connection) =>
//   useQuery({
//     queryKey: ['tokens', referralPubkey.toString()],
//     queryFn: () => {
//       return getReferralTokenAccountsWithStrategy(
//         referralPubkey.toString(),
//         { type: 'token-list', tokenList: 'strict' },
//         program,
//         connection
//       );
//     },
//   });

export const ReferralTokens = async (program, tokens, referralPubkey, connection) => {
  return ReferralTokenAccountsWithStrategy(
    referralPubkey.toString(),
    tokens,
    program,
    connection
  );
}
  // // useQuery({
  // //   queryKey: ['tokens', referralPubkey.toString()],
  // //   queryFn: () => {
  //     return getReferralTokenAccountsWithStrategyNew(
  //       referralPubkey.toString(),
  //       tokens,
  //       program,
  //       connection
  //     );
  //   // },
  // // });