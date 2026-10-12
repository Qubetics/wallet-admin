import { Spin, Table, Input, Button, Modal } from 'antd';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { useReferralFeeSetTokenListMutation, useSavedTokenListReferralAccountMutation } from '../../../../../Redux/services/TransactionsDetail/TransactionsDetailApiSlice';
import { useWallet } from '@solana/wallet-adapter-react';
import { CONFIG } from '../../../../../common/constant/constant';
import not_image_available from '../../../../../Images/not_image_available.jpg';
import { ReferralTokens } from '../ReferralRevenue/useReferralTokens';
import { Program, AnchorProvider } from '@project-serum/anchor';
import { PROGRAM_ID, RPC_URL, ReferralAccount } from '../../constant';
import { IDL } from '../../idl';
import { Connection, PublicKey, SendTransactionError } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { formatNumberCrypto, formatNumberUSD } from '../../../../../Helper/FormatNumber';
import { claim, claimPartially } from "../../referral";
import { ExclamationCircleFilled } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { setToast } from '../../../../../Redux/slice/toastSlice';

const AddedTokenList = forwardRef((props, ref) => {
  const permission_type = sessionStorage.getItem("permission_type");
  const [page, setPage] = useState(1);
  const [allLimit] = useState(1500);
  const [tokenRecrods, settTokenRecrods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [disabledButton, setDisabledButton] = useState(false);
  const dispatch = useDispatch();
  const { publicKey, wallet, connected, signAllTransactions } = useWallet();

  const network = RPC_URL;
  const opts = { preflightCommitment: 'processed' };
  const connection = new Connection(network, opts.preflightCommitment);
  const networkTatum = process.env.REACT_APP_TATUM_URL;

  const connectionTatum = new Connection(networkTatum, opts.preflightCommitment);
  const provider = new AnchorProvider(connection, {}, opts.preflightCommitment);
  const program = new Program(IDL, PROGRAM_ID, provider);

  const [savedTokenListReferral, { data: tokenList, isLoading }] =
    useSavedTokenListReferralAccountMutation();
  const [referralFeeSetTokenList] = useReferralFeeSetTokenListMutation();

  useImperativeHandle(ref, () => ({
    childMethod() {
      getList(search);
    },
  }));

  useEffect(() => {
    getList(search);
  }, [page]);

  const tokens = React.useMemo(() => {
    return [
      ...(tokenList?.data?.data || []),
    ].map((a) => a?.token_address);
  }, [tokenList?.data?.data]);

  useEffect(() => {
    if (tokens.length > 0) {
      getRefferralAmount(tokens)
    } else {
      settTokenRecrods([])
    }
  }, [tokens]);

  const nonNullable = (value) => {
    return value !== null && value !== undefined;
  };

  const getRefferralAmount = async (tokens) => {
    try {
      if (tokens) {
        setLoading(true)
        const referralTokens = await ReferralTokens(
          program,
          tokens,
          ReferralAccount,
          connection,
        );
        const { tokenAccounts, token2022Accounts, tokensPrices
        } = referralTokens;
        const referralData = tokenAccounts
          .concat(token2022Accounts)
          .map(({ account, pubkey }) => {
            let mint = account.mint.toBase58();
            let tokenPrice = tokensPrices[mint]

            const amount = account.amount.toString();
            let price = tokenPrice?.price ? tokenPrice?.price : 0;
            return {
              mint,
              price,
              amount,
              address: pubkey.toBase58()
            };
          }).filter(nonNullable);
        let tokenData = tokenList?.data?.data.map((data) => {
          let referralRecord = referralData?.filter((referral) => referral?.mint == data?.token_address)[0];
          let amount_in_crypto = new BigNumber(referralRecord?.amount).dividedBy(data?.decimals);
          let amount_in_fiat = new BigNumber(amount_in_crypto).mul(referralRecord?.price ? referralRecord?.price : 0);
          let dataCopy = { ...data }

          dataCopy['amount_in_crypto'] = amount_in_crypto;
          dataCopy['amount_in_fiat'] = amount_in_fiat;
          dataCopy["price"] = new BigNumber(referralRecord?.price ? referralRecord?.price : 0).toFixed();
          return dataCopy
        });
        setLoading(false)
        settTokenRecrods(tokenData)
      }
    } catch (e) {
      setLoading(false)
    }
  };

  const getList = async (search) => {
    try {
      let payload = {
        page,
        limit: allLimit
      };
      if (search !== '') {
        payload.search = search;
      }
      savedTokenListReferral(payload);
    } catch (error) {
    }

  };

  const claimTokenReferralAmount = async (token_address) => {
    try {
      if (!connected) {
        dispatch(
          setToast({
            message: `Wallet not connected.`,
            status: false,
          })
        );
        return false
      }
      setLoading(true)
      const mint = new PublicKey(token_address);
      const tx = await claim(mint, publicKey, ReferralAccount, program, connection);
      let txid = await wallet.adapter.sendTransaction(
        tx,
        connection,
        {
          skipPreflight: false,
        }
      );

      // Confirm the transaction with retries
      //         signature,
      //         blockhash,
      //         lastValidBlockHeight,

      let retries = 5;
      while (retries > 0) {
        let value = await connection.getTransaction(txid, {
          commitment: "confirmed",
          maxSupportedTransactionVersion: 0,
        });
        retries--;
        if (value !== null && value?.meta?.err) {
          setLoading(false);
          dispatch(
            setToast({
              message: `Transaction Failed`,
              status: false,
            })
          );
          return false;
        } else if (value !== null && !value?.meta?.err) {
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait before retrying
      }

      dispatch(
        setToast({
          message: `Transaction Success`,
          status: true,
        })
      );
      getList(search);
      setLoading(false)
      return true
    } catch (error) {
      setLoading(false)
      if (error.message.includes('block height exceeded')) {
        getList(search);
        console.error(`claimTokenReferralAmount>>>.`, error);
        dispatch(
          setToast({
            message: `Transaction Success`,
            status: true,
          })
        );
        return true
      } else if (error.message.includes('insufficient lamports')) {
        if (error instanceof SendTransactionError) {
          let errorRes = await handleSendTransactionError(error);
          let requiredBal = errorRes.requiredLamports / 1000000000;
          let availableBal = errorRes.availableLamports / 1000000000;
          let message = `Insufficient Solana: ${availableBal} SOL available, ${requiredBal} SOL needed.`;
          dispatch(
            setToast({
              message: message,
              status: false,
            })
          );
          return true
        }

      } else if (error.message.includes('User rejected the request')) {
        dispatch(
          setToast({
            message: `User rejected the request`,
            status: false,
          })
        );
        return true
      } else {
        console.error(`claimTokenReferralAmount Error confirming transaction`, error);
        dispatch(
          setToast({
            message: `Transaction Failed`,
            status: false,
          })
        );
        return true;
      }

    }
  }

  const claimAllTokenReferralAmount = async () => {
    try {
      if (!connected) {
        dispatch(
          setToast({
            message: `Wallet not connected.`,
            status: false,
          })
        );
        return false
      }
      if (!wallet || !publicKey || !wallet.adapter) {
        dispatch(
          setToast({
            message: `Wallet not connected.`,
            status: false,
          })
        );
        return false
      }
      setLoading(true)
      let tokenList = await referralFeeSetTokenList();
      let tokens = tokenList?.data?.data?.data || [];
      const referralTokens = await ReferralTokens(
        program,
        tokens,
        ReferralAccount,
        connection,
      );
      const { tokenAccounts, token2022Accounts, tokensPrices
      } = referralTokens;
      let i = 0;
      const referralWithdrawFeeAddress = tokenAccounts
        .concat(token2022Accounts)
        .map(({ account, pubkey }) => {
          let mint = account.mint.toBase58();
          let tokenDetail = tokens?.filter((referral) => referral?.token_address == mint)[0];
          let tokenPrice = tokensPrices[mint]
          const amount = account.amount.toString();
          const price = tokenPrice?.price ? tokenPrice?.price : 0;
          const amount_in_crypto = new BigNumber(amount).dividedBy(tokenDetail?.decimals);
          const amount_in_fiat = new BigNumber(amount_in_crypto).mul(price);

          if (new BigNumber(amount_in_fiat).gt(new BigNumber(0))) {
            i++;
            return pubkey
          }

        }).filter(nonNullable);
      if (referralWithdrawFeeAddress.length > 0) {
        const txsCompiled = await claimPartially(publicKey, ReferralAccount, referralWithdrawFeeAddress, program, connectionTatum);

        if (!signAllTransactions) {
          dispatch(
            setToast({
              message: `Wallet does not support signAllTransactions.`,
              status: false,
            })
          );
          return;
        }

        const { blockhash, lastValidBlockHeight } =
          await connectionTatum.getLatestBlockhash("confirmed");

        txsCompiled.forEach((tx) => {
          if ("version" in tx) {
            tx.message.recentBlockhash = blockhash;
          } else {
            tx.recentBlockhash = blockhash;
            tx.feePayer = publicKey;
          }
        });
        let txs = await signAllTransactions(txsCompiled);
        let errorTxids = [];
        let successTxids = [];
        let errorMsg = [];
        await Promise.all(
          txs.map(async (tx) => {
            try {
              let rawTx = Buffer.from(tx.serialize());
              let txid = await connectionTatum.sendRawTransaction(rawTx, {
                skipPreflight: false
              });

              let retries = 5;
              while (retries > 0) {
                let value = await connection.getTransaction(txid, {
                  commitment: "confirmed",
                  maxSupportedTransactionVersion: 0,
                });
                retries--;
                if (value !== null && value?.meta?.err) {
                  errorTxids.push(txid);
                  break;
                } else if (value !== null && !value?.meta?.err) {
                  successTxids.push(txid);
                  break;
                }
                await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait before retrying
              }

            } catch (error) {
              if (error.message.includes('insufficient lamports')) {
                if (error instanceof SendTransactionError) {
                  let errorRes = await handleSendTransactionError(error);
                  let requiredBal = errorRes.requiredLamports / 1000000000;
                  let availableBal = errorRes.availableLamports / 1000000000;
                  let message = `Insufficient Solana: ${availableBal} SOL available, ${requiredBal} SOL needed.`;
                  errorMsg.push(message)
                }

              } else if (error.message.includes('block height exceeded')) {
                errorMsg.push(`block height exceeded`)
              }
            }

          }),
        );
        if (errorTxids.length > 0 && txs.length > 1) {
          dispatch(
            setToast({
              message: `Transaction Success`,
              status: true,
            })
          );
          getList(search);
          setLoading(false)
          return true
        } else if (successTxids.length == 0 && errorMsg.length > 0) {
          if (errorMsg.filter((msg => msg.includes("block height exceeded"))).length > 0) {
            dispatch(
              setToast({
                message: `Transaction Success`,
                status: true,
              })
            );
            getList(search);
            setLoading(false)
            return true
          } else {
            dispatch(
              setToast({
                message: errorMsg[0],
                status: false,
              })
            );
            setLoading(false)
            return true
          }
        } else {
          dispatch(
            setToast({
              message: `Transaction Success`,
              status: true,
            })
          );
          getList(search);
          setLoading(false)
          return true
        }
      } else {
        dispatch(
          setToast({
            message: `All referral tokens have already been claimed. There are currently no referral tokens available for claim.`,
            status: false,
          })
        );
        setLoading(false)
        return;
      }
    } catch (error) {
      setLoading(false)
      if (error.message.includes('User rejected the request')) {
        dispatch(
          setToast({
            message: `User rejected the request`,
            status: false,
          })
        );
        return true
      }
      //       message: `Insufficient lamports for transaction. Please fund the account.`,
      //       status: false,
      else {
        dispatch(
          setToast({
            message: `Transaction Failed`,
            status: false,
          })
        );
        return true
      }
    }

  }

  const handleSendTransactionError = async (error) => {
    const { logs } = error;
    return await parseInsufficientLamportsError(logs);
  };
  const parseInsufficientLamportsError = async (logs) => {
    // Find the log entry related to insufficient lamports
    const insufficientLamportsMessage = logs.find(log => log.includes("insufficient lamports"));

    if (!insufficientLamportsMessage) {
      return null; // No insufficient lamports message found
    }

    // Extract the amount from the message
    const amountMatch = insufficientLamportsMessage.match(/insufficient lamports (\d+), need (\d+)/);

    if (!amountMatch) {
      return null; // Unable to parse the amount
    }

    const availableLamports = parseInt(amountMatch[1], 10);
    const requiredLamports = parseInt(amountMatch[2], 10);

    return { availableLamports, requiredLamports };
  }

  const columns = [
    {
      title: 'S.No.',
      // dataIndex:data.index,
      // key: data.index,
      render: (item, record, index) => (
        <>{page > 1 ? (page - 1) * 10 + index + 1 : index + 1}</>
      ),
    },

    {
      title: 'Coin Symbol',
      dataIndex: 'coin_symbol',
      // key: "coin_data",
      render: (text, record) => (
        <div style={{ gap: '10px' }}>
          <img
            style={{ height: '35px' }}
            src={
              record?.coin_image !== null
                ? `${CONFIG.IMAGE_URL}${record?.coin_image}`
                : not_image_available
            }
          />
          <span style={{ textTransform: 'uppercase' }}>
            {' '}
            {record?.coin_symbol}
          </span>
        </div>
      ),
    },
    {
      title: 'Token Names',
      dataIndex: 'coin_data',
      // key: "coin_data",
      render: (text, recrod) => <div>{recrod?.coin_name}</div>,
    },
    {
      title: 'Token Address',
      dataIndex: 'token_address',
    },
    {
      title: 'Received Amount (In Crypto)',
      dataIndex: 'amount_in_crypto',
      // defaultSortOrder: 'descend',
      render: (text, record) => (<div>{formatNumberCrypto(record.amount_in_crypto.toFixed())}</div>),
    },
    {
      title: 'Current Market Price',
      dataIndex: 'price',
      render: (text, record) => (<div>${record?.price}</div>),
    },
    {
      title: 'Received Amount (In Fiat)',
      dataIndex: 'amount_in_fiat',
      sorter: (a, b) => a.amount_in_fiat - b.amount_in_fiat,
      defaultSortOrder: 'descend',
      render: (text, record) => <div>${formatNumberUSD(record?.amount_in_fiat.toFixed())}</div>,
    }
  ];
  permission_type && permission_type == "2" && (
    columns.push({
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button
          className="btn"
          type="primary"
          disabled={record?.amount_in_fiat?.toFixed() > 0 && permission_type && permission_type == "2" ? false : true}
          onClick={(e) => {
            Modal.confirm({
              title: "Do you want to claim this token referral amount?",
              icon: <ExclamationCircleFilled />,
              centered: true,
              okText: "Claim",
              onOk() {
                claimTokenReferralAmount(record.token_address).then((res, err) => {
                });
              },
              onCancel() {
              },
            });
          }}
        >
          Claim
        </Button>
      ),
    })
  )
  return (
    <Spin spinning={isLoading || loading} size="large">
      <div className="send-usdt-panel-bg">
        <div className="topper">
          <h2>My Token Accounts</h2>
          <div
            className="form-group searchBox"
          >
            <Input
              type="text"
              title="Search by token name/ symbol/ address"
              placeholder="Search by token name/ symbol/ address"
              className="form-control"
              maxLength={100}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value.trimStart());
              }}
              onKeyDown={async (e) => {
                if (e.key === "Enter") {
                  setPage(1);
                  await getList(search);
                }
              }}
            />
          </div>
          <div className="searchInput">
            <Button
              className="btn"
              type="primary"
              disabled={disabledButton}
              onClick={async () => {
                setPage(1);
                await getList(search);
              }}
            >
              Search
            </Button>
            <Button
              className="btn"
              type="primary"
              onClick={async () => {
                setDisabledButton(false);
                setSearch("");
                await getList('');
              }}
            >
              Reset
            </Button>
          </div>
          {permission_type && permission_type == "2" && (
            <Button
              className="btn"
              type="primary"
              onClick={async () => { claimAllTokenReferralAmount() }}
            >
              Claim All
            </Button>
          )}
        </div>
        <Table
          pagination={true}
          dataSource={tokenRecrods}
          columns={columns}
          bordered
          rowKey={(obj) => obj?.id}
        />
      </div>
    </Spin>
  );
});

export default AddedTokenList;
