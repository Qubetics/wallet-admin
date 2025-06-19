import React, { useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction, Connection } from "@solana/web3.js";
import { Buffer } from "buffer";
import { initializeReferralTokenAccount } from "../referral";
import { RPC_URL } from "../constant";
import { setToast } from "../../../../Redux/slice/toastSlice";
import { useDispatch } from "react-redux";
import { Program, AnchorProvider } from "@project-serum/anchor";
import { PROGRAM_ID, ReferralAccount } from "../constant";
import { IDL } from "../idl";
import { Button } from "antd";

const network = RPC_URL;
const opts = { preflightCommitment: "processed" };

const Referral = ({ data, setLoading, saveTokenReferralAccount }) => {
  const dispatch = useDispatch();

  const { publicKey, sendTransaction, wallet, connected } = useWallet();

  const connection = new Connection(network, opts.preflightCommitment);
  window.Buffer = Buffer;
  // Handle referral
  const handleReferral = useCallback(
    async (token_address, id) => {
      const provider = new AnchorProvider(
        connection,
        {},
        opts.preflightCommitment
      );
      const program = new Program(IDL, PROGRAM_ID, provider);
      setLoading(true);
      if (!connected) {
        dispatch(
          setToast({
            message: `Please connect the wallet`,
            status: false,
          })
        );
        setLoading(false);
        return;
      }
      if (!publicKey || !ReferralAccount) {
        console.error("Public key or referrer is missing");
        dispatch(
          setToast({
            message: `Please connect the wallet`,
            status: false,
          })
        );
        setLoading(false);
        return;
      }

      try {
        const referrerPubKey = new PublicKey(ReferralAccount);
        const mint = new PublicKey(token_address);
        console.log("token_address by:", token_address);
        console.log("Referred by:", referrerPubKey.toBase58());
        console.log("Referred user:", publicKey.toBase58());
        const { tx, referralTokenAccountPubKey } =
          await initializeReferralTokenAccount({
            payerPubKey: publicKey,
            referralAccountPubKey: referrerPubKey, // Referral Key. You can create this with createReferralAccount.ts.
            mint: mint,
            connection: connection,
            // provider: provider,
            program: program,
          });

        const referralTokenAccount = await connection.getAccountInfo(
          referralTokenAccountPubKey
        );
        const transaction = new Transaction().add(tx);
        transaction.feePayer = publicKey;
        console.log("referralTokenAccount >>>", referralTokenAccount);

        if (!referralTokenAccount) {
          const { blockhash, lastValidBlockHeight } =
            await connection.getLatestBlockhash();
          let txid = await wallet.adapter.sendTransaction(
            transaction,
            connection,
            {
              skipPreflight: true,
            }
          );

          const { value } = await connection.confirmTransaction({
            signature: txid,
            blockhash,
            lastValidBlockHeight,
          });

          if (value.err) {
            console.log({ value, txid });
            dispatch(
              setToast({
                message: `Transaction Failed`,
                status: false,
              })
            );
            return false;
          }

          let disableValue = {
            id,
            jupiter_fee_address: referralTokenAccountPubKey.toBase58(),
          };
          saveTokenReferralAccount(disableValue).then((res, err) => {
            setLoading(false);
            if (res?.data?.data?.status) {
              dispatch(
                setToast({
                  message: `Transaction Success`,
                  status: true,
                })
              );
            } else {
              dispatch(
                setToast({
                  message: `${res?.error?.data?.message}`,
                  status: false,
                })
              );
            }
          });
        } else {
          let disableValue = {
            id,
            jupiter_fee_address: referralTokenAccountPubKey.toBase58(),
          };
          saveTokenReferralAccount(disableValue).then((res, err) => {
            setLoading(false);
            if (res?.data?.data?.status) {
              dispatch(
                setToast({
                  message: `Solana token fee account already exists`, // ${referralTokenAccountPubKey.toBase58()} for mint ${mint.toBase58()} already exists`,
                  status: false,
                })
              );
            } else {
              setLoading(false);
              dispatch(
                setToast({
                  message: `${res?.error?.data?.message}`,
                  status: false,
                })
              );
            }
          });
        }
      } catch (error) {
        console.error("Referral failed", error);
        setLoading(false);
        dispatch(
          setToast({
            message: `Transaction failed`,
            status: false,
          })
        );
      }
    },
    [publicKey, ReferralAccount, sendTransaction]
  );

  return (
    <div>
      <Button
        disabled={
          data?.coin_family !== 4 ||
          data?.is_token_allow_swap == "0" ||
          data?.jupiter_fee_address !== null
        }
        className="btn mr10"
        type="primary"
        onClick={(e) => {
          handleReferral(data?.token_address, data?.id);
        }}
      >
        Add Token Account
      </Button>
    </div>
  );
};

export default Referral;
