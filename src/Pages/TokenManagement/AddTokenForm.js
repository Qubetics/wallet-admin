import React, { useState, useEffect, useRef } from "react";
import { Input, Button, Spin } from 'antd';
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./TokenManagment.scss";
import { useDispatch, useSelector } from "react-redux";
import eth from "../../Images/eth.png";
import bnb from "../../Images/bnb.png";
import ada from "../../Images/ada.png";
import matic from "../../Images/matic.png";
import tron from "../../Images/Tron.png";
import tics from "../../Images/qubetics.png";

import avax from "../../Images/avax.png";
import sol from "../../Images/solana.png";
import cro from "../../Images/cronos.png";
import pls from "../../Images/pls.png";
import {COIN_FAMILY_TOKEN_TYPE } from "../../common/constant/constant";
import {
  useAddTokenImageMutation,
  useAddTokenMutation,
  useSearchTokenMutation,
  useAssetsByPolicyIdMutation,
} from "../../Redux/services/TokenManagement/TokenManagementApiSlice";
import { encryption } from "../../common/encryption/encryption";
import { setToast } from "../../Redux/slice/toastSlice";
import { setAssetData } from "../../Redux/slice/TokenTableSlice";
import AssetData from "./AssetsData";

yup
  .object({
    TokenName: yup
      .string("Token Name is required")
      .min(2, "Token Name is Too Short!")
      .max(20, "Tokrn Name is Too Long!")
      .required("TokenName is required"),
    TokenSymbol: yup
      .string("Token symbol is required")
      .min(2, "Token symbol is Too Short!")
      .max(20, "Token Name is Too Long!")
      .required(" Token symbol is required"),
    TokenDecimal: yup
      .string()
      .min(2, "Token Decimal is Too Short!")
      .max(50, "Token Decimal is Too Long!")
      .required("Token Decimal is required"),
    files: yup
      .mixed()
      .required("You need to provide an Image File")
      .test("fileSize", "File Size is too large", (value) => {
        return value?.size <= 5242880;
      })
      .test("fileType", "Unsupported File Format", (value) =>
        ["image/jpeg", "image/png", "image/jpg"].includes(value?.type)
      ),
  })
  .required();

  const select_blockchain = [
    { key: "key0", label: "Select any chain", value: 0 },
    {
      key: "key1",
      label: (
        <>
          {" "}
          <span>
            <img src={eth} style={{ width: "20px" }} alt=""></img> ETH
          </span>
        </>
      ),
      value: 2,
    },
    {
      key: "key3",
      label: (
        <>
          {" "}
          <span>
            <img src={bnb} style={{ width: "20px" }} alt=""></img> BNB
          </span>
        </>
      ),
      value: 1,
    },
    {
      key: "key4",
      label: (
        <>
          {" "}
          <span>
            <img src={sol} style={{ width: "20px" }} alt=""></img> SOL
          </span>
        </>
      ),
      value: 5,
    },
    {
      key: "key6",
      label: (
        <>
          {" "}
          <span>
            <img src={matic} style={{ width: "20px" }} alt=""></img> MATIC
          </span>
        </>
      ),
      value: 4,
    },
     {
      key: "key7",
      label: (
        <>
          {" "}
          <span>
            <img src={tron} style={{ width: "20px" }} alt=""></img> TRON
          </span>
        </>
      ),
      value: 6,
    },
    {
      key: "key8",
      label: (
        <>
          {" "}
          <span>
            <img src={tics} style={{ width: "20px" }} alt=""></img> TICS
          </span>
        </>
      ),
      value: 7,
    },
  
  ];

