import React, { useEffect, useState } from "react";
import { Spin, Table, Row, Col, Card } from "antd";
import "./Dashboard.scss";
import * as moment from "moment";
import { useDispatch } from 'react-redux';
import { useGetTransactionsDataMutation } from "../../Redux/services/TransactionsDetail/TransactionsDetailApiSlice";
import { useGetDeviceUserDataQuery } from "../../Redux/services/DashboardServicces/DashboardApiSlice";
import { setDeviceUsers } from "../../Redux/slice/DashboardDetailsSlice";
import Tooltip from "antd/es/tooltip";
import { encryption } from "../../common/encryption/encryption";
import { truncate } from "../../Helper/StringFormat";
import { formatCryptoAmount } from "../../Helper/FormatNumber";
import { handleUnauthorizedError } from "../../common/constant/constant";
import { setToast } from "../../Redux/slice/toastSlice";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [getTransactionsData, { isLoading }] = useGetTransactionsDataMutation();
  const [currentPage] = useState(1);
  const [transactionData, setTransactionData] = useState();
  const { data: DeviceUserData, refetch } = useGetDeviceUserDataQuery();
  const [deviceUsers, setDashboardUsers] = useState([]);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const getTransactionsDataFn = async () => {
    try {
      const enc = await encryption(JSON.stringify({ page: 1, limit: 5 }));
      const securedData = { dataString: enc };
      const response = await getTransactionsData(securedData);
      
      if (response?.data) {
        setTransactionData(response?.data?.data?.transaction_history);
      } else if (response.error) {
        // Check for 401 unauthorized error
        handleUnauthorizedError(response, dispatch, navigate, setToast);
      }
    } catch (error) {
      console.error("Error fetching transaction data:", error);
      // Handle any other errors
      if (error?.status === 401 || error?.data?.code === 401) {
        handleUnauthorizedError({ error: { status: 401 } }, dispatch, navigate, setToast);
      }
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
      }
    })();
  }, [DeviceUserData?.data]);

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
      render: (text) => (
        <p>
          {text?.coin_symbol === null ? "N/A" : text?.coin_symbol.toUpperCase()}
        </p>
      ),
    },
    {
      title: "Amount (In Crypto)",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => <p>{amount ? formatCryptoAmount(amount) : "N/A"}</p>,
    },
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
        let styleObj;
        if (text === "confirmed") {
          styleObj = { color: "green", fontWeight: "bold" };
        } else if (text === "failed") {
          styleObj = { color: "red", fontWeight: "bold" };
        } else if (text === "pending") {
          styleObj = { color: "orange", fontWeight: "bold" };
        } else {
          styleObj = { color: "black", fontWeight: "bold" };
        } // Default color if none of the conditions match

        return (
          <span className={`status-text ${text}`} style={styleObj}>
            {text === null
              ? "N/A"
              : text.charAt(0).toUpperCase() + text.slice(1)}{" "}
          </span>
        );
      },
    },
    {
      title: "Date and Time (UTC)",
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
            </div>

            <div className="dashbord_upper">
              <Row gutter={[16, 24]}>
                <Col sm={24} md={12} xl={6}>
                  <Card title="Newly Added Token" bordered={false}>
                    <p className="user_number">
                      {deviceUsers?.new_added_token || 'N/A'}
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
                    <p className="user_number">{deviceUsers?.total_wallets?.toLocaleString("en-US")}</p>
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
                className="dashboard-table"
              />
            </div>
          </div>
        </div>
      </Spin>
    </div>
  );
}

export default Dashboard;
