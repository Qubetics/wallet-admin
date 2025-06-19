import React, { useEffect } from "react";
import { Card, Col, Row } from "antd";
import SwftTrnx from "./SwftTrx";
import { useGetVolumeEarningMutation } from "../../../Redux/services/revenue/bakingApiServices";
import { formatNumberUSD } from "../../../Helper/FormatNumber";

function Swft() {
  const [getVolumeEarning, { data }] = useGetVolumeEarningMutation();

  useEffect(() => {
    getVolumeData();
  }, []);

  const getVolumeData = () => {
    let payload = { type1: "swftc" };
    getVolumeEarning(payload);
  };

  return (
    <>
      <div className="revenue_card">
        <Row gutter={[16, 24]}>
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
            <Card title="Total Volume" bordered={false} className="text-center">
              <p className="user_number">
                ${" "}
                {data?.data?.data?.total_volume
                  ? formatNumberUSD(data?.data?.data?.total_volume)
                  : "0.00"}
              </p>
            </Card>
          </Col>
          <Col xs={24} md={12} xl={8}>
            <Card
              title="Total Volume /24Hrs"
              bordered={false}
              className="text-center"
            >
              <p className="user_number">
                ${" "}
                {data?.data?.data?.total_volume_24hrs
                  ? formatNumberUSD(data?.data?.data?.total_volume_24hrs)
                  : "0.00"}
              </p>
            </Card>
          </Col>

          <Col xs={24} md={12} xl={8}>
            <Card title="Total Fees" bordered={false} className="text-center">
              <p className="user_number">
                ${" "}
                {data?.data?.data?.total_fee
                  ? formatNumberUSD(data?.data?.data?.total_fee)
                  : "0.00"}
              </p>
            </Card>
          </Col>

          <Col xs={24} md={12} xl={8}>
            <Card
              title="Total Fees /24Hrs"
              bordered={false}
              className="text-center"
            >
              <p className="user_number">
                ${" "}
                {data?.data?.data?.total_fee_24hrs
                  ? formatNumberUSD(data?.data?.data?.total_fee_24hrs)
                  : "0.00"}
              </p>
            </Card>
          </Col>
        </Row>

        <div className="dashbord_upper">
          <SwftTrnx />
        </div>
      </div>
    </>
  );
}

export default Swft;
