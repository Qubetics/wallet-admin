import React, { useEffect, useMemo, useRef, useState } from "react";
import { Spin, Table, Button, message, Input, Pagination, Tooltip } from "antd";
import * as moment from "moment";

import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";

import { useGetTransactionListDataMutation } from "../../Redux/services/TransactionsDetail/TransactionsDetailApiSlice";
import { setTransactionListData } from "../../Redux/slice/TransactionDetailSlice";
import { truncate, exponentialToDecimal } from "../../Helper/StringFormat";
import { setToast } from "../../Redux/slice/toastSlice";
import "react-date-picker/dist/DatePicker.css";
import {
  renderCointag,
  select_blockchain,
} from "../../common/constant/constant";
import { formatNumberCrypto, formatNumberUSD } from "../../Helper/FormatNumber";
import { encryption } from "../../common/encryption/encryption";

function TransactionDetails() {
  const [checked, setChecked] = useState(true);
  const [perPage, setPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [SearchData, SetSearchData] = useState("");
  const [baseUrl, setbaseUrl] = useState("");
  const [disabledButton, setDisabledButton] = useState(false);

  const inputRef = useRef();
  // const [input, setInput] = useState(true);
  const dispatch = useDispatch();

  const [search, setSearch] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [enableSearchButton, setEnableSearchButton] = useState(false);
  const [coin_family, setCoinFamily] = useState(0);
  const [filterAddedBy, setFilterAddedBy] = useState("0");
  const [tableData, setTableData] = useState([]);
  const [getTransactionsListData, { isLoading }] =
    useGetTransactionListDataMutation();

  // const {data:TransactionHistoryData, isLoading } = useGetTransactionsDataQuery({page:currentPage,limit:perPage,search:SearchData?SearchData:undefined});

  let TransactionsDetails = useSelector(
    (state) => state?.TransactionData?.listData
  );
  console.log("TransactionsDetails >>>", TransactionsDetails);
  let TransactionsDetailsMeta = useSelector(
    (state) => state?.TransactionData?.meta
  );

  const getTransactionsDataFn = async (
    myFromData,
    myToDate,
    searchData,
    myPage,
    coin_family
  ) => {
    let filter_data = {
      page: !myPage ? (SearchData != "" ? 1 : currentPage) : myPage,
      limit: perPage,
      search: searchData ? searchData?.trim() : undefined,
      from_date: myFromData || null,
      to_date: myToDate || null,
    };
    // // if (filterAddedBy !== "0") {
    // filter_data["added_by"] = filterAddedBy;
    // }
    if (coin_family > 0) {
      filter_data.coin_family = coin_family;
    }
    const enc = await encryption(JSON.stringify(filter_data));
    const securedData = { dataString: enc };
    await getTransactionsListData(securedData).then((res, err) => {
      if (res) {
        if (res?.data) {
          console.log("res?.data >>>", res?.data?.data);
          setTableData(res?.data?.data);
          dispatch(
            setTransactionListData(res?.data?.data?.transaction_history)
          );
          setSearch(false);
        } else {
          // getTransactionsDataFn(
          //   fromDate,
          //   toDate,
          //   SearchData,
          //   currentPage,
          //   coin_family
          // );
        }
      }
    });
  };
  const onChangeBlockchainFilterHandler = (data) => {
    setCoinFamily(data?.value);
    setCurrentPage(1);
    // SetSearchData("");
    // getTransactionsDataFn(fromDate, toDate, "", 1, data.value, coin_family);
  };
  useEffect(() => {
    (() => {
      getTransactionsDataFn(
        fromDate,
        toDate,
        SearchData,
        currentPage,
        coin_family
      );
    })();
  }, [dispatch, currentPage, filterAddedBy]);

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       // const GetTransactionHistoryData = await TransactionHistoryData;
  //       // if (GetTransactionHistoryData) {
  //       //  dispatch( setTransactionData(GetTransactionHistoryData?.data))
  //       // }
  //     } catch {
  //       console.log("error");
  //     }
  //   })();
  // },

  // // [TransactionHistoryData?.data,currentPage,SearchData]

  // );
  // useEffect(() => {
  //   // alert('oooopp')
  //   (async () => {
  //     let resp = await getTransactionsData({
  //       "page":currentPage,
  //       "limit":perPage
  //     });

  //     if (resp?.data?.data) dispatch(setTransactionData(resp?.data?.data));
  //   })();
  // }, [currentPage]);

  const renderSwitch = (type) => {
    switch (type) {
      case "1":
        setbaseUrl({ baseUrl: "https://etherscan.io/tx/" });
        break;

      default:
        console.log("ether trx");
    }
    // switch (type) {

    //   // Live
    //   case "1":
    //   case 1:
    //     return setbaseUrl({ baseUrl: "https://etherscan.io/tx/" }); //"https://etherscan.io/address/"
    //   case "2":
    //   case 2:
    //     return setbaseUrl({
    //       baseUrl: "https://live.blockcypher.com/btc/tx/", //https://live.blockcypher.com/btc/address/"
    //     });
    //   case "3":
    //   case 3:
    //     return setbaseUrl({ baseUrl: "https://bscscan.com/tx/" }); // https://bscscan.com/address/
    //   case "4":
    //   case 4:
    //     return setbaseUrl({
    //       baseUrl: "https://tronscan.org/#/transaction/", //https://tronscan.org/#/address/
    //     });
    //   case "5":
    //   case 5:
    //     return setbaseUrl({
    //       baseUrl: "https://blockexplorer.one/ltc/mainnet/tx/", //https://live.blockcypher.com/ltc/address/
    //     });
    //   case "6":
    //   case 6:
    //     return setbaseUrl({
    //       baseUrl: "https://blockexplorer.one/dash/mainnet/tx/", //https://live.blockcypher.com/dash/address/
    //     });
    //   case "7":
    //   case 7:
    //     return setbaseUrl({
    //       baseUrl: "https://blockexplorer.one/bch/mainnet/tx/", //https://blockchair.com/bitcoin-cash/address/
    //     });
    //   case "9":
    //   case 9:
    //     return setbaseUrl({
    //       baseUrl: "https://polkadot.subscan.io/extrinsic/",
    //     }); //https://polkadot.subscan.io/account/
    //   case "10":
    //   case 10:
    //     return setbaseUrl({
    //       baseUrl: "https://kusama.subscan.io/extrinsic/",
    //     }); //https://kusama.subscan.io/account/

    //   case "11":
    //   case 11:
    //     return setbaseUrl({
    //       baseUrl: "https://blockchair.com/dogecoin/transaction/",
    //     }); //https://blockchair.com/dogecoin/address/

    //   case "12":
    //   case 12:
    //     return setbaseUrl({
    //       baseUrl: "https://www.confluxscan.io/transaction/",
    //     }); //https://www.confluxscan.io/address/
    //   case "13":
    //   case 13:
    //     return setbaseUrl({ baseUrl: "https://explorer.rsk.co/tx/" }); //https://explorer.rsk.co/address/
    //   case "14":
    //   case 14:
    //     return setbaseUrl({ baseUrl: "https://explorer.celo.org/tx/" }); //https://explorer.celo.org/address/

    //   case "17":
    //   case 17:
    //     return setbaseUrl({ baseUrl: "https://snowtrace.io/tx/" }); //https://explorer.rsk.co/address
    //   case "18":
    //   case 18:
    //     return setbaseUrl({ baseUrl: "https://polygonscan.com/tx/" }); //https://polygonscan.com/address/
    //   case "19":
    //   case 19:
    //     return setbaseUrl({ baseUrl: "https://hecoinfo.com/tx/" }); //https://polygonscan.com/address/
    //   case "20":
    //   case 20:
    //     return setbaseUrl({
    //       baseUrl: "https://tzkt.io/", //https://hecoinfo.com/tx/
    //     });
    //   case "21":
    //   case 21:
    //     return setbaseUrl({
    //       baseUrl: "https://stellarchain.io/tx/",
    //     });
    //   default:
    //     return setbaseUrl({
    //       baseUrl: "",
    //     }); //Working
    // }
  };

  const handlePagenationChange = (event) => {
    if (!enableSearchButton) {
      SetSearchData("");
      setFromDate(null);
      setToDate(null);
    }
    setCurrentPage(event);
    // getTransactionsDataFn(fromDate,toDate, SearchData, 1);
  };
  const onSearchHandler = (value) => {
    SetSearchData(value);
  };

  const schema = yup
    .object({
      keyword: yup.string(),
      startDate: yup.date(),
      endDate: yup
        .date()
        .min(yup.ref("startDate"), "end date can't be before start date"),
    })
    .required();
  const {
    handleSubmit,
    control,
    // setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const sharedProps = {
    style: { width: "100%" },
    defaultValue: "the value",
    ref: inputRef,
  };

  const onChangeTabs = (key) => {
    console.log(key);
  };

  const toggleChecked = () => {
    setChecked(!checked);
  };
  const onChange = (e) => {
    setChecked(e.target.checked);
  };

  const label = `${
    checked
      ? "Enable this token for swapping"
      : "disable this token for swapping"
  }`;

  const [value, setValue] = useState("0.005");

  const navigate = useNavigate();
  const handleMenuClick = (e) => {
    message.info("Click on menu item.");
  };

  const calculateUsedAmount = (amount, trxn_fiat_price_detail) => {
    let usd_amount = 0;
    if (trxn_fiat_price_detail?.length > 0) {
      let filter_price_data = trxn_fiat_price_detail.filter(
        (data) => data.fiat_currency.toLowerCase() == "usd"
      );
      if (filter_price_data?.length > 0) {
        usd_amount = amount * filter_price_data[0].current_price;
      }
    }
    return usd_amount;
  };
  const calculateCryptoAmount = (amount, decimals) => {
    let decimals_length = Number(decimals?.toString()?.length) - 1;
    let amount_crypto = amount?.toFixed(decimals_length);

    return amount_crypto;
  };

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
      title: " Token Name",
      // dataIndex: "coin_data",
      // key: "coin_data",
      render: (text, recrod) => (
        <p>
          {text?.coin_data?.coin_name === null || text === null
            ? "N/A"
            : text?.coin_data?.coin_name}
        </p>
      ),
    },
    {
      title: " Token Symbol",
      // dataIndex: "coin_data",
      // render: (text) => (
      //   <p>
      //     {text?.coin_symbol === null || text === null
      //       ? "N/A"
      //       : text?.coin_symbol.charAt(0).toUpperCase() +
      //         text?.coin_symbol.slice(1)}
      //   </p>
      // ),
      render: (text) => (
        <p>
          {text?.coin_data?.coin_symbol === null
            ? "N/A"
            : text?.coin_data?.coin_symbol?.toUpperCase()}
        </p>
      ),

      // render: (text) => <p>{text?.coin_symbol}</p>,
    },
    // {
    //   title: "Decimal",
    //   dataIndex: 'coin_data',
    //   key: 'coin_data',
    //   render: (text) => <p>{text?.decimals===null?'N/A':text?.decimals}</p>,
    // },
    {
      title: "Amount (In Crypto)",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => <p>{amount || "N/A"}</p>,
    },

    // {
    //   title: "Fiat Amount",
    //   // dataIndex: "amount",
    //   // key: "amount",
    //   render: (text) => (
    //     <p>
    //       {/* {exponentialToDecimal(
    //         calculateUsedAmount(text?.amount, text?.trxn_fiat_price_detail)
    //       )} */}
    //       {formatNumberUSD(
    //         calculateUsedAmount(text?.amount, text?.trxn_fiat_price_detail)
    //       )}

    //       {/* {text?.coin_data?.coins_market?.usd_amount === null ||
    //       text?.coin_data === null
    //         ? "N/A"
    //         : text?.coin_data?.coins_market
    //         ? parseFloat(
    //             exponentialToDecimal(
    //               text?.coin_data?.coins_market?.usd_amount
    //             ) || 0
    //           ).toFixed(2)
    //         : 0} */}
    //     </p>
    //   ),
    // },

    // {
    //   title: "Fiat Currency Name ",
    //   // dataIndex: "amount",
    //   // key: "amount",
    //   render: (text) => (
    //     <p>
    //       USD
    //       {/* {text?.coin_data?.coins_market?.fiat_currency === null ||
    //       text?.coin_data === null
    //         ? "N/A"
    //         : text?.coin_data?.coins_market?.fiat_currency.toUpperCase() ||
    //           "N/A"} */}
    //     </p>
    //   ),
    // },
    {
      title: "Source Address",
      dataIndex: "from_adrs",
      key: "from_adrs",
      render: (text, record) => (
        <Tooltip title={<p>{text === null ? "N/A" : text}</p>}>
          <u
            style={{
              cursor: "pointer",
              textDecoration: "underline",
              color: "#367CC7",
              textAlign: "center",
              marginBottom: "0",
            }}
            onClick={() =>
              record.coin_family === 2
                ? window.open(`https://etherscan.io/address/${text}`, "_blank")
                : record.coin_family === 3
                ? window.open(
                    `https://live.blockcypher.com/btc/address/${text}`,
                    "_blank"
                  )
                : record.coin_family === 1
                ? window.open(`https://bscscan.com/address/${text}`, "_blank")
                : record.coin_family === 5
                ? window.open(`https://solscan.io/address/${text}`, "_blank")
                : record.coin_family === 4
                ? window.open(
                    `https://polygonscan.com/address/${text}`,
                    "_blank"
                  )
                : record.coin_family === 6
                ? window.open(
                    `https://tronscan.org/#/address/${text}`,
                    "_blank"
                  )
                : record.coin_family === 7
                ? window.open(`https://ticsscan.com/tx/${text}`, "_blank")
                : ""
            }
          >
            <p>{text === null ? "N/A" : truncate(`${text}`, 16)}</p>
          </u>
        </Tooltip>
      ),
    },
    {
      title: "Destination Address",
      dataIndex: "to_adrs",
      key: "to_adrs",

      render: (text, record) => (
        <Tooltip title={<p>{text === null ? "N/A" : text}</p>}>
          <u
            style={{
              cursor: "pointer",
              textDecoration: "underline",
              color: "#367CC7",
              textAlign: "center",
              marginBottom: "0",
            }}
            onClick={() =>
              record.coin_family === 2
                ? window.open(`https://etherscan.io/address/${text}`, "_blank")
                : record.coin_family === 3
                ? window.open(
                    `https://live.blockcypher.com/btc/address/${text}`,
                    "_blank"
                  )
                : record.coin_family === 1
                ? window.open(`https://bscscan.com/address/${text}`, "_blank")
                : record.coin_family === 5
                ? window.open(`https://solscan.io/address/${text}`, "_blank")
                : record.coin_family === 4
                ? window.open(
                    `https://polygonscan.com/address/${text}`,
                    "_blank"
                  )
                : record.coin_family === 6
                ? window.open(
                    `https://tronscan.org/#/address/${text}`,
                    "_blank"
                  )
                : record.coin_family === 7
                ? window.open(`https://ticsscan.com/tx/${text}`, "_blank")
                : ""
            }
          >
            <p>{text === null ? "N/A" : truncate(`${text}`, 16)}</p>
          </u>
        </Tooltip>
      ),

      // render: (text) => (
      //   <Tooltip title={text === null ? "N/A" : text}>
      //     <p>{text === null ? "N/A" : truncate(`${text}`,16)}</p>
      //   </Tooltip>
      // ),
    },
    {
      title: "Transaction Hash  ",
      dataIndex: "tx_id",
      // key: "block_hash",
      render: (text, record) => (
        <Tooltip title={<p>{text === null ? "N/A" : text}</p>}>
          <div
            style={{
              cursor: "pointer",
              textDecoration: "underline",
              color: "#367CC7",
              textAlign: "center",
              marginBottom: "0",
            }}
          >
            {
              <u
                style={{ cursor: "pointer" }}
                onClick={() =>
                  record.coin_family === 2
                    ? window.open(`https://etherscan.io/tx/${text}`, "_blank")
                    : record.coin_family === 3
                    ? window.open(
                        `https://live.blockcypher.com/btc/tx/${text}`,
                        "_blank"
                      )
                    : record.coin_family === 1
                    ? window.open(`https://bscscan.com/tx/${text}`, "_blank")
                    : record.coin_family === 5
                    ? window.open(`https://solscan.io/tx/${text}`, "_blank")
                    : record.coin_family === 4
                    ? window.open(
                        `https://polygonscan.com/tx/${text}`,
                        "_blank"
                      )
                    : record.coin_family === 6
                    ? window.open(
                        `https://tronscan.org/#/transaction/${text}`,
                        "_blank"
                      )
                    : record.coin_family === 7
                    ? window.open(`https://ticsscan.com/tx/${text}`, "_blank")
                    : ""
                }
              >
                <p>{text === null ? "N/A" : truncate(`${text}`, 16)}</p>
              </u>
            }
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Transaction Status",
      // dataIndex: "blockchain_status",
      // key: "status",
      render: (text, record) => {
        let style;
        if (
          record?.status == "completed" ||
          record?.blockchain_status == "confirmed"
        ) {
          style = {
            color: "green",
            fontWeight: "bold",
            textTransform: "capitalize",
          };
        } else if (
          record?.status == "failed" ||
          record?.blockchain_status == "failed"
        ) {
          style = {
            color: "red",
            fontWeight: "bold",
            textTransform: "capitalize",
          };
        } else if (
          record?.status == "pending" ||
          record?.blockchain_status == "pending"
        ) {
          style = {
            color: "orange",
            fontWeight: "bold",
            textTransform: "capitalize",
          };
        } else {
          style = {
            color: "black",
            fontWeight: "bold",
            textTransform: "capitalize",
          };
        } // Default color if none of the conditions match

        return (
          <p style={style}>
            {record?.req_type == "MERCURYO" ||
            record?.req_type == "TRANSAK" ||
            record?.req_type == "ALCHEMY" ||
            record?.req_type == "SIMPLEX"
              ? record?.status
              : record?.blockchain_status === null
              ? "N/A"
              : record?.blockchain_status?.charAt(0)?.toUpperCase() +
                record?.blockchain_status?.slice(1)}
            {/* {text === null
              ? "N/A"
              : text.charAt(0).toUpperCase() + text.slice(1)}{" "} */}
          </p>
        );
      },
    },
    {
      title: "Date and Time",
      dataIndex: "created_at",
      // key: "created_at",
      render: (text) => (
        <p>
          {text === null
            ? "N/A"
            : moment.utc(text).format("MM/DD/YYYY h:mm:ss A")}
          {/* :  moment.utc(text).local().format('MM/DD/YYYY h:mm:ss A') } */}
        </p>
      ),
    },

    // {
    //   title: "Action",
    //   key: "action",
    //   render: (text, record) => (
    //     <span>
    //       <Dropdown menu={menuProps}>
    //         <Button>
    //           <Space>
    //             Action
    //             <MoreOutlined />
    //           </Space>
    //         </Button>
    //       </Dropdown>
    //     </span>
    //   ),
    // },
  ];

  return (
    <div className="main_page_outer">
      <Spin
        spinning={isLoading}
        className="spininner"
        tip="Loading..."
        size="large"
      >
        <div className="dashbord_upper">
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
                  style={{ cursor: "text", textTransform: "uppercase" }}
                  value={fromDate}
                  max={new Date().toISOString().split("T")[0]} // Set the maximum allowed date as the current date
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
                        return;
                      }

                      setFromDate(selectedDate);
                    }
                  }}
                  className="form-control"
                />
              </div>
              {/* <div
                className='form-group reactDatePicker'
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <label htmlFor='' style={{ color: "#000" }} className="labelHead">
                  From date
                </label>
              <DatePicker
                    dayPlaceholder="DD"
                    monthPlaceholder="MM"
                    yearPlaceholder="YYYY"
                    value={fromDate !== null
                      ? moment(fromDate)
                      : null}
                    format="MM-dd-yyyy"
                    clearIcon={null}
                    // calendarIcon={<CalendarIcon />}
                    onChange={(e) => {
                      const selectedDate = e;
                    const currentDate = new Date().toISOString().split("T")[0]; // Get the current date in YYYY-MM-DD format

                    if ((toDate!==null && new Date(toDate).getTime() < new Date(selectedDate).getTime()) || selectedDate > currentDate) {
                      // Do not update fromDate state if a future date is selected
                      return;
                    }

                    setFromDate(selectedDate);
                      // setStartDate(date);
                      // setStartDateError("")
                      // setDateError("")
                    }}
                    onKeyDown={(e) => {
                      e.preventDefault()
                    }}
                    maxDate={toDate ? toDate : new Date()}
                  />
                  </div>  */}
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
                <div style={{ cursor: "pointer" }}>
                  <Input
                    type="date"
                    value={toDate}
                    className="form-control"
                    defaultValue="DD-MM-YYYY"
                    style={{ cursor: "text", textTransform: "uppercase" }}
                    //min={fromDate} // Set the minimum allowed date as the fromDate
                    max={new Date().toISOString().split("T")[0]} // Set the maximum allowed date as the current date
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
                          return;
                        }

                        setToDate(selectedDate);
                      }
                    }}
                  />
                </div>
                {/* <DatePicker
                    // placeholder="End Date"
                    value={toDate !== null
                      ? moment(toDate)
                      : null}
                    format="MM-dd-yyyy"
                    dayPlaceholder="DD"
                    monthPlaceholder="MM"
                    yearPlaceholder="YYYY"
                    clearIcon={null}
                    // calendarIcon={<CalendarIcon />}
                    onChange={(e) => {
                      const selectedDate = e;
                      const currentDate = new Date()
                        .toISOString()
                        .split("T")[0]; // Get the current date in YYYY-MM-DD format

                      if (selectedDate > currentDate) {
                        // Do not update toDate state if a future date is selected
                        return;
                      }

                      setToDate(selectedDate);
                    }}
                    onKeyDown={(e) => {
                      e.preventDefault()
                    }}
                    minDate={fromDate ? fromDate : null}
                    maxDate={new Date()}
                  /> */}
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
                  title="Seach by From address/ To address/ hash"
                  placeholder="Seach by From address/ To address/ hash"
                  className="form-control"
                  maxLength={100}
                  // placeholder={"coin name,symbol,address,hash"}
                  value={SearchData}
                  onChange={(e) => {
                    SetSearchData(e.target.value.trimStart());
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setEnableSearchButton(true);
                      setCurrentPage(1);
                      getTransactionsDataFn(
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
            <div className="select-filter">
              <Select
                isSearchable={false}
                placeholder="Select any chain"
                options={select_blockchain}
                className="selectReactCmn"
                onChange={onChangeBlockchainFilterHandler}
                value={
                  coin_family
                    ? select_blockchain.includes(
                        (data) => data.value == coin_family
                      )[0]
                    : ""
                }
              />
            </div>
            <div className="searchInput">
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
                    await getTransactionsDataFn(
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
            </div>

            <Button
              className="btn"
              type="primary"
              // style={{ marginLeft: "20px" }}
              onClick={async () => {
                setFromDate(null);
                setToDate(null);
                SetSearchData("");
                setEnableSearchButton(false);
                setCoinFamily(null);
                await getTransactionsDataFn(null, null, null, null);
              }}
            >
              Reset
            </Button>
          </div>
        </div>

        <>
          {/* <Tabs defaultActiveKey="1" items={TabItems} onChange={onChangeTabs} /> */}
          <Table
            pagination={false}
            columns={columns}
            rowKey={"id"}
            dataSource={tableData?.transaction_history}
            bordered
          />
          {tableData?.total > 10 ? (
            <Pagination
              pageSize={perPage}
              showSizeChanger={false}
              current={currentPage}
              total={tableData?.total || 0}
              onChange={(event) => {
                handlePagenationChange(event);
              }}
              style={{ bottom: "0px" }}
            />
          ) : null}
        </>
      </Spin>
    </div>
  );
}

export default TransactionDetails;
