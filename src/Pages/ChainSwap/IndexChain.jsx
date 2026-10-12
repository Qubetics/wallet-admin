import React, { useEffect, useState } from "react";
import { Space, Spin, Button, Input } from 'antd';
import Card from "antd/lib/card/Card";
import { useLocation, useNavigate } from "react-router-dom";

import {
  useGetMarkupFeesQuery,
  useSetMarkupFeesMutation,
} from "../../Redux/services/ChianSwapServices/ChainSwapApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setToast } from "../../Redux/slice/toastSlice";
import { setKey } from "../../Redux/slice/sidebarSlice";

function IndexChain() {
  const permission_type = sessionStorage.getItem("permission_type");
  const [EthAddress, setEthAddress] = useState("");
  const [BnbAddress, setBnbAddress] = useState("");
  const [PulseAddress, setPulseAddress] = useState("");
  const [solanaAddress, setSolanaAddress] = useState("");

  const [UniswapFees, setUniswapFees] = useState(null);
  const [PanCakeSwapFees, setPanCakeSwapFees] = useState(null);
  const [PulseSwapFees, setPulseSwapFees] = useState(null);
  const [solanaSwapFees, setSolanaSwapFees] = useState(null);
  const location = useLocation();
  const user = useSelector((state) => state?.userState?.user);
  const dispatch = useDispatch();
  const { isLoading: fetchIsLoading, refetch, data } = useGetMarkupFeesQuery();
  const [setMarkupFees, { isLoading }] = useSetMarkupFeesMutation();
  const ipData = useSelector((state) => state?.userState?.ipData);

  useEffect(() => {
    if (UniswapFees !== null || PanCakeSwapFees !== null) {
      refetch();
    }
  }, [UniswapFees, PanCakeSwapFees]);

  useEffect(() => {
    if (data && data?.data && data?.data?.data) {
      for (let fee of data?.data?.data) {
        if (fee?.network === "eth") {
          setUniswapFees(fee.swap_fees);
          setEthAddress(fee?.address);
        }
        if (fee?.network === "bnb") {
          setPanCakeSwapFees(fee.swap_fees);
          setBnbAddress(fee?.address);
        }
        if (fee?.network === "pls") {
          setPulseSwapFees(fee.swap_fees);
          setPulseAddress(fee?.address);
        }
        if (fee?.network === "sol") {
          setSolanaSwapFees(fee.swap_fees);
          setSolanaAddress(fee?.address);
        }
      }
      // { 'uniswap_fee': UniswapFees}
    }
  }, [JSON.stringify(data)]);

  const navigate = useNavigate();

  const handlePanCakeSwapFees = (value) => {
    if (handleDecimalsOnValue(value) && value <= 100) {
      setPanCakeSwapFees(value);
    } else if (value == "" && value <= 100) {
      setPanCakeSwapFees(value);
    }
  };
  const handleUniSwapFees = (value) => {
    if (handleDecimalsOnValue(value) && value <= 100) {
      setUniswapFees(value);
    } else if (value == "" && value <= 100) {
      setUniswapFees(value);
    }
  };
  const handleDecimalsOnValue = (value) => {
    const regex = /^\d{0,3}(?:\.\d{0,2})?$/;
    return regex.test(value);
  };
  const handlePulseSwapFees = (value) => {
    if (handleDecimalsOnValue(value) && value <= 100) {
      setPulseSwapFees(value);
    } else if (value == "" && value <= 100) {
      setPulseSwapFees(value);
    }
  };
  const handleAddress = (value) => {
    setEthAddress(value);
  };

  const handleBnbAddress = (value) => {
    setBnbAddress(value);
  };
  const handlePulseAddress = (value) => {
    setPulseAddress(value);
  };

  //   // Check if MetaMask is installed on user's browser

  //   //  await window.ethereum.providers()
  //     // Check if user is connected to Mainnet
  //     // }

  const onSubmit = async (value) => {
    let fee = UniswapFees;

    let address = EthAddress;
    if (value === "sol") {
      if (solanaSwapFees == "" || solanaSwapFees == null) {
        return dispatch(
          setToast({
            message: "Please enter Solana swap percentage fee",
            status: false,
          })
        );
      }
      if (solanaAddress === "") {
        return dispatch(
          setToast({ message: "Please enter Solana address", status: false })
        );
      }
      if (solanaSwapFees) {
        fee = solanaSwapFees;
      }
      if (solanaAddress !== "") {
        address = solanaAddress;
      }
    } else if (value === "eth") {
      if (fee == "" || fee == null) {
        return dispatch(
          setToast({
            message: "Please enter Ethereum swap percentage fee",
            status: false,
          })
        );
      }

      if (UniswapFees < 0) {
        return dispatch(
          setToast({ message: "Please enter a valid value", status: false })
        );
      }
      if (EthAddress === "") {
        return dispatch(
          setToast({ message: "Please enter a address", status: false })
        );
      }
    } else if (value === "pls") {
      if (PulseSwapFees == "" || PulseSwapFees == null) {
        return dispatch(
          setToast({
            message: "Please enter Pulse chain swap percentage fee",
            status: false,
          })
        );
      }
      if (PulseSwapFees < 0) {
        return dispatch(
          setToast({ message: "Please enter a valid value", status: false })
        );
      }
      if (PulseAddress === "") {
        return dispatch(
          setToast({ message: "Please enter a address", status: false })
        );
      }
      if (PulseSwapFees) {
        fee = PulseSwapFees;
      }
      if (PulseAddress !== "") {
        address = PulseAddress;
      }
    } else {
      if (PanCakeSwapFees == "" || PanCakeSwapFees == null) {
        return dispatch(
          setToast({
            message: "Please enter Binance swap percentage fee",
            status: false,
          })
        );
      }
      if (PanCakeSwapFees < 0) {
        return dispatch(
          setToast({ message: "Please enter a valid value", status: false })
        );
      }

      if (BnbAddress === "") {
        return dispatch(
          setToast({ message: "Please enter a address", status: false })
        );
      }
      if (PanCakeSwapFees) {
        fee = PanCakeSwapFees;
      }
      if (BnbAddress !== "") {
        address = BnbAddress;
      }
    }

    let submittedPancakewapFees = {
      network: value,
      fees: fee,
      address: address,
      ip_address: ipData?.ip,
    };
    setMarkupFees(submittedPancakewapFees).then((res) => {
      if (res.error) {
        if (res?.error?.status === "FETCH_ERROR") {
          dispatch(setToast({ message: "Network failed", status: false }));
        } else {
          if (res?.error?.data?.message) {
            dispatch(
              setToast({ message: res?.error?.data?.message, status: false })
            );
          } else if (res?.error?.data?.data?.message) {
            dispatch(
              setToast({
                message: res?.error?.data?.data?.message,
                status: false,
              })
            );
          } else if (res?.data?.message) {
            dispatch(setToast({ message: res?.data?.message, status: false }));
          } else {
            dispatch(
              setToast({ message: "Something went wrong.", status: false })
            );
          }
        }
      } else {
        if (res?.data) {
          refetch();

          dispatch(
            setToast({ message: `${res?.data?.data?.message}`, status: true })
          );
        } else {
          dispatch(
            setToast({ message: "Something went wrong.", status: false })
          );
        }
      }
    });

  };

  const isExist = () => {
    let status =
      Array.isArray(user?.permissions_data) &&
      user?.permissions_data.some((dt) => {
        return dt?.menu_list_data?.slug == "revenue";
      });
    return status;
  };

  return (
    <div className="main_page_outer chainSwap">
      <Spin
        spinning={isLoading || fetchIsLoading}
        className="spininner"
        tip="Loading..."
        size="large"
      >
        <div>
          {(user?.role_id == "0" || isExist()) && (
            <Button
              className="btn mb30"
              type="primary"
              onClick={() => {
                dispatch(setKey({ key: "swap", value: "Swap" }));
                sessionStorage.setItem("activeKey", "swap");
                sessionStorage.setItem("page_title", "Swap");
                navigate("/swap");
              }}
            >
              Revenue
            </Button>
          )}
        </div>

        <div className="swapCard-Sec">
          {/* <Row gutter={[16, 24]}>
              <Col sm={24} xl={7}>
                {" "} */}
          <Card title="Ethereum">
            <>
              {/* <Space> */}
              <Space direction="vertical" style={{ width: "100%" }}>
                <Space>Fee(%)</Space>
                <Input
                  required={true}
                  type="text"
                  size="large"
                  value={UniswapFees}
                  disabled={
                    permission_type && permission_type == "2" ? false : true
                  }
                  onChange={(e) => handleUniSwapFees(e.target.value)}
                  style={{ width: "100%" }}
                />

                <Space style={{ marginTop: "15px" }}>Address</Space>
                <Input
                  value={EthAddress}
                  defaultValue={EthAddress}
                  disabled={
                    permission_type && permission_type == "2" ? false : true
                  }
                  onChange={(e) => handleAddress(e.target.value)}
                  style={{ width: "100%" }}
                />

                {permission_type && permission_type == "2" && (
                  <button
                    className=" ant-btn-primary paddingBtnStyle"
                    onClick={() => onSubmit("eth")}
                    disabled={UniswapFees === null}
                    //style={{ width: '20%'}}
                  >
                    submit
                  </button>
                )}
              </Space>
            </>
          </Card>
          {/* </Col>
              <Col sm={24} xl={7}> */}{" "}
          <Card
            title="Binance Smart Chain"
            // extra={<button type="primary" onClick={ ()=>{navigate("/revenue")}}
            //   style ={{border:20}}>Revenue</button>}

            // style={{ width: 500 }}
          >
            <>
              <Space direction="vertical" style={{ width: "100%" }}>
                <Space>Fee(%)</Space>
                <Input
                  type="text"
                  size="large"
                  value={PanCakeSwapFees}
                  defaultValue={PanCakeSwapFees}
                  disabled={
                    permission_type && permission_type == "2" ? false : true
                  }
                  onChange={(e) => handlePanCakeSwapFees(e.target.value)}
                  style={{ width: "100%" }}
                />

                <Space style={{ marginTop: "15px" }}>Address</Space>
                <Input
                  type="text"
                  value={BnbAddress}
                  defaultValue={BnbAddress}
                  disabled={
                    permission_type && permission_type == "2" ? false : true
                  }
                  onChange={(e) => handleBnbAddress(e.target.value)}
                  style={{ width: "100%" }}
                />
                {permission_type && permission_type == "2" && (
                  <button
                    className=" ant-btn-primary paddingBtnStyle"
                    onClick={() => onSubmit("bnb")}
                    disabled={PanCakeSwapFees === null}
                    //style={{ width: '20%'}}
                  >
                    submit
                  </button>
                )}
              </Space>
            </>
          </Card>
          {/* </Col>
            </Row> */}
          <Card title="Pulse Chain">
            <>
              <Space direction="vertical" style={{ width: "100%" }}>
                <Space>Fee(%)</Space>
                <Input
                  type="text"
                  size="large"
                  value={PulseSwapFees}
                  defaultValue={PulseSwapFees}
                  disabled={
                    permission_type && permission_type == "2" ? false : true
                  }
                  onChange={(e) => handlePulseSwapFees(e.target.value)}
                  style={{ width: "100%" }}
                />

                <Space style={{ marginTop: "15px" }}>Address</Space>
                <Input
                  value={PulseAddress}
                  defaultValue={PulseAddress}
                  disabled={
                    permission_type && permission_type == "2" ? false : true
                  }
                  onChange={(e) => handlePulseAddress(e.target.value)}
                  style={{ width: "100%" }}
                />
                {permission_type && permission_type == "2" && (
                  <button
                    className=" ant-btn-primary paddingBtnStyle"
                    onClick={() => onSubmit("pls")}
                    disabled={PanCakeSwapFees === null}
                    //style={{ width: '20%'}}
                  >
                    submit
                  </button>
                )}
              </Space>
            </>
          </Card>
          {/* Solana */}
          <Card title="Solana Chain">
            <>
              <Space direction="vertical" style={{ width: "100%" }}>
                <Space>Fee(%)</Space>
                <Input
                  type="text"
                  size="large"
                  value={solanaSwapFees}
                  defaultValue={solanaSwapFees}
                  disabled={
                    permission_type && permission_type == "2" ? false : true
                  }
                  onChange={(e) => {
                    if (
                      /^(0(\.\d{0,2})?|1(\.0{0,2})?)$/.test(e.target.value) ||
                      e.target.value == ""
                    ) {
                      setSolanaSwapFees(e.target.value);
                    }
                  }}
                  style={{ width: "100%" }}
                />

                <Space style={{ marginTop: "15px" }}>Address</Space>
                <Input
                  value={solanaAddress}
                  defaultValue={solanaAddress}
                  disabled={
                    permission_type && permission_type == "2" ? false : true
                  }
                  onChange={(e) => setSolanaAddress(e.target.value)}
                  style={{ width: "100%" }}
                />
                {permission_type && permission_type == "2" && (
                  <button
                    className=" ant-btn-primary paddingBtnStyle"
                    onClick={() => onSubmit("sol")}
                    disabled={solanaSwapFees === null}
                    //style={{ width: '20%'}}
                  >
                    submit
                  </button>
                )}
              </Space>
            </>
          </Card>
        </div>
      </Spin>
    </div>
  );
}

export default IndexChain;