const AddTokenForm = ({ handleAddTokenCancel }) => {
  const ref = useRef();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [, setChecked] = useState(false);
  const [coinFamily, setCoinFamily] = useState(1);
  const [StateCoinName, setStateCoinName] = useState("");
  const [StateCoinSymbol, setStateCoinSymbol] = useState("");
  const [PolicyId] = useState("");
  const [SateCoinDecimal, setSateCoinDecimal] = useState("");
  const [ContractAddress, setContractAddress] = useState("");
  const [ContractError, setContractError] = useState(false);
  const [, {}] = useAddTokenImageMutation();
  const [, {}] = useAssetsByPolicyIdMutation();
  const [seachTokenByAddress, { seachIsLoading }] = useSearchTokenMutation();

  const [, setImageName] = useState("");
  const [addToken, { isLoading }] = useAddTokenMutation();
  const dispatch = useDispatch();

  /** Assets Data */
  const [assetsModalOpen, setAssetsModalOpen] = useState(false);

  const AssetTokenData = useSelector(
    (state) => state?.TokenTableData?.assetData
  );

  const handleAssetsCancel = () => {
    setAssetsModalOpen(false);
    (async () => {
      dispatch(setAssetData([]));
    })();
  };

  useEffect(() => {
    (async () => {
      if (AssetTokenData?.length > 0) {
        setAssetsModalOpen(true);
      }
    })();
  }, [AssetTokenData]);
  useEffect(() => {
    (async () => {
      dispatch(setAssetData([]));
    })();
  }, []);

  useEffect(() => {
    if (ContractAddress !== "") {
      const delayDebounceFn = setTimeout(() => {
        fetchCoinDataAndShow(ContractAddress, coinFamily);
        // Send Axios request here
      }, 1000);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [ContractAddress]);

  const { handleSubmit, reset, control, setValue, trigger, formState: { errors } } = useForm();
  const STATIC_COIN_FAMILY = [
    {
      key: "ETH",
      value: "1",
      label: (
        <>
          {" "}
          <span>
            <img src={eth} style={{ width: "20px" }}></img> ETH
          </span>
        </>
      ),
      regex: /^0x[a-fA-F0-9]{40}$/i,
    },
    {
      key: "BNB",
      value: "3",
      label: (
        <>
          {" "}
          <span>
            <img src={bnb} style={{ width: "20px" }}></img> BNB
          </span>
        </>
      ),
      regex: /^0x[a-fA-F0-9]{40}$/i,
    },
    {
      key: "SOL",
      value: "4",
      label: (
        <>
          {" "}
          <span>
            <img src={sol} style={{ width: "20px" }}></img> SOL
          </span>
        </>
      ),
      regex: /^([A-Za-z0-9]){44}$/,
    },
    {
      key: "ADA",
      value: "5",
      label: (
        <>
          {" "}
          <span>
            <img src={ada} style={{ width: "20px" }}></img> ADA
          </span>
        </>
      ),
      regex: /^([A-Za-z0-9]){59}$/,
    },
    {
      key: "MATIC",
      value: "6",
      label: (
        <>
          {" "}
          <span>
            <img src={matic} style={{ width: "20px" }}></img> MATIC
          </span>
        </>
      ),
      regex: /^0x[a-fA-F0-9]{40}$/i,
    },
    {
      key: "AVAX",
      value: "7",
      label: (
        <>
          {" "}
          <span>
            <img src={avax} style={{ width: "20px" }}></img> AVAX
          </span>
        </>
      ),
      regex: /^0x[a-fA-F0-9]{40}$/i,
    },
    {
      key: "CRO",
      value: "8",
      label: (
        <>
          {" "}
          <span>
            <img src={cro} style={{ width: "20px" }}></img> CRO
          </span>
        </>
      ),
      regex: /^0x[a-fA-F0-9]{40}$/i,
    },

    {
      key: "PLS",
      value: "9",
      label: (
        <>
          {" "}
          <span>
            <img src={pls} style={{ width: "20px" }}></img> PLS
          </span>
        </>
      ),
      regex: /^0x[a-fA-F0-9]{40}$/i,
    },
  ];

  const fetchCoinDataAndShow = async (tokenAddress, myCoinFamily) => {
    try {
      setConfirmLoading(true);
      const enc = await encryption(JSON.stringify({
        tokenAddress: tokenAddress,
        coinFamily: myCoinFamily,
      }));
      const securedData = { dataString: enc };
      await seachTokenByAddress(securedData).then((res) => {
        if (res.error) {
          if (res?.error?.status == "FETCH_ERROR") {
            dispatch(setToast({ message: "Network failed", status: false }));
            setConfirmLoading(false);
          } else {
            if (res?.error?.data?.message) {
              dispatch(
                setToast({ message: res?.error?.data?.message, status: false })
              );
              setConfirmLoading(false);
            } else {
              dispatch(
                setToast({ message: "Something went wrong.", status: false })
              );
              setConfirmLoading(false);
            }
          }
        } else {
          if (res?.data?.status === true) {
            // Changed condition to check status
            const coin = res?.data?.data; // Direct access to data
            setStateCoinName(coin.name);
            setStateCoinSymbol(coin.symbol !== "" ? coin.symbol : "N/A");
            setSateCoinDecimal(coin.decimals);
            setConfirmLoading(false);
          } else {
            setConfirmLoading(false);
            dispatch(
              setToast({
                message: `${res?.error?.data?.message}`,
                status: false,
              })
            );

          }
        }
      });
    } catch (error) {
      setConfirmLoading(false);
      dispatch(
        setToast({
          message:
            typeof error?.response?.data?.message === "object"
              ? "Please enter valid contract address"
              : error?.response?.data?.message,
        })
      );
    }
  };

  const onFormSubmit = async (data) => {
    try {
      setConfirmLoading(true);
      const mapping = COIN_FAMILY_TOKEN_TYPE.find(item => item.coin_family === parseInt(coinFamily));
      
      const submittedData = {
        coin_family: parseInt(coinFamily),
        token_address: data?.ContractAddress || ContractAddress,
        name: data?.TokenName || StateCoinName,
        decimals: data?.TokenDecimal?.toString() || SateCoinDecimal.toString(),
        symbol: data?.TokenSymbol || StateCoinSymbol,
        token_type: mapping?.token_type,
      };
      const enc = await encryption(JSON.stringify(submittedData));
      const securedData = { dataString: enc };
      const response = await addToken(securedData);

      if ('error' in response) {
        handleError(response.error);
        return;
      }

      if (response?.data?.data) {
        dispatch(setToast({ 
          message: response.data.data.message || 'Token added successfully', 
          status: true 
        }));
        
        setTimeout(() => {
          handleAddTokenCancel(false, "AddToken");
        }, 1500);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleError = (error) => {
    let errorMessage = 'Something went wrong';

    if (error?.status === "FETCH_ERROR") {
      errorMessage = "Network connection failed";
    } else if (error?.data?.data?.message) {
      errorMessage = error.data.data.message;
    } else if (error?.data?.message) {
      errorMessage = error.data.message;
    }

    dispatch(setToast({ 
      message: errorMessage, 
      status: false 
    }));
  };

  const handleNetworkType = async (value) => {
    if (ref.current) {
      ref.current.value = "";
    }
    setCoinFamily(Number(value.value));
    setContractAddress("");
    setStateCoinName("");
    setStateCoinSymbol("");
    setSateCoinDecimal("");
    setImageName("");
    setChecked(false);
    setContractError(false);
    reset({
      NetworkType: value,
      ContractAddress: "",
      TokenName: "",
      TokenSymbol: "",
      TokenDecimal: "",
      PolicyId: ""
    });
  };

  

  return (
    <div className="main_page_outer">
      <ToastContainer />
      <div>
        <Spin
          spinning={isLoading || confirmLoading}
          className="spininner"
          tip="Loading..."
          size="large"
        >
          <form onSubmit={handleSubmit(onFormSubmit)}>
            <div className="select-Design select-width firstSelect">
              <Controller
                name="NetworkType"
                control={control}
                render={({ field }) => (
                  <Select
                    isSearchable={false}
                    placeholder="Select any chain"
                    options={select_blockchain}
                    className="selectReactCmn"
                    onChange={handleNetworkType}
                    value={coinFamily ? select_blockchain.find(data => data.value === coinFamily.toString()) : ""}
                  />
                )}
              />
            </div>
              <div className="inputLabel">
                <label>Enter Contract Address:</label>

                <Controller
                  name="ContractAddress"
                  control={control}
                  render={({ field: { value } }) => (
                    <Input
                      disabled={!coinFamily}
                      placeholder="Enter Contract Address"
                      onChange={(e) => {
                        setValue("ContractAddress", e.target.value);
                        setContractAddress(e.target.value);
                        trigger("ContractAddress");
                      }}
                      value={value}
                    />
                  )}
                />
                {errors?.ContractAddress?.message && (
                  <div className="errorElement">
                    <p style={{ color: "red" }}>
                      {errors?.ContractAddress?.message}
                    </p>
                  </div>
                )}
              </div>
            <div className="flexedItem">
              <div className="inputLabel addTokenInput">
                <label> Enter Token Name:</label>

                <Controller
                  name="TokenName"
                  control={control}
                  render={({ field: { value } }) => (
                    <Input
                      placeholder="Enter Token Name"
                      readOnly={true}
                      onChange={(e) => {
                        setValue("TokenName", e.target.value);
                        setStateCoinName(e.target.value);
                        trigger("TokenName");
                      }}
                      value={StateCoinName}
                    />
                  )}
                />
                {errors?.TokenName?.message && (
                  <div className="errorElement">
                    <p style={{ color: "red" }}>{errors?.TokenName?.message}</p>
                  </div>
                )}
                {}
              </div>

              <div className="inputLabel addTokenInput">
                <label>Enter Token Symbol </label>

                <Controller
                  name="TokenSymbol"
                  control={control}
                  render={({ field: { value } }) => (
                    <Input
                      placeholder="Enter Token Symbol"
                      readOnly={true}
                      onChange={(e) => {
                        setStateCoinSymbol(e.target.value);
                        setValue("TokenSymbol", e.target.value);
                        trigger("TokenSymbol");
                        if (errors?.link?.message) {
                          errors.link.message = "";
                        }
                      }}
                      value={StateCoinSymbol}
                    />
                  )}
                />
                {errors?.TokenSymbol?.message && (
                  <div className="errorElement">
                    <p style={{ color: "red" }}>
                      {errors?.TokenSymbol?.message}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="inputLabel addTokenInput">
              <label>Enter Token Decimal:</label>

              <Controller
                name="TokenDecimal"
                control={control}
                render={({ field: { value } }) => (
                  <Input
                    readOnly={true}
                    placeholder="Enter Token Decimal"
                    onChange={(e) => {
                      setSateCoinDecimal(e.target.value);
                      setValue("TokenDecimal", e.target.value);

                      trigger("TokenDecimal");
                      if (errors?.link?.message) {
                        errors.link.message = "";
                      }
                    }}
                    value={SateCoinDecimal}
                  />
                )}
              />
              {errors?.TokenDecimal?.message && (
                <div className="errorElement">
                  <p style={{ color: "red" }}>
                    {errors?.TokenDecimal?.message}
                  </p>
                </div>
              )}
            </div>
           
            <div className="submit_modal">
              <Button
                className=""
                htmlType="submit"
                type="primary"
                disabled={
                  ContractAddress === "" ||
                  !coinFamily ||
                  StateCoinName === "" ||
                  StateCoinSymbol === "" ||
                  SateCoinDecimal === "" ||
                  confirmLoading ||
                  ContractError
                }
              >
                Submit
              </Button>
            </div>
          </form>
        </Spin>
      </div>
      {assetsModalOpen && (
        <AssetData
          assetsModalOpen={assetsModalOpen}
          handleAssetsCancel={handleAssetsCancel}
          assetTokenData={AssetTokenData}
          ContractAddress={ContractAddress}
          setContractAddress={setContractAddress}
        />
      )}
    </div>
  );
};
export default AddTokenForm;
