import React, { useEffect, useState } from 'react';
import { Spin, Table, Button, Input, Pagination, Tooltip } from 'antd';
import * as moment from "moment";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from 'react-redux';
import Select from "react-select";

import { useGetTransactionListDataMutation } from "../../Redux/services/TransactionsDetail/TransactionsDetailApiSlice";
import { setTransactionListData } from "../../Redux/slice/TransactionDetailSlice";
import { truncate } from '../../Helper/StringFormat';
import { setToast } from "../../Redux/slice/toastSlice";
import "react-date-picker/dist/DatePicker.css";
import { select_blockchain } from '../../common/constant/constant';
import encryption  from "../../common/encryption/encryption";

function TransactionDetails() {
  const [checked, setChecked] = useState(true);
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
  const [tableData, setTableData] = useState([]);
  const [getTransactionsListData, { isLoading }] =
    useGetTransactionListDataMutation();

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
    if (coin_family > 0) {
      filter_data.coin_family = coin_family;
    }
    const enc = await encryption(JSON.stringify(filter_data));
    const securedData = { dataString: enc };
    await getTransactionsListData(securedData).then((res, err) => {
      if (res) {
        if (res?.data) {
          setTableData(res?.data?.data);
          dispatch(
            setTransactionListData(res?.data?.data?.transaction_history)
          );
          setSearch(false);
        } else {
        }
      }
    });
  };
  const onChangeBlockchainFilterHandler = (data) => {
    setCoinFamily(data?.value);
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

  const onChange = (e) => {
    setChecked(e.target.checked);
  };

  const label = `${
    checked
      ? "Enable this token for swapping"
      : "disable this token for swapping"
  }`;

  const [value] = useState("0.005");

  const columns = [
    {
      title: "S.No.",
      render: (item, record, index) => (
        <>{currentPage > 1 ? (currentPage - 1) * 10 + index + 1 : index + 1}</>
      ),
    },
    {
      title: " Token Name",
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
      render: (text) => (
        <p>
          {text?.coin_data?.coin_symbol === null
            ? "N/A"
            : text?.coin_data?.coin_symbol?.toUpperCase()}
        </p>
      ),

    },
    {
      title: "Amount (In Crypto)",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => <p>{amount || "N/A"}</p>,
    },

    //       
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
                : ""
            }
          >
            <p>{text === null ? "N/A" : truncate(`${text}`, 16)}</p>
          </u>
        </Tooltip>
      ),

    },
    {
      title: "Transaction Hash  ",
      dataIndex: "tx_id",
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
            {}
          </p>
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

    //             Action
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
              {}
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
                {}
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
          {}
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
