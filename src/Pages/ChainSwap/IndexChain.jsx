import React, { useEffect, useState } from "react";
import { Space, Spin, Button, InputNumber, Input } from "antd";
// import { MoreOutlined } from "@ant-design/icons";
import Card from "antd/lib/card/Card";
import { useLocation, useNavigate } from "react-router-dom";
// import Web3 from "web3";

// import {
//   CAKE_ROUTER_ABI,
//   CAKE_TESTNET_ROUTER,
//   CAKE_MAINNET_ROUTER,
// } from "../web3/pancake.config";
// import {
//   UNI_ROUTER_ABI,
//   UNI_MAINNET_ROUTER,
//   UNI_TESTNET_ROUTER,
// } from "../web3/uniswap.config";
// import Web3 from "web3";
// import web3 from "../web3/metamask";
// import pancakeContract from "../web3/panCake.contract";
// import uniswapContract from "../web3/uniswap.contract";
import {
  useGetMarkupFeesQuery,
  useSetMarkupFeesMutation,
} from "../../Redux/services/ChianSwapServices/ChainSwapApiSlice";
// import Web3Modal from "web3modal";
// import "../web3/metamask";
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
  // const [form] = Form.useForm();
  const ipData = useSelector((state) => state?.userState?.ipData);

  // const [account, setAccount] = useState("");
  // useEffect(() => {
  //   if (window.web3) {
  //     connect();
  //   }
  // }, []);

  // const providerOptions = {};
  // const web3Modal = new Web3Modal({
  //   network: "mainnet", // optional
  //   cacheProvider: true, // optional
  //   providerOptions, // required
  // });

  // async function connect() {
  //   try {
  //     const provider = await web3Modal.connect();
  //     const web3 = new Web3(provider);
  //     const accounts = await web3.eth.getAccounts();
  //     setAccount(accounts[0]);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  // const pancakeContract = new web3.eth.Contract(
  //   CAKE_ROUTER_ABI,
  //   CAKE_TESTNET_ROUTER,
  //   CAKE_MAINNET_ROUTER
  // );
  // const uniswapContract = new web3.eth.Contract(
  //   UNI_ROUTER_ABI,
  //   UNI_MAINNET_ROUTER,
  //   UNI_TESTNET_ROUTER
  // );

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

  // const updateCardOnContract = async (data) => {

  //   let changeFee = await metamask.contract.methods
  //     ?.changeFees(
  //     )
  //     .send(
  //       {
  //         from: metamask?.address[0],
  //       },
  //       (err, res) => {
  //         // console.log("Metamask response ", res);

  //         // console.log("Metamask error ", err);
  //       }
  //     );
  //   // console.log("Smart contract response : ", changeFee);
  //   return changeFee;
  // };

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
    // const regex = /^\d{1,3}(?:\.\d{1,2})?$/;
    // const regex = /([0-9]*[\.|\,]{0,1}[0-9]{0,2})/s;
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

  // const onChange = (value: number) => {
  //   console.log('changed', value);
  // };

  // const connectWallet = async () => {
  //   // Check if MetaMask is installed on user's browser

  //   if(window.ethereum) {
  //   //  await window.ethereum.providers()
  //     const accounts = await window.ethereum.request({ method: 'eth_accounts' });
  //     const chainId = await window.ethereum.request({ method: 'eth_chainId'});
  //     // Check if user is connected to Mainnet
  //     // if(chainId != '0x1') {
  //     //   alert("Please connect to Mainnet");
  //     // } else {
  //     //   let wallet = accounts[0];
  //     //   // setWalletAddress(wallet);
  //     // }
  //   } else {
  //     alert("Please install Mask");
  //   }
  // }
  // async function disconnect() {
  //   const clear = await web3Modal.clearCachedProvider();
  // }

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
          // setTimeout(() => {
          //console.log("res.error.data.message>>>", res);
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

          // dispatch(setTransactionData(res?.data?.data));
          // setSearch(false);
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
    // setPanCakeSwapFees(null);
    // setUniswapFees(null);

    /*
    // connectWallet()
    // connect();
    // let account = await web3.eth.getAccounts();
    // window.addEventListener('load', () => {
    //   alert('inside meta')
    //   // Wait for loading completion to avoid race conditions with web3 injection timing.
    //    if (window.ethereum) {
    //      const web3 = new Web3(window.ethereum);
    //      try {
    //        // Request account access if needed
    //         window.ethereum.enable().then(alert('opopoo'))
    //        // Accounts now exposed
    //        return web3;
    //      } catch (error) {
    //        console.error(error,'==========ero');
    //      }
    //    }
    //    // Legacy dapp browsers...
    //    else if (window.web3) {
    //      // Use MetaMask/Mist's provider.
    //      const web3 = window.web3;
    //      console.log('Injected web3 detected.');
    //      return web3;
    //    }
    //    // Fallback to localhost; use dev console port by default...
    //    else {
    //      const provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545');
    //      const web3 = new Web3(provider);
    //      console.log('No web3 instance injected, using Local web3.');
    //      return web3;
    //    }
    //  });
    // window.web3 = new Web3(window.ethereum)
    // const myAccount = await window.ethereum.request({
    //      method: 'eth_requestAccounts',
    // })
    // console.log(myAccount,'myAccount')

    if (value === "bsc") {
      // let set_fee_pancake = (PanCakeSwapFees / 100) * 10000;
      // pancakeContract.methods
      //   .setFees(set_fee_pancake)
      //   .send({ from: account[0] })
      //   .once("receipt", (receipt) => {
      //     if (receipt?.status) {
            let submittedPancakewapFees = {
              network: value,
              fees: PanCakeSwapFees,
            };
            setMarkupFees(submittedPancakewapFees);
        //   }
        // })
        // .catch((error) => {
        //   console.log("error >>>>>", error);
        // });
    } else {
      // let set_fee_uniswap = (uniswapFees / 100) * 10000;
      // uniswapContract.methods
      //   .setFees(set_fee_uniswap)
      //   .send({ from: account[0] })
      //   .once("receipt", (receipt) => {
      //     if (receipt.status) {
            let submittedUniswapFees = {
              network: value,
              fees: uniswapFees,
            };

            setMarkupFees(submittedUniswapFees);
        //   }
        // })
        // .catch((error) => {
        //   console.log("error >>>>>", error);
        // });
    }
    setPanCakeSwapFees("");
    setUniswapFees("");
    // let isFeeUpdated = await updateCardOnContract(data);
    */
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
                  // defaultValue={UniswapFees}
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
