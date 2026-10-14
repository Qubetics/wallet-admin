import React, { useEffect, useRef, useState } from 'react';
import { Button, Spin, Input, Space, Tag } from 'antd';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction, Connection, SendTransactionError } from '@solana/web3.js';
import { Buffer } from 'buffer';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Program, AnchorProvider } from '@project-serum/anchor';
import * as yup from 'yup';
import {
  useLazyActionGetSolTokenQuery,
  useSaveTokenReferralAccountMutation,
} from '../../../../../Redux/services/TransactionsDetail/TransactionsDetailApiSlice';
import { CONFIG } from '../../../../../common/constant/constant';
import { PROGRAM_ID, RPC_URL, ReferralAccount } from '../../constant';
import { IDL } from '../../idl';
import { setToast } from '../../../../../Redux/slice/toastSlice';
import { useDispatch } from 'react-redux';
import {
  getReferralTokenAccountPubKey,
  initializeReferralTokenAccount,
} from '../../referral';
import not_image_available from '../../../../../Images/not_image_available.jpg';
import AddedTokenList from './addedTokenList';

const network = RPC_URL;
const opts = { preflightCommitment: 'processed' };

const schema = yup
  .object({
    solToken: yup
      .array()
      .min(1, 'At least one item must be selected')
      .required('Required'),
  })
  .required();

