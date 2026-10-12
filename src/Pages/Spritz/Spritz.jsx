import { Card, Col, Row, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import "./Spritz.scss";
import Banking from "./banking";
import BillPay from "./billPay";
import { useGetSpritzVolumeMutation } from "../../Redux/services/revenue/bakingApiServices";
import { formatNumberUSD } from "../../Helper/FormatNumber";

function Spritz() {
  const [activeTab, setActiveTab] = useState("banking");
  const [getSpritzVolume, { data, isLoading }] = useGetSpritzVolumeMutation();

  useEffect(() => {
    getData();
  }, [activeTab]);

  const getData = () => {
    getSpritzVolume();
  };
  const itemsss = [
    {
      key: "banking",
      label: "Withdraw",
      children: <div>{activeTab == "banking" && <Banking />}</div>,
    },
    {
      key: "billPay",
      label: "Bill Pay",
      children: <div>{activeTab == "billPay" && <BillPay />}</div>,
    },
  ];

  return (
    <>
      <div className="revenue_card">
        <Row gutter={[16, 24]}>
          <Col xs={24} md={12} xl={8}>
            <Card title="Total Users Registerd" bordered={false}>
              <p className="user_number">
                {formatNumberUSD(data?.data?.data?.spritz_user_count)}
              </p>
            </Card>
          </Col>
          <Col xs={24} md={12} xl={8}>
            <Card
              title="Total Transactions "
              bordered={false}
              className="text-center"
            >
              <p className="user_number">
                {formatNumberUSD(data?.data?.data?.total_records)}
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
            <Card title="Total Fees" bordered={false}>
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
      <div className="dashbord_upper">
      </div>
      <Tabs
        defaultActiveKey="banking"
        items={itemsss}
        onChange={(e) => {
          setActiveTab(e);
        }}
      />
    </>
  );
}

export default Spritz;
