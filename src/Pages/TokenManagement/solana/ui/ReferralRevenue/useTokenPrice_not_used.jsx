import { useQueryClient, useQueries } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { TOKEN_PRICES_KEY } from '../../constant';
import { Decimal } from 'decimal.js';
import { chunks } from './chunkedGetMultipleAccountInfos';

export const useGetTokenPrices = (mints) => {
  const [, rerender] = useState();
  const queryClient = useQueryClient();

  useEffect(() => {
    const queryCache = queryClient.getQueryCache();

    console.log('queryCache :: ', queryCache);
    const unsubscribe = queryCache.subscribe((event) => {
      if (!event) {
        return;
      }

      const {
        query: { queryKey },
      } = event;

      if (
        queryKey[0] === TOKEN_PRICES_KEY &&
        queryKey.some((key) => mints.includes(key))
      ) {
        rerender({});
      }
    });

    return unsubscribe;
  }, [queryClient, mints]);

  const pricesHash = useMemo(() => {
    try {
      return mints.reduce((acc, mint) => {
        console.log(
          'pricessssss mint>>>>>',
          mint,
          ' TOKEN_PRICES_KEY PKPK : ',
          TOKEN_PRICES_KEY
        );
        const prices = queryClient.getQueryData([TOKEN_PRICES_KEY], {
          exact: false,
          queryKey: [mint],
        });
        console.log('XXXXXXXXXXXXXXXXXXXXXXX >>>>>', prices);
        let reskk = { ...acc, ...(prices || {}) };
        console.log('RESSKKKKKKKKKKKK ', reskk);
        return reskk;
      }, {});
    } catch (e) {
      console.log('EXXXXXXXXXXX ', e);
      return {};
    }
  }, [queryClient, mints]);

  return pricesHash;
};

export const useFetchTokenPrices = (tokenMints) => {
  return useQueries({
    queries: chunks(tokenMints, 100).map((tokens) => {
      // console.log('tokenstokenstokens', tokens);
      return {
        queryKey: [TOKEN_PRICES_KEY, ...tokens],
        queryFn: async () => {
          const response = await fetch(
            `https://price.jup.ag/v4/price?ids=${tokens.join(',')}`
          );
          const data = await response.json();
          return data.data;
        },
      };
    }),
  });
};
// export const useGetTokenPrices = (mints) => {
//     const [_, rerender] = useState({});
//     const queryClient = useQueryClient();

//     useEffect(() => {
//         const queryCache = queryClient.getQueryCache();

//         const unsubscribe = queryCache.subscribe((event) => {
//             if (!event) {
//                 return;
//             }

//             const {
//                 query: { queryKey },
//             } = event;

//             if (
//                 queryKey[0] === TOKEN_PRICES_KEY &&
//                 queryKey.some((key) => mints.includes(key))
//             ) {
//                 rerender({});
//             }
//         });

//         return unsubscribe;
//     }, [queryClient, mints]);

//     const pricesHash = useMemo(() => {
//         return mints.reduce((acc, mint) => {
//             const prices = queryClient.getQueryData(
//                 [TOKEN_PRICES_KEY],
//                 {
//                     exact: false,
//                     queryKey: [mint],
//                 },
//             )
//             return { ...acc, ...(prices || {}) };
//         }, {});
//     }, [queryClient, mints]);

//     return pricesHash;
// };