export default function SelectTokenComponent() {
  const childRef = useRef();
  const [count, setCount] = useState(0);
  const { publicKey, wallet, connected } = useWallet();
  const connection = new Connection(network, opts.preflightCommitment);
  window.Buffer = Buffer;
  const dispatch = useDispatch();

  const [options, setOptions] = useState([]);
  const [allOptions, setAllOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [getSolToken, { isLoading }] = useLazyActionGetSolTokenQuery();

  const [saveTokenReferralAccount, { isLoading: saveAccountLoading }] =
    useSaveTokenReferralAccountMutation();

  const nonNullable = (value) => {
    return value !== null && value !== undefined;
  };

  useEffect(() => {
    solTokens();
  }, []);
  useEffect(() => { }, [JSON.stringify(options)]);

  const solTokens = async () => {
    let token = await getSolToken();
    let resp = token?.data?.data?.data || [];

    const newOptions = [];
    if (Array.isArray(resp)) {
      resp.map((itm) => {
        if (itm?.is_token_allow_swap == '1') {
          let symbol = itm?.coin_symbol;
          let icon = itm?.coin_image
            ? CONFIG.IMAGE_URL + itm?.coin_image
            : not_image_available;
          let coinName = itm?.coin_name;
          let token_address = itm?.token_address;
          newOptions.push({
            id: 1,
            text: 'Item 1',
            iconSymbol: symbol,
            iconName: coinName,
            token_address,
            icon: icon,
            isTicked: false,
            value: JSON.stringify({
              id: itm?.id,
              token_address: itm?.token_address,
            }),
          });
        }
      });
    }
    setOptions(newOptions);
    setAllOptions(newOptions);
  };

  const createReferralTokenAccounts = async (
    selectedToken,
    referrerPubKey
  ) => {
    const provider = new AnchorProvider(
      connection,
      {},
      opts.preflightCommitment
    );
    const program = new Program(IDL, PROGRAM_ID, provider);
    let referralTokenAccounts = await Promise.all(
      selectedToken
        .map((token) => {
          return initializeReferralTokenAccount({
            mint: new PublicKey(token),
            payerPubKey: publicKey,
            referralAccountPubKey: referrerPubKey,
            connection: connection,
            program: program,
          });
        })
        .filter(nonNullable)
    );
    let instructions = referralTokenAccounts.flatMap(({ tx }) => {
      return tx.instructions;
    });

    let tx = referralTokenAccounts[0].tx;
    tx.instructions = instructions;

    return { tx, referralTokenAccounts };
  };
  const { reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    let jupiter_fee_address_list = [];
    const provider = new AnchorProvider(
      connection,
      {},
      opts.preflightCommitment
    );
    const program = new Program(IDL, PROGRAM_ID, provider);
    const referrerPubKey = new PublicKey(ReferralAccount);
    let hashTokens = [];

    for (let i = 0; i < data?.solToken.length; i++) {
      let tokenData = JSON.parse(data?.solToken[i].value);
      let mint = new PublicKey(tokenData.token_address);
      const referralTokenAccountPubKey = await getReferralTokenAccountPubKey({
        referralAccountPubKey: referrerPubKey,
        mint,
        program,
      });
      let exist = await connection.getAccountInfo(referralTokenAccountPubKey);
      if (exist) {
        jupiter_fee_address_list.push({
          token_address: tokenData.token_address,
          jupiter_fee_address: referralTokenAccountPubKey.toBase58(),
        });
      } else {
        hashTokens.push(tokenData.token_address);
      }
    }

    try {
      if (Array.isArray(hashTokens)) {
        if (hashTokens?.length > 0) {
          const referrerPubKey = new PublicKey(ReferralAccount);
          const { tx, referralTokenAccounts } =
            await createReferralTokenAccounts(hashTokens, referrerPubKey);
          referralTokenAccounts.map((itx, idx) => {
            jupiter_fee_address_list.push({
              token_address: itx.token,
              jupiter_fee_address: itx.key.toBase58(),
            });
          });
          const transaction = new Transaction().add(tx);
          transaction.feePayer = publicKey;
          await connection.getLatestBlockhash();
          let txid = await wallet.adapter.sendTransaction(
            transaction,
            connection,
            {
              skipPreflight: true,
            }
          );
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
            } else if (value !== null && !value.meta.err) {
              break;
            }
            await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait before retrying
          }

        }
        saveTokenReferralAccount({ jupiter_fee_address_list }).then(
          (res, err) => {
            setLoading(false);
            if (res?.data?.data?.status) {
              setCount(0);
              solTokens();
              if (childRef.current) {
                childRef.current.childMethod();
              }
              reset();
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
          }
        );
      }
    } catch (error) {
      setLoading(false);
      if (error.message.includes('block height exceeded')) {
        console.error(`createReferralTokenAmount>>>.`, error);
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
        console.error(`createReferralTokenAmount Error confirming transaction`, error);
        dispatch(
          setToast({
            message: `Transaction Failed`,
            status: false,
          })
        );
        return true;
      }
    }
  };
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

  const handleItemClick = (itm) => {
    let optionCopy = [...options];
    let allOptionCopy = [...allOptions];

    optionCopy.map((dataItem, idx) => {
      if (dataItem.iconName == itm.iconName) {
        dataItem['isTicked'] = !dataItem?.isTicked;
      }
    });

    let result = allOptionCopy.reduce(function (acc, obj) {
      return acc + +obj?.isTicked;
    }, 0);

    setCount(result);
    setOptions(optionCopy);
    setAllOptions(allOptionCopy);
  };

  const filterOption = (val) => {
    let optionCopy = [...allOptions];
    let filterOption = optionCopy.filter((data) => {
      if (val == '') {
        return true;
      }
      return (
        data.iconName.toLowerCase().includes(val.toLowerCase()) ||
        data.iconSymbol.toLowerCase().includes(val.toLowerCase()) ||
        data?.token_address.toLowerCase().includes(val.toLowerCase())
      );
    });
    setOptions(filterOption);
  };

  const itemSubmit = () => {
    let selected = allOptions.filter((itm) => itm?.isTicked);
    let payload = { solToken: selected };
    if (!connected) {
      dispatch(
        setToast({
          message: `Connect wallet.`,
          status: false,
        })
      );
    }

    onSubmit(payload);
  };

  return (
    <div>
      <div className="listing">
        <Spin spinning={isLoading || loading} size="large">
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}
          >
            <div>
              <div className="">
                <h2>Referral Token Accounts</h2>
                <p style={{ color: 'black' }}>
                  Select new token accounts that you would like to create:
                </p>
                <div
                  className="customcheckSelect"
                  style={{ textAlign: 'right' }}
                >
                  <Input
                    required={true}
                    type="text"
                    size="large"
                    placeholder="Token Address an symbol"
                    style={{ width: '100%', maxWidth: '600px' }}
                    onChange={(event) => filterOption(event.target.value)}
                  />
                  <ul>
                    {options.map((item, idx) => (
                      <li
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                        key={idx}
                        onClick={() => handleItemClick(item)}
                      >
                        <span>
                          <Space gap="middle">
                            {item.icon ? (
                              <img
                                style={{ borderRadius: '50%' }}
                                width={20}
                                height={20}
                                src={item.icon}
                                alt="icon"
                              />
                            ) : (
                              <p>{item.iconName}</p>
                            )}
                            <span style={{ color: 'black', fontWeight: '600' }}>
                              {item.iconName}
                            </span>

                            <Tag
                              style={{
                                backgroundColor: 'rgba(54, 124, 199,.1) ',
                                border: 'unset',
                                padding: '2px 5px',
                                color: 'grey',
                                fontSize: '10px',
                                textTransform: 'uppercase',
                              }}
                              color="default"
                            >
                              {item.token_address}
                            </Tag>
                          </Space>
                        </span>
                        {item.isTicked && (
                          <span style={{ color: 'black' }}>&#10003;</span>
                        )}
                      </li>
                    ))}
                    {options.length == 0 && (
                      <li className="no_data"> No Data</li>
                    )}
                  </ul>
                </div>
                <div
                  className="submit toekStyleBtns"
                  style={{ textAlign: 'right' }}
                >
                  <p style={{ color: 'black' }}>{count} selected</p>
                  <Button
                    disabled={count == 0}
                    onClick={() => {
                      itemSubmit();
                    }}
                  >
                    Create
                  </Button>
                </div>

              </div>
              <div></div>
            </div>
            <div className="list">
              <AddedTokenList ref={childRef} />
            </div>
          </div>
        </Spin>
      </div>
    </div>
  );
}
