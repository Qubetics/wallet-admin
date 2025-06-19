import { Card, Col, Row, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import Transak from "./transak/transak";
import Alchemy from "./alchemy/alchemy";
import { useGetVolumeEarningMutation } from "../../Redux/services/revenue/bakingApiServices";
import { formatNumberUSD } from "../../Helper/FormatNumber";

export default function Blockchainswap() {
  const [activeTab, setActiveTab] = useState("ALCHEMY");
  const [getVolumeEarning, { data, isLoading }] = useGetVolumeEarningMutation();
  const items = [
    {
      key: "ALCHEMY",
      label: "Alchemy",
      children: <div>{activeTab == "ALCHEMY" && <Alchemy />}</div>,
    },
    {
      key: "TRANSAK",
      label: "Transak",
      children: <div>{activeTab == "TRANSAK" && <Transak />}</div>,
    },
  ];

  useEffect(() => {
    getVolumeData();
  }, [activeTab]);

  const getVolumeData = () => {
    let payload = { type1: "ALCHEMY", type2: "TRANSAK" };
    getVolumeEarning(payload);
  };

  return (
    <>
      <div className="revenue_card">
        <Row gutter={[16, 24]}>
          <Col xs={24} md={12} xl={8}>
            <Card title="Total Transactions" bordered={false}>
              <p className="user_number">
                {data?.data?.data?.total_records
                  ? formatNumberUSD(data?.data?.data?.total_records)
                  : "0.00"}
              </p>
            </Card>
          </Col>

          <Col xs={24} md={12} xl={8}>
            <Card title="Total Volume " bordered={false}>
              <p className="user_number">
                ${" "}
                {data?.data?.data?.total_volume
                  ? formatNumberUSD(data?.data?.data?.total_volume)
                  : "0.00"}
              </p>
            </Card>
          </Col>
          <Col xs={24} md={12} xl={8}>
            <Card title="Total Volume /24Hrs" bordered={false}>
              <p className="user_number">
                ${" "}
                {data?.data?.data?.total_volume_24hrs
                  ? formatNumberUSD(data?.data?.data?.total_volume_24hrs)
                  : "0.00"}
              </p>
            </Card>
          </Col>

          <Col xs={24} md={12} xl={8}>
            <Card title="Total Fees " bordered={false}>
              <p className="user_number">
                ${" "}
                {data?.data?.data?.total_fee
                  ? formatNumberUSD(data?.data?.data?.total_fee)
                  : "0.00"}
              </p>
            </Card>
          </Col>
          <Col xs={24} md={12} xl={8}>
            <Card title="Total Fees /24Hrs" bordered={false}>
              <p className="user_number">
                ${" "}
                {data?.data?.data?.total_fee_24hrs
                  ? formatNumberUSD(data?.data?.data?.total_fee_24hrs)
                  : "0.00"}
              </p>
            </Card>
          </Col>
        </Row>
      </div>
      <div>
        <br />
        <div className="empty"></div>
        <Tabs
          activeKey={activeTab}
          items={items}
          onChange={(e, d) => {
            setActiveTab(e);
          }}
        />
      </div>
    </>
  );
}
