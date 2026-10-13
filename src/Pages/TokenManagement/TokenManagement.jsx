import React, { useEffect, useState } from "react";

import {
  Spin,
  Table,
  Button,
  Input,
  Modal,
  Image,
  Pagination,
  Switch,
  Dropdown,
  Tooltip,
} from "antd";
import Select from "react-select";
import { useNavigate } from 'react-router-dom';
import { useGetTokenTableDataMutation } from "../../Redux/services/TokenManagement/TokenManagementApiSlice";
import { setTokenTableData } from "../../Redux/slice/TokenTableSlice";

import { useDispatch, useSelector } from "react-redux";

import { ToastContainer } from 'react-toastify';
import AddToken from "./AddToken";

import {
  useActionEnableDisableMutation,
  useSwapActionMutation,
  useTokenShortlistMutation,
  useMakeRemoveDefaultTokenMutation,
  useSaveTokenReferralAccountMutation,
} from "../../Redux/services/TransactionsDetail/TransactionsDetailApiSlice";
import { ExclamationCircleFilled } from "@ant-design/icons";
import UploadTokenModal from "./UploadTokenModal";
import { setToast } from "../../Redux/slice/toastSlice";
import not_image_available from "../../Images/not_image_available.jpg";
import { select_blockchain } from "../../common/constant/constant";
import moment from "moment";
import { CONFIG } from "../../common/constant/constant";
import { getSearchError } from "../../Helper/searchValidation";
import { encryption } from "../../common/encryption/encryption";
import { handleUnauthorizedError } from "../../common/constant/constant";

const { confirm } = Modal;

