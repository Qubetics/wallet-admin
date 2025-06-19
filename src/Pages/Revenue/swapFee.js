import { Col, Row } from "antd";
import React, { useEffect } from "react";
import CommonCard from "../../common/CommonCard/CommonCard";
import pulsechain from "../../Images/pulsechain.svg";
import bsc from "../../Images/bsc.svg";
import eth from "../../Images/eth.png";
import moment from "moment";
import { formatNumberUSD } from "../../Helper/FormatNumber";

export default function SwapFee({ records }) {
  const services = [
    {
      id: 1,
      img: eth,
      heading: "Ethereum",
      date: `(Since ${moment().subtract("months", 1).format("MM/DD/YYYY")})`,
    },
    {
      id: 3,
      img: bsc,
      heading: "BNB Smart Chain (BSC)",
      date: `(Since ${moment().subtract("months", 1).format("MM/DD/YYYY")})`,
    },
    {
      id: 9,
      img: pulsechain,
      heading: "PulseChain",
      date: `(Since ${moment().subtract("months", 1).format("MM/DD/YYYY")})`,
    },
  ];

  const dataEth = [
    {
      text: "Total Swap Fee",
      subText: `$ ${
        records?.ethRecord?.total_fee
          ? formatNumberUSD(records?.ethRecord?.total_fee)
          : "0.00"
      } USD`,
    },
    {
      text: (
        <div className="insect">
          24 Hour (
          <span
            className={
              records?.ethRecord?.fee_1day_change > 0
                ? "green"
                : records?.ethRecord?.fee_1day_change < 0
                ? "red"
                : "neutral"
            }
          >
            {records?.ethRecord?.fee_1day_change
              ? formatNumberUSD(records?.ethRecord?.fee_1day_change)
              : "0.00"}
            %
          </span>
          )
        </div>
      ),
      subText: `$ ${
        records?.ethRecord?.fiat_fee_24hrs
          ? formatNumberUSD(records?.ethRecord?.fiat_fee_24hrs)
          : "0.00"
      } USD`,
    },
    {
      text: (
        <div className="insect">
          7 Days (
          <span
            className={
              records?.ethRecord?.fee_1week_change > 0
                ? "green"
                : records?.ethRecord?.fee_1week_change < 0
                ? "red"
                : "neutral"
            }
          >
            {records?.ethRecord?.fee_1week_change
              ? formatNumberUSD(Math.abs(records?.ethRecord?.fee_1week_change))
              : "0.00"}
            %
          </span>
          )
        </div>
      ),
      subText: `$ ${
        records?.ethRecord?.fiat_fee_7days
          ? formatNumberUSD(Math.abs(records?.ethRecord?.fiat_fee_7days))
          : "0.00"
      } USD`,
    },
    {
      text: (
        <div className="insect">
          30 day (
          <span
            className={
              records?.ethRecord?.fee_30day_change > 0
                ? "green"
                : records?.ethRecord?.fee_30day_change < 0
                ? "red"
                : "neutral"
            }
          >
            {records?.ethRecord?.fee_30day_change
              ? formatNumberUSD(Math.abs(records?.ethRecord?.fee_30day_change))
              : "0.00"}
            %
          </span>
          )
        </div>
      ),
      subText: `$ ${
        records?.ethRecord?.fiat_fee_30days
          ? formatNumberUSD(Math.abs(records?.ethRecord?.fiat_fee_30days))
          : "0.00"
      } USD`,
    },
  ];

  const dataBsc = [
    {
      text: "Total Swap Fee",
      subText: `$ ${
        records?.bscRecord?.total_fee
          ? formatNumberUSD(Math.abs(records?.bscRecord?.total_fee))
          : "0.00"
      } USD`,
    },
    {
      text: (
        <div className="insect">
          24 Hour (
          <span
            className={
              records?.bscRecord?.fee_1day_change > 0
                ? "green"
                : records?.bscRecord?.fee_1day_change < 0
                ? "red"
                : "neutral"
            }
          >
            {records?.bscRecord?.fee_1day_change
              ? formatNumberUSD(Math.abs(records?.bscRecord?.fee_1day_change))
              : "0.00"}
            %
          </span>
          )
        </div>
      ),
      subText: `$ ${
        records?.bscRecord?.fiat_fee_24hrs
          ? formatNumberUSD(Math.abs(records?.bscRecord?.fiat_fee_24hrs))
          : "0.00"
      } USD`,
    },
    {
      text: (
        <div className="insect">
          7 Days (
          <span
            className={
              records?.bscRecord?.fee_1week_change > 0
                ? "green"
                : records?.bscRecord?.fee_1week_change < 0
                ? "red"
                : "neutral"
            }
          >
            {records?.bscRecord?.fee_1week_change
              ? formatNumberUSD(Math.abs(records?.bscRecord?.fee_1week_change))
              : "0.00"}
            %
          </span>{" "}
          )
        </div>
      ),
      subText: `$ ${
        records?.bscRecord?.fiat_fee_7days
          ? formatNumberUSD(Math.abs(records?.bscRecord?.fiat_fee_7days))
          : "0.00"
      } USD`,
    },
    {
      text: (
        <div className="insect">
          30 day (
          <span
            className={
              records?.bscRecord?.fee_30day_change > 0
                ? "green"
                : records?.bscRecord?.fee_30day_change < 0
                ? "red"
                : "neutral"
            }
          >
            {records?.bscRecord?.fee_30day_change
              ? formatNumberUSD(Math.abs(records?.bscRecord?.fee_30day_change))
              : "0.00"}
            %
          </span>
          )
        </div>
      ),
      subText: `$ ${
        records?.bscRecord?.fiat_fee_30days
          ? formatNumberUSD(Math.abs(records?.bscRecord?.fiat_fee_30days))
          : "0.00"
      } USD`,
    },
  ];
  const dataPls = [
    {
      text: "Total Swap Fee",
      subText: `$ ${
        records?.plsRecord?.total_fee
          ? formatNumberUSD(Math.abs(records?.plsRecord?.total_fee))
          : "0.00"
      } USD`,
    },
    {
      text: (
        <div className="insect">
          24 Hour (
          <span
            className={
              records?.plsRecord?.fee_1day_change > 0
                ? "green"
                : records?.plsRecord?.fee_1day_change < 0
                ? "red"
                : "neutral"
            }
          >
            {records?.plsRecord?.fee_1day_change
              ? formatNumberUSD(Math.abs(records?.plsRecord?.fee_1day_change))
              : "0.00"}
            %
          </span>{" "}
          )
        </div>
      ),
      subText: `$ ${
        records?.plsRecord?.fiat_fee_24hrs
          ? formatNumberUSD(Math.abs(records?.plsRecord?.fiat_fee_24hrs))
          : "0.00"
      } USD`,
    },
    {
      text: (
        <div className="insect">
          7 Days ({" "}
          <span
            className={
              records?.plsRecord?.fee_1week_change > 0
                ? "green"
                : records?.plsRecord?.fee_1week_change < 0
                ? "red"
                : "neutral"
            }
          >
            {records?.plsRecord?.fee_1week_change
              ? formatNumberUSD(Math.abs(records?.plsRecord?.fee_1week_change))
              : "0.00"}
            %
          </span>
          )
        </div>
      ),
      subText: `$ ${
        records?.plsRecord?.fiat_fee_7days
          ? formatNumberUSD(Math.abs(records?.plsRecord?.fiat_fee_7days))
          : "0.00"
      } USD`,
    },
    {
      text: (
        <div className="insect">
          30 day ({" "}
          <span
            className={
              records?.plsRecord?.fee_30day_change > 0
                ? "green"
                : records?.plsRecord?.fee_30day_change < 0
                ? "red"
                : "neutral"
            }
          >
            {records?.plsRecord?.fee_30day_change
              ? formatNumberUSD(Math.abs(records?.plsRecord?.fee_30day_change))
              : "0.00"}
            %
          </span>
          )
        </div>
      ),
      subText: `$ ${
        records?.plsRecord.fiat_fee_30days
          ? formatNumberUSD(Math.abs(records?.plsRecord.fiat_fee_30days))
          : "0.00"
      } USD`,
    },
  ];

  useEffect(() => {
    setListData();
  }, []);

  const setListData = async () => {};

  return (
    <div className="swapVolume">
      <h1>Swap Fee</h1>
      <Row gutter={[16, 24]}>
        {services.map((detail, idx) => (
          <Col xs={24} md={16} xl={8} key={idx}>
            <CommonCard
              image={detail.img}
              heading={detail.heading}
              date={detail.date}
              text={detail.text}
              subText={detail.subText}
              valuetext={detail.valuetext}
              data={
                detail?.id == 1
                  ? dataEth
                  : detail?.id == 3
                  ? dataBsc
                  : detail?.id == 9
                  ? dataPls
                  : []
              }
            />
          </Col>
        ))}
      </Row>
    </div>
  );
}
