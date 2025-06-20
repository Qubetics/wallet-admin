import React, { useEffect, useState } from "react";
import { Spin, Table, Row, Col, Card } from "antd";
import "./Dashboard.scss";
import * as moment from "moment";
import { exponentialToDecimal, truncate } from "../../Helper/StringFormat";
import { useDispatch, useSelector } from "react-redux";
import { useGetTransactionsDataMutation } from "../../Redux/services/TransactionsDetail/TransactionsDetailApiSlice";
import { setTransactionData } from "../../Redux/slice/TransactionDetailSlice";
import { useGetDeviceUserDataQuery } from "../../Redux/services/DashboardServicces/DashboardApiSlice";
import { setDeviceUsers } from "../../Redux/slice/DashboardDetailsSlice";
import Tooltip from "antd/es/tooltip";
import { formatNumberCrypto, formatNumberUSD } from "../../Helper/FormatNumber";
import encryption from "../../common/encryption/encryption";

function Dashboard() {
  const [getTransactionsData, { isLoading }] = useGetTransactionsDataMutation();
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionData, setTransactionData] = useState();
  const { data: DeviceUserData, refetch } = useGetDeviceUserDataQuery();
  const [deviceUsers, setDashboardUsers] = useState([]);
  let TransactionsDetails = useSelector(
    (state) => state?.TransactionData?.data
  );
  console.log("TransactionsDetails", transactionData);
  let DashBoardList = useSelector((state) => state?.DashboardList?.DeviceUsers);

  const dispatch = useDispatch();

  const getTransactionsDataFn = async () => {
    try {
      const enc = await encryption(JSON.stringify({ page: 1, limit: 5 }));
      const securedData = { dataString: enc };
      const res = await getTransactionsData(securedData);
      if (res && res.data) {
        console.log("res?.data?.data >>.", res?.data?.data);
        setTransactionData(res?.data?.data?.transaction_history);
        // dispatch(setTransactionData(res?.data?.data));
      }
    } catch (err) {
      console.error("Error fetching transaction data:", err);
    }
  };

  useEffect(() => {
    (() => {
      getTransactionsDataFn();
      refetch();
    })();
  }, [dispatch]);

  useEffect(() => {
    (async () => {
      try {
        const GetDeviceUserData = await DeviceUserData;
        if (GetDeviceUserData) {
          setDashboardUsers(GetDeviceUserData?.data);
          dispatch(setDeviceUsers(GetDeviceUserData?.data?.data));
        }
      } catch {
        console.log("error");
      }
    })();
  }, [DeviceUserData?.data]);

  const calculateUsedAmount = (amount, trxn_fiat_price_detail) => {
    let usd_amount = 0;
    if (trxn_fiat_price_detail?.length > 0) {
      let filter_price_data = trxn_fiat_price_detail.filter(
        (data) => data.fiat_currency.toLowerCase() === "usd"
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
      dataIndex: "coin_data",
      // key: 'coin_data',
      render: (text) => <p>{text?.coin_name}</p>,
    },
    {
      title: " Token Symbol",
      dataIndex: "coin_data",
      // render: (text) => <p>{text?.coin_symbol === null ? "N/A" : text?.coin_symbol.charAt(0).toUpperCase() +
      // text?.coin_symbol.slice(1)}</p>,
      render: (text) => (
        <p>
          {text?.coin_symbol === null ? "N/A" : text?.coin_symbol.toUpperCase()}
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
    //   title: 'Fiat Amount',
    //   // dataIndex: "amount",
    //   // key: "amount",
    //   render: (text) => (
    //     <p>
    //       {formatNumberUSD(
    //         calculateUsedAmount(text?.amount, text?.trxn_fiat_price_detail)
    //       )}
    //     </p>
    //   ),
    // },
    // {
    //   title: 'Fiat Currency Name ',
    //   // dataIndex: "amount",
    //   // key: "amount",
    //   render: (text) => <p>{'USD'}</p>,
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
      dataIndex: "blockchain_status",
      key: "status",
      render: (text) => {
        let style;
        if (text === "confirmed") {
          style = { color: "green", fontWeight: "bold" };
        } else if (text === "failed") {
          style = { color: "red", fontWeight: "bold" };
        } else if (text === "pending") {
          style = { color: "orange", fontWeight: "bold" };
        } else {
          style = { color: "black", fontWeight: "bold" };
        } // Default color if none of the conditions match

        return (
          <p style={style}>
            {text === null
              ? "N/A"
              : text.charAt(0).toUpperCase() + text.slice(1)}{" "}
          </p>
        );
      },
    },
    {
      title: "Date and Time",
      dataIndex: "created_at",
      key: "Date and Time",
      render: (text) => (
        <p>
          {text === null
            ? "N/A"
            : // : moment.utc(text).local().format('MM/DD/YYYY h:mm:ss A')}
              moment.utc(text).format("MM/DD/YYYY h:mm:ss A")}
        </p>
      ),
    },
  ];

  return (
    <div className="main_page_outer">
      <Spin
        spinning={isLoading}
        className="spininner"
        tip="Loading..."
        size="large"
      >
        <div className="dashboardSec__dashBoardHeading">
          <div className="dashboardSec">
            <div className="dashbord_upper">
              {/* <Row gutter={16}>
                <Col span={24}>
                  <Card className="text-center" title="Markup Fees">
                    <Row className="swap">
                      <Col span={4}>
                        <h4>
                          PanCake-Swap (BSC) -{' '}
                          <span>
                            {' '}
                            {DashBoardList?.bnb_network_fees
                              ? DashBoardList?.bnb_network_fees
                              : 0}
                            %
                          </span>
                        </h4>
                      </Col>
                      <Col span={4}>
                        <h4>
                          Uni-Swap (ETH) -{' '}
                          <span>
                            {DashBoardList?.eth_network_fees
                              ? DashBoardList?.eth_network_fees
                              : 0}
                            %
                          </span>
                        </h4>
                      </Col>
                      <Col span={4}>
                        <h4>
                          PulseX-Swap (PLS) -{' '}
                          <span>
                            {DashBoardList?.pls_network_fees
                              ? DashBoardList?.pls_network_fees
                              : 0}
                            %
                          </span>
                        </h4>
                      </Col>
                      <Col span={4}>
                        <h4>
                          Solana-Swap (SOL) -{' '}
                          <span>
                            {DashBoardList?.sol_network_fees
                              ? DashBoardList?.sol_network_fees
                              : 0}
                            %
                          </span>
                        </h4>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row> */}
            </div>

            <div className="dashbord_upper">
              <Row gutter={[16, 24]}>
                <Col sm={24} md={12} xl={6}>
                  <Card title="Newly Added Token" bordered={false}>
                    <p className="user_number">
                      {deviceUsers?.new_added_token}
                      {/* {`${DashBoardList?.newly_added_token?.coin_name
                        ? DashBoardList?.newly_added_token?.coin_name
                        : '0'
                        }`} */}
                    </p>
                  </Card>
                </Col>
                <Col sm={24} md={12} xl={6}>
                  <Card title="Daily Active Users" bordered={false}>
                    <p className="user_number">
                      {deviceUsers?.daily_active_users}
                    </p>
                  </Card>
                </Col>
                <Col sm={24} md={12} xl={6}>
                  <Card title="Monthly Active Users" bordered={false}>
                    <p className="user_number">
                      {deviceUsers?.monthly_active_users}
                    </p>
                  </Card>
                </Col>
                <Col sm={24} md={12} xl={6}>
                  <Card title="Total Wallets" bordered={false}>
                    <p className="user_number">{deviceUsers?.total_wallets}</p>
                  </Card>
                </Col>
              </Row>
            </div>

            <div className="">
              <Table
                pagination={false}
                columns={columns}
                rowKey={"id"}
                dataSource={transactionData}
                bordered
              />
            </div>
          </div>
        </div>
      </Spin>
    </div>
  );
}

export default Dashboard;
