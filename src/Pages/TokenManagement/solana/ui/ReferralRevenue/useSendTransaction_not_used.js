import { useCallback } from 'react';
// import { useToast } from '@/components/ui/use-toast';
// import { useConnection, useWallet } from '@/components/wallet-provider';
import { setToast } from '../../../../../Redux/slice/toastSlice';
import { useDispatch } from 'react-redux';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

export const useSendTransaction = () => {
  const { connection } = useConnection();
  const { wallet } = useWallet();
  //   const { toast } = useToast();

  const dispatch = useDispatch();
  const sendTransaction = useCallback(
    async (transaction) => {
      if (!wallet || !wallet.adapter) {
        dispatch(
          setToast({
            message: `Wallet not connected`,
            status: false,
          })
        );

        return;
      }
      //   toast({
      //     title:
      //     description: 'Please review transaction to approve.',
      //   });
      dispatch(
        setToast({
          message: 'Requesting transaction signature...',
          status: false,
        })
      );

      try {
        const { blockhash, lastValidBlockHeight } =
          await connection.getLatestBlockhash();
        let txid = await wallet.adapter.sendTransaction(
          transaction,
          connection,
          {
            skipPreflight: true,
          }
        );

        // toast({
        //   title: 'Awaiting Transaction to be confirmed...',
        // });
        dispatch(
          setToast({
            message: 'Awaiting Transaction to be confirmed...',
            status: true,
          })
        );

        const { value } = await connection.confirmTransaction({
          signature: txid,
          blockhash,
          lastValidBlockHeight,
        });

        if (value.err) {
          console.log({ value, txid });
          throw new Error('Transaction Failed');
        }

        // toast({
        //   title: 'Transaction Success',
        // });
        dispatch(
          setToast({
            message: 'Transaction Success',
            status: true,
          })
        );
      } catch (e) {
        // toast({
        //   title: 'Transaction Failed',
        // });
        dispatch(
          setToast({
            message: 'Transaction Failed',
            status: true,
          })
        );
        throw e;
      }
    },
    [wallet, connection, setToast]
  );

  return sendTransaction;
};
