import { Card, Col, Row } from "antd";
import React from "react";
import { formatNumberUSD } from "../../Helper/FormatNumber";

export default function TransactionTotal({ record }) {
  return (
    <div className="swapRevenue">
      <Row gutter={[16, 24]}>
        <Col xs={24} md={12} xl={8}>
          <Card
            title="Total Transactions "
            bordered={false}
            className="text-center"
          >
            <p className="user_number">
              {record?.total_records
                ? formatNumberUSD(record?.total_records)
                : "0"}
            </p>
          </Card>
        </Col>

        <Col xs={24} md={12} xl={8}>
          <Card title="Total Volume" bordered={false} className="text-center">
            <p className="user_number">
              ${" "}
              {record?.total_volume
                ? formatNumberUSD(record?.total_volume)
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
              {record?.total_volume_24hrs
                ? formatNumberUSD(record?.total_volume_24hrs)
                : "0.00"}
            </p>
          </Card>
        </Col>

        <Col xs={24} md={12} xl={8}>
          <Card
            title="Total Swap Earning"
            bordered={false}
            className="text-center"
          >
            <p className="user_number">
              ${" "}
              {record?.total_fee ? formatNumberUSD(record?.total_fee) : "0.00"}
            </p>
          </Card>
        </Col>
        <Col xs={24} md={12} xl={8}>
          <Card
            title="Total Swap Earning /24Hrs"
            bordered={false}
            className="text-center"
          >
            <p className="user_number">
              ${" "}
              {record?.total_fee_24hrs
                ? formatNumberUSD(record?.total_fee_24hrs)
                : "0.00"}
            </p>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
