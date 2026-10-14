import React, { useEffect, useState } from 'react';
import { Spin, Table, Button, Input, Pagination, Tooltip, Select } from "antd";
import * as moment from "moment";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";

import { setTransactionData } from "../../../Redux/slice/TransactionDetailSlice";
import { truncate } from "../../../Helper/StringFormat";
import { setToast } from "../../../Redux/slice/toastSlice";
import "react-date-picker/dist/DatePicker.css";
import {
  renderCointag,
  select_blockchain,
} from "../../../common/constant/constant";
import { useGetRevenueTransactionsDataMutation } from "../../../Redux/services/revenue/bakingApiServices";
import {
  formatNumberCrypto,
  formatNumberUSD,
} from "../../../Helper/FormatNumber";

function Alchemy() {
  const [perPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [SearchData, SetSearchData] = useState("");
  const [disabledButton, setDisabledButton] = useState(false);
  const dispatch = useDispatch();
  const [search, setSearch] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [enableSearchButton, setEnableSearchButton] = useState(false);
  const [coin_family, setCoinFamily] = useState(0);
  const [filterAddedBy] = useState("0");
  const [getRevenueTransactionsData, { isLoading }] =
    useGetRevenueTransactionsDataMutation();

  let TransactionsDetails = useSelector(
    (state) => state?.TransactionData?.data
  );
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
    let req_type = "ALCHEMY";
    let filter_data = {
      page: !myPage ? (SearchData != "" ? 1 : currentPage) : myPage,
      limit: perPage,
      search: searchData ? searchData?.trim() : undefined,
      from_date: myFromData || null,
      to_date: myToDate || null,
      req_type,
    };

    if (coin_family > 0) {
      filter_data.coin_family = coin_family;
    }

    await getRevenueTransactionsData(filter_data).then((res, err) => {
      if (res) {
        if (res?.data) {
          dispatch(setTransactionData(res?.data?.data));
          setSearch(false);
        } else {
          getTransactionsDataFn(
            fromDate,
            toDate,
            SearchData,
            currentPage,
            coin_family,
            req_type
          );
        }
      } else {
      }
    });
  };
  const onChangeBlockchainFilterHandler = (data) => {
    setCoinFamily(data);
    setCurrentPage(1);
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

  const handlePagenationChange = (event) => {
    if (!enableSearchButton) {
      SetSearchData("");
      setFromDate(null);
      setToDate(null);
    }
    setCurrentPage(event);
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

  const { control, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

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
      render: (item, record, index) => (
        <>{currentPage > 1 ? (currentPage - 1) * 10 + index + 1 : index + 1}</>
      ),
    },
    {
      title: " Token Name",
      dataIndex: "coin_data",
      render: (text, recrod) => (
        <p>
          {text?.coin_name === null || text === null ? "N/A" : text?.coin_name}
          {" / "}{" "}
          <span style={{ fontSize: "10px" }}>
            {renderCointag(recrod?.coin_family)}
          </span>
        </p>
      ),
    },
    {
      title: " Token Symbol",
      dataIndex: "coin_data",
      render: (text) => (
        <p>
          {text?.coin_symbol === null ? "N/A" : text?.coin_symbol.toUpperCase()}
        </p>
      ),
    },
    {
      title: "Amount (In Crypto)",
      render: (text) => (
        <p>
          {formatNumberCrypto(
            calculateCryptoAmount(text?.amount, text?.coin_data?.decimals)
          )}
        </p>
      ),
    },

    {
      title: "Fiat Amount",
      render: (text) => (
        <p>
          {formatNumberUSD(
            calculateUsedAmount(text?.amount, text?.trxn_fiat_price_detail)
          )}
        </p>
      ),
    },

    {
      title: "Fiat Currency Name ",
      render: (text) => <p>USD</p>,
    },
    {
      title: "Source Address",
      dataIndex: "from_adrs",
      render: (text, record) =>
        text ? (
          <Tooltip title={<p>{text === null ? "N/A" : text}</p>}>
            <u
              style={{ cursor: "pointer" }}
              onClick={() =>
                record.coin_family === 1
                  ? window.open(
                      `https://etherscan.io/address/${text}`,
                      "_blank"
                    )
                  : record.coin_family === 2
                  ? window.open(
                      `https://live.blockcypher.com/btc/address/${text}`,
                      "_blank"
                    )
                  : record.coin_family === 3
                  ? window.open(`https://bscscan.com/address/${text}`, "_blank")
                  : record.coin_family === 4
                  ? window.open(`https://solscan.io/address/${text}`, "_blank")
                  : record.coin_family === 5
                  ? window.open(
                      `https://cardanoscan.io/address/${text}`,
                      "_blank"
                    )
                  : record.coin_family === 6
                  ? window.open(
                      `https://polygonscan.com/address/${text}`,
                      "_blank"
                    )
                  : record.coin_family === 7
                  ? window.open(
                      `https://snowtrace.io/address/${text}`,
                      "_blank"
                    )
                  : record.coin_family === 8
                  ? window.open(
                      `https://cronoscan.com/address/${text}`,
                      "_blank"
                    )
                  : record.coin_family === 9
                  ? window.open(
                      `https://scan.pulsechain.com/address/${text}`,
                      "_blank"
                    )
                  : ""
              }
            >
              <p style={{ color: "#9f53ff" }}>
                {text === null ? "N/A" : truncate(`${text}`, 16)}
              </p>
            </u>
          </Tooltip>
        ) : (
          "N/A"
        ),
    },

    {
      title: "Destination Address",
      dataIndex: "to_adrs",

      render: (text, record) =>
        text ? (
          <Tooltip title={<p>{text === null ? "N/A" : text}</p>}>
            <u
              style={{ cursor: "pointer" }}
              onClick={() =>
                record.coin_family === 1
                  ? window.open(
                      `https://etherscan.io/address/${text}`,
                      "_blank"
                    )
                  : record.coin_family === 2
                  ? window.open(
                      `https://live.blockcypher.com/btc/address/${text}`,
                      "_blank"
                    )
                  : record.coin_family === 3
                  ? window.open(`https://bscscan.com/address/${text}`, "_blank")
                  : record.coin_family === 4
                  ? window.open(`https://solscan.io/address/${text}`, "_blank")
                  : record.coin_family === 5
                  ? window.open(
                      `https://cardanoscan.io/address/${text}`,
                      "_blank"
                    )
                  : record.coin_family === 6
                  ? window.open(
                      `https://polygonscan.com/address/${text}`,
                      "_blank"
                    )
                  : record.coin_family === 7
                  ? window.open(
                      `https://snowtrace.io/address/${text}`,
                      "_blank"
                    )
                  : record.coin_family === 8
                  ? window.open(
                      `https://cronoscan.com/address/${text}`,
                      "_blank"
                    )
                  : record.coin_family === 9
                  ? window.open(
                      `https://scan.pulsechain.com/address/${text}`,
                      "_blank"
                    )
                  : ""
              }
            >
              <p style={{ color: "#9f53ff" }}>
                {text === null ? "N/A" : truncate(`${text}`, 16)}
              </p>
            </u>
          </Tooltip>
        ) : (
          "--"
        ),
    },

    {
      title: "Transaction Hash  ",
      dataIndex: "tx_id",
      render: (text, record) =>
        text ? (
          <Tooltip title={<p>{text === null ? "N/A" : text || "N/A"}</p>}>
            <div>
              {
                <u
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    record.coin_family === 1
                      ? window.open(`https://etherscan.io/tx/${text}`, "_blank")
                      : record.coin_family === 2
                      ? window.open(
                          `https://live.blockcypher.com/btc/tx/${text}`,
                          "_blank"
                        )
                      : record.coin_family === 3
                      ? window.open(`https://bscscan.com/tx/${text}`, "_blank")
                      : record.coin_family === 4
                      ? window.open(`https://solscan.io/tx/${text}`, "_blank")
                      : record.coin_family === 5
                      ? window.open(
                          `https://cardanoscan.io/transaction/${text}`,
                          "_blank"
                        )
                      : record.coin_family === 6
                      ? window.open(
                          `https://polygonscan.com/tx/${text}`,
                          "_blank"
                        )
                      : record.coin_family === 7
                      ? window.open(`https://snowtrace.io/tx/${text}`, "_blank")
                      : record.coin_family === 8
                      ? window.open(
                          `https://cronoscan.com/tx/${text}`,
                          "_blank"
                        )
                      : record.coin_family === 9
                      ? window.open(
                          `https://scan.pulsechain.com/tx/${text}`,
                          "_blank"
                        )
                      : ""
                  }
                >
                  <p style={{ color: "#9f53ff" }}>
                    {text === null ? "N/A" : truncate(`${text}`, 16)}
                  </p>
                </u>
              }
            </div>
          </Tooltip>
        ) : (
          "--"
        ),
    },

    {
      title: "Transaction Status",
      dataIndex: "status",
      render: (text) => {
        let style;
        if (text == "completed") {
          style = { color: "green", fontWeight: "bold" };
        } else if (text == "failed") {
          style = { color: "red", fontWeight: "bold" };
        } else if (text == "pending") {
          style = { color: "orange", fontWeight: "bold" };
        } else {
          style = { color: "black", fontWeight: "bold" };
        } // Default color if none of the conditions match

        return text ? (
          <p style={style}>
            {text === null
              ? "N/A"
              : text.charAt(0).toUpperCase() + text.slice(1)}{" "}
          </p>
        ) : (
          "--"
        );
      },
    },

    {
      title: "Date and Time",
      dataIndex: "created_at",
      render: (text) => (
        <p>
          {text === null
            ? "N/A"
            : moment.utc(text).format("MM/DD/YYYY h:mm:ss A")}
        </p>
      ),
    },
  ];

  return (
    <div className="main_page_outer">
      <div className="empty"></div>
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
                  title="Seach by token name/ symbol/ address/ hash"
                  placeholder="Seach by token name/ symbol/ address/ hash"
                  className="form-control"
                  maxLength={100}
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

            <div className="select-filter custom-filter" id="custom-container">
              <Select
                getPopupContainer={() =>
                  document.getElementById("custom-container")
                }
                isSearchable={false}
                placeholder="Select any chain"
                options={select_blockchain}
                className=" heightFixSelect"
                onChange={(e) => onChangeBlockchainFilterHandler(e)}
                value={coin_family}
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
              <Button
                className="btn"
                type="primary"
                onClick={async () => {
                  setFromDate(null);
                  setToDate(null);
                  SetSearchData("");
                  setCoinFamily(0);
                  setEnableSearchButton(false);
                  await getTransactionsDataFn(null, null, null, null);
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>

        <>
          <Table
            pagination={false}
            columns={columns}
            rowKey={"id"}
            dataSource={TransactionsDetails}
            bordered
          />
          {TransactionsDetailsMeta?.total > 10 ? (
            <Pagination
              pageSize={perPage}
              showSizeChanger={false}
              current={currentPage}
              total={TransactionsDetailsMeta?.total}
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

export default Alchemy;