const TokenManagement = () => {
  const permission_type = sessionStorage.getItem("permission_type");
  const [modal2Open, setModal2Open] = useState(false);
  const [EditModalOpen, setEditModalOpen] = useState(false);
  const [perPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterAddedBy, setFilterAddedBy] = useState("1");
  const [coin_family, setCoinFamily] = useState(0);
  const [disabledButton, setDisabledButton] = useState(false);
  const dispatch = useDispatch();
  const [loading] = useState(false);
  const [getTokenTableData, { isLoading }] = useGetTokenTableDataMutation();
  const [, {}] = useTokenShortlistMutation();
  const [swapAction, {}] = useSwapActionMutation();
  const [ActionEnableDisable, {}] = useActionEnableDisableMutation();
  const [MakeRemoveDefaultToken, {}] = useMakeRemoveDefaultTokenMutation();
  const [, { isLoading: saveAccountLoading }] =
    useSaveTokenReferralAccountMutation();
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [editTokenName, setEditTokenName] = useState("");
  const [editAction, setEditAction] = useState("");
  const [editTokenTitle, setEditTokenTitle] = useState("");
  const [action, SetAction] = useState("");
  const [SearchData, SetSearchData] = useState("");
  const [TokenId, setTokenId] = useState("");
  const [, setSwapChangeLoading] = useState(false);
  const [, setDisableToggleSwap] = useState(true);
  const [enableSearchButton, setEnableSearchButton] = useState(false);
  const IpData = useSelector((state) => state?.userState?.ipData);
  const [tableData, setTableData] = useState([]);
  

  const columns = [
    {
      title: "S.No.",
      // dataIndex:data.index,
      // key: data.index,
      render: (item, record, index) => (
        <>{currentPage > 1 ? (currentPage - 1) * 10 + index + 1 : index + 1}</>
      ),
    },
    {
      title: "Token Name",
      render: (text) => (
        <p>
          {text.coin_name} /{" "}
          <span style={{ fontSize: "10px" }}>
            {renderCointag(text?.token_type, text?.coin_family)}
          </span>
        </p>
      ),
    },
    {
      title: "Token Symbol",
      // render: (text) => (
      render: (text) => (
        <p>
          {text?.coin_symbol === null ? "N/A" : text?.coin_symbol}
        </p>
      ),
    },
    {
      title: "Token Type",
      render: (text) => renderTokenType(text?.token_type, text?.coin_family),
    },
    {
      title: "Image",
      render: (text) =>
        text.coin_image ? (
          <Image
            width={50}
            preview={false}
            src={`${CONFIG.IMAGE_URL}${text?.coin_image}`}
          />
        ) : (
          <Image
            width={50}
            preview={false}
            src={not_image_available}
          />
        ),
    },
    {
      title: "Decimal",

      render: (text) => (
        <p>
          {text?.decimals === null
            ? "N/A"
            : text?.decimals.toString()?.length - 1}
        </p>
      ),
    },

    {
      title: (
        <p style={{ textAlign: "center", marginBottom: "0" }}>
          Contract Address
        </p>
      ),
      render: (text) => (
        <p
          style={
            text?.token_address === null
              ? { textAlign: "center", marginBottom: "0" }
              : {
                  cursor: "pointer",
                  textDecoration: "underline",
                  color: "#367CC7",
                  textAlign: "center",
                  marginBottom: "0",
                }
          }
          onClick={() => {
            if (text?.token_address !== null) {
              redirectToExplorer(text.coin_family, text.token_address);
            }
          }}
        >
          {text?.token_address === null ? "N/A" : text?.token_address}
        </p>
      ),
    },
    {
      title: "Added on ",
      render: (text) => (
        <p>
          {text?.created_at === null
            ? "N/A"
            : moment.utc(text?.created_at).format("MM/DD/YYYY")}
        </p>
      ),
    },
  ];

  const writeColumns = [
    {
      title: "S.No.",
      render: (item, record, index) => (
        <>{currentPage > 1 ? (currentPage - 1) * 10 + index + 1 : index + 1}</>
      ),
    },
    {
      title: "Token Name",
      render: (text) => (
        <p title={`${text.coin_name?.length > 30 ? text.coin_name : ""}`}>
          {text.coin_name?.length > 30
            ? text.coin_name.substr(0, 30) + "..."
            : text.coin_name}{" "}
        </p>
      ),
    },
    {
      title: "Token Symbol",

      render: (text) => (
        <p title={`${text.coin_symbol?.length > 30 ? text.coin_symbol : ""}`}>
          {text?.coin_symbol === null
            ? "N/A"
            : text.coin_symbol?.length > 30
            ? text?.coin_symbol?.substr(0, 30) + ".."
            : text?.coin_symbol}
        </p>
      ),
    },
    {
      title: "Token Type",
      render: (text) => {
        const type = text?.token_type;
        if (type) {
          // TRON types arrive as TRC20 / TRC_20 / TRX20; show them all as TRC20
          return /^TR[CX_]+20$/i.test(type) ? "TRC20" : type;
        }
        return text?.token_address === null ? "Native" : "N/A";
      },
    },
    {
      title: "Image",
      render: (text) =>
        text.coin_image ? (
          <Image
            width={50}
            preview={false}
            src={text?.coin_image}
          />
        ) : (
          <Image
            width={50}
            preview={false}
            src={not_image_available}
          />
        ),
    },
    {
      title: "Decimal",

      render: (text) => (
        <p>
          {text?.decimals === null
            ? "N/A"
            : text?.decimals.toString()?.length - 1}
        </p>
      ),
    },

    {
      title: (
        <p style={{ textAlign: "center", marginBottom: "0" }}>
          Contract Address
        </p>
      ),
      render: (text) => (
        <p
          style={
            text?.token_address === null
              ? { textAlign: "center", marginBottom: "0" }
              : {
                  cursor: "pointer",
                  textDecoration: "underline",
                  color: "#367CC7",
                  textAlign: "center",
                  marginBottom: "0",
                }
          }
          onClick={() => {
            if (text?.token_address !== null) {
              redirectToExplorer(text.coin_family, text.token_address);
            }
          }}
          title={
            text.token_address?.length > 50
              ? text?.token_address.substr(0, 50)
              : ""
          }
        >
          {text?.token_address === null
            ? "N/A"
            : text.token_address?.length > 50
            ? text?.token_address.substr(0, 50) + ".."
            : text?.token_address}
        </p>
      ),
    },
    {
      title: "Added on ",
      render: (text) => (
        <p>
          {text?.created_at === null
            ? "N/A"
            : moment.utc(text?.created_at).format("MM/DD/YYYY")}
        </p>
      ),
    },
    {
      title: "Swap On/Off",
      key: "action",
      render: (text, record) => (
        <p style={{ textAlign: "center", marginBottom: "0" }}>
          <Tooltip
            title={
              ![1, 2, 4].includes(record?.coin_family)
                ? "Non-EVM token cannot be changed"
                : ""
            }
          >
            <Switch
              className={record?.for_swap === 0 ? "custom-switch-off" : ""}
              checked={record?.for_swap === 1}
              disabled={![1, 2, 4].includes(record?.coin_family)}
              onChange={() => {
                const newStatus = record?.for_swap === 1 ? 0 : 1;
                onChangeSwitch({
                  id: record?.coin_id,
                  status: newStatus,
                });
              }}
            />
          </Tooltip>
        </p>
      ),
    },
    {
      title: <p style={{ textAlign: "center", marginBottom: "0" }}> Action</p>,
      key: "action",
      render: (text, record) => (
        <>
          <div style={{ textAlign: "center", marginBottom: "0" }}>
            {
              <p className="select-Design select-width firstSelect addStyle_select">
                <Dropdown
                  menu={{
                    onClick: (e, data) => showConfirm(e, data),
                    items: [
                      {
                        key: "3",
                        value: record,
                        label: "Upload-Image",
                        onClick: (e) => {
                          showConfirm(e, record);
                        },
                      },
                    ],
                  }}
                  placement="bottomRight"
                >
                  <Button>View More</Button>
                </Dropdown>
              </p>
            }
          </div>
        </>
      ),
    },
    {
      title: "Manage Asset",
      key: "action",
      render: (text, record) => (
        <Button
          className="btn mr10"
          type="primary"
          style={{ color: "white" }}
          onClick={(e) => {
            const isToken = record?.coin_status === 1;
            const actionText = isToken ? "disable" : "enable";
            const statusValue = isToken ? 0 : 1;

            confirm({
              icon: (
                <ExclamationCircleFilled
                  style={{ marginTop: "6px", color: "black" }}
                />
              ),
              title: (
                <span style={{ color: "black", marginLeft: "15px" }}>
                  Do you want to {actionText} this token?
                </span>
              ),

              centered: true,
              okText: isToken ? "Disable" : "Enable",
              okButtonProps: {
                style: { backgroundColor: "#1890ff", borderColor: "#1890ff" },
              },
              async onOk() {
                let disableValue = {
                  id: record?.coin_id,
                  status: statusValue,
                };
                const enc = await encryption(JSON.stringify(disableValue));
                const securedData = { dataString: enc };
                ActionEnableDisable(securedData).then((res, err) => {
                  SetAction("disable_token");
                  if (res?.data) {
                    dispatch(
                      setToast({
                        message: `${res?.data?.message}`,
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
              },
              onCancel() {
              },
            });
          }}
        >
          {record?.coin_status === 1 ? "Disable" : "Enable"}
        </Button>
      ),
    },
  ];

  const getTokenDataFn = async (
    myFromData,
    myToDate,
    searchData,
    myPage,
    coin_family
  ) => {
    const searchError = getSearchError(searchData);
    if (searchError) {
      dispatch(setToast({ message: searchError, status: false }));
      return;
    }
    let filter_data = {
      page: !myPage ? (SearchData != "" ? 1 : currentPage) : myPage,
      limit: perPage,
      search: searchData ? searchData?.trim() : undefined,
      from_date: myFromData || null,
      to_date: myToDate || null,
    };
    if (filterAddedBy !== "0") {
      filter_data["added_by"] = filterAddedBy;
    }
    if (coin_family > 0) {
      filter_data.coin_family = coin_family;
    }
    
    try {
      const enc = await encryption(JSON.stringify(filter_data));
      const securedData = { dataString: enc };
      const response = await getTokenTableData(securedData);
      
      if (response?.data) {
        setTableData(response?.data?.data);
        dispatch(setTokenTableData(response?.data?.data));
      } else if (response?.error?.data) {
        
        // Check for 401 unauthorized error in error.data
        if (response?.error?.data?.code === 401) {
          handleUnauthorizedError(response, dispatch, navigate, setToast);
          return;
        }
        
        dispatch(
          setToast({
            message: `${response?.error?.data?.message || "Something went wrong"}`,
            status: false,
          })
        );
      } else if (response?.error) {
        
        // Check for 401 unauthorized error in error
        if (response?.error?.status === 401) {
          handleUnauthorizedError(response, dispatch, navigate, setToast);
          return;
        }
        
        dispatch(
          setToast({
            message: `${response?.error?.error || "Something went wrong"}`,
            status: false,
          })
        );
      }
    } catch (error) {
      console.error("Error fetching token data:", error);
      
      // Handle any other errors including 401
      if (error?.status === 401 || error?.data?.code === 401) {
        handleUnauthorizedError({ error: { status: 401 } }, dispatch, navigate, setToast);
      } else {
        dispatch(
          setToast({
            message: "Failed to fetch token data",
            status: false,
          })
        );
      }
    }
  };

  useEffect(() => {
    (async () => {
      getTokenDataFn(fromDate, toDate, SearchData, currentPage, coin_family);
    })();
  }, [
    // TokenData,
    currentPage,
    // viewData,
    dispatch,
    // TokenId,
    getTokenTableData,
    perPage,
    filterAddedBy,
  ]);

  useEffect(() => {
    (async () => {
      if (action !== "") {
        SetAction("");
        getTokenDataFn(fromDate, toDate, SearchData, currentPage, coin_family);
      }
    })();
  }, [action]);

  const select_options = [
    { key: "key1", label: "ALL", value: "0" },
    { key: "key2", label: "Added by User", value: "2" },
    { key: "key3", label: "Added by Admin", value: "1" },
  ];
  const navigate = useNavigate();

  const handlePagenationChange = (event) => {
    if (!enableSearchButton) {
      SetSearchData("");
      setFromDate(null);
      setToDate(null);
    }
    setCurrentPage(event);
  };

  const onChangeSwitch = async (value) => {
    confirm({
      title:
        value.status == 1 ? (
          <span style={{ color: "black" }}>
            Do you want to add this token to the swap?
          </span>
        ) : (
          <span style={{ color: "black" }}>
            Do you want to remove this token from the swap?
          </span>
        ),
      icon: <ExclamationCircleFilled />,
      centered: true,
      async onOk() {
        SetAction("");
        setDisableToggleSwap(false);
        setSwapChangeLoading(true);
        const enc = await encryption(
          JSON.stringify({ id: value.id, status: value.status })
        );
        const securedData = { dataString: enc };
        swapAction(securedData).then(async (res, err) => {
          if (res?.data?.status === true) {
            SetAction("token_swap_enable_disable");
            dispatch(
              setToast({ message: `${res?.data?.message}`, status: true })
            );
            setSwapChangeLoading(false);
            setDisableToggleSwap(true);
          } else {
            if (!res?.error?.data?.status && res?.error?.data?.message) {
              dispatch(
                setToast({
                  message: `${res?.error?.data?.message}`,
                  status: false,
                })
              );
            } else {
              dispatch(
                setToast({ message: `Something went wrong`, status: false })
              );
            }
            setSwapChangeLoading(false);
            setDisableToggleSwap(true);
          }
        });
      },
      onCancel() {
      },
    });
  };

  const onChangeFilterHandler = (data) => {
    setFilterAddedBy(data.value);
    setCurrentPage(1);
  };

  const onChangeBlockchainFilterHandler = (data) => {
    setCoinFamily(data.value);
    setCurrentPage(1);
  };

  const handleAddTokenCancel = (value, action) => {
    setModal2Open(value);
    if (action == "AddToken") {
      SetAction(action);
    }
  };
  const handleEditTokenCancel = (value, action) => {
    setEditModalOpen(value);
    if (action != "") {
      SetAction(action);
    }
  };

  const redirectToExplorer = (coinFamily, contractAddress) => {
    let explorerUrl;

    switch (coinFamily) {
      case 2: // Ethereum
        explorerUrl = `https://etherscan.io/address/${contractAddress}`;
        break;
      case 1: // Binance Smart Chain
        explorerUrl = `https://bscscan.com/address/${contractAddress}`;
        break;
      case 5: // Solana
        explorerUrl = `https://explorer.solana.com/address/${contractAddress}`;
        break;
      case 4: // Polygon
        explorerUrl = `https://polygonscan.com/address/${contractAddress}`;
        break;
      case 7: // Avalanche
        explorerUrl = `https://cchain.explorer.avax.network/address/${contractAddress}`;
        break;
      case 9: // Pulse Chain
        explorerUrl = `https://scan.pulsechain.com/address/${contractAddress}`;
        break;
      case 3:
        explorerUrl = `https://live.blockcypher.com/btc/address/${contractAddress}`;
      case 6:
        explorerUrl = `https://tronscan.org/#/address/${contractAddress}`;
      default: // Cronos
        explorerUrl = `https://cronos-explorer.crypto.org/address/${contractAddress}`;
        break;
    }

    window.open(explorerUrl, "_blank");
  };

  const showConfirm = (e, parsedValue) => {
    SetAction("");
    if (e.key == "1" && parsedValue) {
      confirm({
        title: "Do you want to enable this token?",
        icon: <ExclamationCircleFilled />,
        centered: true,
        onOk() {

          let disableValue = {
            id: parsedValue?.id,
            token_status: "active",
            ip_address: IpData.ip,
          };

          ActionEnableDisable(disableValue).then((res, err) => {
            SetAction("enable_token");

            if (res?.data?.data?.status) {
              dispatch(
                setToast({
                  message: `${res?.data?.data?.message}`,
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
        },
        onCancel() {
        },
      });
    } else if (e.key == "2" && parsedValue) {
      confirm({
        title: "Do you want to disable this token?",
        icon: <ExclamationCircleFilled />,
        centered: true,
        onOk() {
          let disableValue = {
            id: parsedValue?.id,
            token_status: "inactive",
            ip_address: IpData?.ip,
          };
          ActionEnableDisable(disableValue).then((res, err) => {
            SetAction("disable_token");
            if (res?.data?.data?.status) {
              dispatch(
                setToast({
                  message: `${res?.data?.data?.message}`,
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
        },
        onCancel() {
        },
      });
    } else if (e.key == "6" && parsedValue) {
      confirm({
        title:
          e.status !== "blacklist"
            ? "Do you want to blacklist this token?"
            : "Do you want to whitelist this token?",
        icon: <ExclamationCircleFilled />,
        centered: true,
        onOk() {
          let disableValue = {
            id: parsedValue?.id,
            token_status: e.status !== "blacklist" ? "blacklist" : "active",
            ip_address: IpData?.ip,
          };
          ActionEnableDisable(disableValue).then((res, err) => {
            SetAction("blacklist_token");
            if (res?.data?.data?.status) {
              dispatch(
                setToast({
                  message: `${res?.data?.data?.message}`,
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
        },
        onCancel() {
        },
      });
    } else if (e.key === "4" && parsedValue) {
      setTokenId(parsedValue?.coin_id);
      setEditTokenName(parsedValue?.coin_name);
      setEditAction("edit_token_name");
      setEditTokenTitle("Edit Token Name");
      setEditModalOpen(true);
    } else if (e.key === "5" && parsedValue) {
      let title = "Do you want to set this token as default token?";
      if (parsedValue.is_shortlist == 1) {
        title =
          "This token set as shortlist token, Do you want to set this token as default token?";
      }
      confirm({
        title: title,
        icon: <ExclamationCircleFilled />,
        centered: true,
        onOk() {
          let disableValue = {
            id: parsedValue?.id,
            is_default: 1,
            ip_address: IpData?.ip,
          };
          MakeRemoveDefaultToken(disableValue).then((res, err) => {
            SetAction("set_default_token");
            if (res?.data?.data?.status) {
              dispatch(
                setToast({
                  message: `${res?.data?.data?.message}`,
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
        },
        onCancel() {
        },
      });
    } else if (e.key === "inactive" || e.key === "blacklist") {
      confirm({
        title:
          e.key === "inactive"
            ? "First need to enable the token from manage column"
            : "First need to Whitelist the token from blacklist column",
        icon: <ExclamationCircleFilled />,
        centered: true,
        okText: null,
        okButtonProps: { style: { display: "none" } },
        onCancel() {
        },
      });
    } else if (parsedValue) {
      setTokenId(parsedValue?.coin_id);
      setEditAction("edit_token_image");
      setEditTokenTitle(
        <span style={{ color: "#080707" }}>Upload Token Image</span>
      );
      setEditModalOpen(true);
    }
  };

  const renderTokenType = (token_type, coin_family) => {
    switch (coin_family) {
      case 1:
        return token_type !== null ? "ERC20" : "N/A";
      case 3:
        return token_type !== null ? "BEP20" : "N/A";
      case 4:
        return token_type !== null ? "SPL" : "N/A";
      case 5:
        return token_type !== null ? "Native" : "N/A";
      case 6:
        return token_type !== null ? "POLYGON" : "N/A";
      case 7:
        return token_type !== null ? "ERC20" : "N/A";
      case 9:
        return token_type !== null ? "ERC20" : "N/A";
      default:
        return token_type !== null ? "CRC20" : "N/A";
    }
  };

  const renderCointag = (token_type, coin_family) => {
    switch (coin_family) {
      case 1:
        return token_type !== null ? "Ethereum" : "N/A";
      case 3:
        return token_type !== null ? "Binance Smart Chain" : "N/A";
      case 4:
        return token_type !== null ? "Solana" : "N/A";
      case 5:
        return token_type !== null ? "Cardano" : "N/A";
      case 6:
        return token_type !== null ? "Polygon" : "N/A";
      case 7:
        return token_type !== null ? "Avalanche" : "N/A";
      case 9:
        return token_type !== null ? "Pulse Chain" : "N/A";
      default:
        return token_type !== null ? "Cronos" : "N/A";
    }
  };

  // Add handleSuccess function
  const handleSuccess = () => {
    getTokenDataFn(fromDate, toDate, SearchData, currentPage, coin_family);
  };

  return (
    <div className="main_page_outer">

      <ToastContainer />

      <Spin
        spinning={isLoading || loading || saveAccountLoading}
        className="spininner"
        tip="Loading..."
        size="large"
      >
        <div className="main_page_outer_btn">
          <div className="topper">
            <div className="headerTopSec">
              <div
                className="form-group reactDatePicker"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <label
                  htmlFor=""
                  style={{ color: "#000", fontWeight: "bold" }}
                  className="labelHead"
                >
                  From Date
                </label>
                <Input
                  type="date"
                  value={fromDate}
                  style={{ cursor: "text", textTransform: "uppercase" }}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(e) => {
                    const selectedDate = e.target.value;
                    if (!selectedDate) {
                      setFromDate(null);
                    } else {
                      const currentDate = new Date()
                        .toISOString()
                        .split("T")[0]; // Get the current date in YYYY-MM-DD format

                      if (
                        (toDate !== null &&
                          new Date(toDate).getTime() <
                            new Date(selectedDate).getTime()) ||
                        selectedDate > currentDate
                      ) {
                        // Do not update fromDate state if a future date is selected
                        dispatch(
                          setToast({
                            message:
                              selectedDate > currentDate
                                ? "Future dates are not allowed"
                                : "From date cannot be after To date",
                            status: false,
                          })
                        );
                        return;
                      }
                      setFromDate(selectedDate);
                    }
                  }}
                  className="form-control"
                />
              </div>
              <div
                className="form-group reactDatePicker"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <label
                  htmlFor=""
                  style={{ color: "#000", fontWeight: "bold" }}
                  className="labelHead"
                >
                  To Date
                </label>
                <Input
                  type="date"
                  value={toDate}
                  className="form-control"
                  style={{ cursor: "text", textTransform: "uppercase" }}
                  min={fromDate || undefined} // Set the minimum allowed date as the fromDate
                  max={new Date().toISOString().split("T")[0]} // Set the maximum allowed date as the current date
                  defaultValue="DD-MM-YYYY"
                  onChange={(e) => {
                    const selectedDate = e.target.value;

                    if (!selectedDate) {
                      setToDate(null);
                    } else {
                      const currentDate = new Date()
                        .toISOString()
                        .split("T")[0]; // Get the current date in YYYY-MM-DD format

                      if (
                        (fromDate !== null &&
                          new Date(fromDate).getTime() >
                            new Date(selectedDate).getTime()) ||
                        selectedDate > currentDate
                      ) {
                        // Do not update toDate state if a future date is selected
                        dispatch(
                          setToast({
                            message:
                              selectedDate > currentDate
                                ? "Future dates are not allowed"
                                : "To date cannot be before From date",
                            status: false,
                          })
                        );
                        return;
                      }

                      setToDate(selectedDate);
                    }
                  }}
                />
              </div>

              <div
                className="form-group searchBox"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <label
                  htmlFor=""
                  style={{ color: "#000", fontWeight: "bold" }}
                  className="labelHead"
                >
                  Search
                </label>
                <Input
                  type="text"
                  title="Search by token name/ symbol/ address"
                  placeholder="Search by token name/ symbol/ address"
                  className="form-control"
                  value={SearchData}
                  onChange={(e) => SetSearchData(e.target.value.trimStart())}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if ((fromDate == null) !== (toDate == null)) {
                        dispatch(
                          setToast({
                            message: fromDate == null ? "Please select From date" : "Please select To date",
                            status: false,
                          })
                        );
                        return;
                      }
                      setEnableSearchButton(true);
                      setCurrentPage(1);
                      getTokenDataFn(
                        fromDate,
                        toDate,
                        SearchData,
                        1,
                        coin_family
                      );
                    }
                  }}
                />
              </div>
            </div>

            <div className="searchInput">
              <div className="select-filter">
                <Select
                  isSearchable={false}
                  placeholder="All"
                  options={select_options}
                  className="selectReactCmn"
                  onChange={onChangeFilterHandler}
                  value={
                    filterAddedBy
                      ? select_options.filter(
                          (data) => data.value == filterAddedBy
                        )[0]
                      : ""
                  }
                />
              </div>
              <div className="select-filter">
                <Select
                  isSearchable={false}
                  placeholder="Select any chain"
                  options={select_blockchain}
                  className="selectReactCmn"
                  onChange={onChangeBlockchainFilterHandler}
                  value={
                    coin_family
                      ? select_blockchain.filter(
                          (data) => data.value == coin_family
                        )[0]
                      : ""
                  }
                />
              </div>
              <Button
                className="btn"
                type="primary"
                disabled={disabledButton}
                onClick={async () => {
                  if (fromDate == null && toDate != null) {
                    setDisabledButton(true);
                    dispatch(
                      setToast({
                        message: `Please select From date`,
                        status: false,
                      })
                    );
                    setTimeout(() => {
                      setDisabledButton(false);
                    }, 3000);
                  } else if (fromDate != null && toDate == null) {
                    setDisabledButton(true);
                    dispatch(
                      setToast({
                        message: `Please select To date`,
                        status: false,
                      })
                    );
                    setTimeout(() => {
                      setDisabledButton(false);
                    }, 3000);
                  } else {
                    setEnableSearchButton(true);
                    setCurrentPage(1);
                    await getTokenDataFn(
                      fromDate,
                      toDate,
                      SearchData,
                      1,
                      coin_family
                    );
                  }
                }}
              >
                Search
              </Button>
              <Button
                className="btn"
                type="primary"
                onClick={async () => {
                  setFromDate(null);
                  setToDate(null);
                  SetSearchData("");
                  setFilterAddedBy("1");
                  setCoinFamily(0);
                  setEnableSearchButton(false);
                  getTokenDataFn(null, null, null, 1, null);
                }}
              >
                Reset
              </Button>
            </div>
          </div>
          <Button
            className="btn mr10"
            type="primary"
            onClick={() => setModal2Open(true)}
            style={{ marginBottom: "10px" }}
          >
            Add Tokens
          </Button>
        </div>

        <Table
          className="tokenmanagementTable"
          pagination={false}
          columns={permission_type === "1" ? columns : writeColumns}
          rowKey={"id"}
          dataSource={tableData ? tableData?.token_list : []}
          bordered
        />

        {tableData?.total > 10 ? (
          <Pagination
            pageSize={perPage}
            current={currentPage}
            showSizeChanger={false}
            total={tableData?.total}
            onChange={(event) => {
              handlePagenationChange(event);
            }}
            style={{ bottom: "0px" }}
          />
        ) : null}

        {modal2Open && (
          <AddToken
            modal2Open={modal2Open}
            handleAddTokenCancel={handleAddTokenCancel}
          />
        )}

        {EditModalOpen && (
          <UploadTokenModal
            modal2Open={EditModalOpen}
            handleEditTokenCancel={handleEditTokenCancel}
            TokenId={TokenId}
            editTokenName={editTokenName}
            editTokenTitle={editTokenTitle}
            editAction={editAction}
            handleSuccess={handleSuccess}
          />
        )}
      </Spin>
    </div>
  );
};

export default TokenManagement;
