import { Col, Row, Tooltip } from "antd";
import React, { useEffect } from "react";
import CommonCard from "../../common/CommonCard/CommonCard";
import pulsechain from "../../Images/pulsechain.svg";
import bsc from "../../Images/bsc.svg";
import eth from "../../Images/eth.png";
import moment from "moment";
import history from "../../Images/history.svg";
import { useNavigate } from "react-router-dom";
import { formatNumberUSD } from "../../Helper/FormatNumber";

export default function SwapVolume({ records }) {
  const navigate = useNavigate();
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
      text: "Total Swap Volume",
      subText: `$ ${
        records?.ethRecord?.total_volume
          ? formatNumberUSD(records?.ethRecord?.total_volume)
          : "0.00"
      } USD`,
    },
    {
      text: (
        <div className="insect">
          24 Hour ({" "}
          <span
            className={
              records?.ethRecord?.fiat_1day_change > 0
                ? "green"
                : records?.ethRecord?.fiat_1day_change < 0
                ? "red"
                : "no"
            }
          >
            {records?.ethRecord?.fiat_1day_change
              ? formatNumberUSD(records?.ethRecord?.fiat_1day_change)
              : "0.00"}
            %
          </span>
          )
        </div>
      ),
      subText: `$ ${
        records?.ethRecord?.fiat_volume_24hrs
          ? formatNumberUSD(records?.ethRecord?.fiat_volume_24hrs)
          : "0.00"
      } USD`,
    },
    {
      text: (
        <div className="insect">
          7 Days (
          <span
            className={
              records?.ethRecord?.fiat_1week_change > 0
                ? "green"
                : records?.ethRecord?.fiat_1week_change < 0
                ? "red"
                : "no"
            }
          >
            {records?.ethRecord?.fiat_1week_change
              ? formatNumberUSD(Math.abs(records?.ethRecord?.fiat_1week_change))
              : "0.00"}
            %
          </span>
          )
        </div>
      ),
      subText: `$ ${
        records?.ethRecord?.fiat_volume_7days
          ? formatNumberUSD(records?.ethRecord?.fiat_volume_7days)
          : "0.00"
      } USD`,
    },
    {
      text: (
        <div className="insect">
          30 day
          <span
            className={
              records?.ethRecord?.fiat_30day_change > 0
                ? "green"
                : records?.ethRecord?.fiat_30day_change < 0
                ? "red"
                : "no"
            }
          >
            (
            {records?.ethRecord?.fiat_30day_change
              ? formatNumberUSD(Math.abs(records?.ethRecord?.fiat_30day_change))
              : "0.00"}
            %
          </span>
          )
        </div>
      ),
      subText: `$ ${
        records?.ethRecord?.fiat_volume_30days
          ? formatNumberUSD(records?.ethRecord?.fiat_volume_30days)
          : "0.00"
      } USD`,
    },
  ];
  const dataBsc = [
    {
      text: "Total Swap Volume",
      subText: `$ ${
        records?.bscRecord?.total_volume
          ? formatNumberUSD(records?.bscRecord?.total_volume)
          : "0.00"
      } USD`,
    },
    {
      text: (
        <div className="insect">
          24 Hour (
          <span
            className={
              records?.bscRecord?.fiat_1day_change > 0
                ? "green"
                : records?.bscRecord?.fiat_1day_change < 0
                ? "red"
                : "no"
            }
          >
            {records?.bscRecord?.fiat_1day_change
              ? formatNumberUSD(Math.abs(records?.bscRecord?.fiat_1day_change))
              : "0.00"}
            %
          </span>
          )
        </div>
      ),
      subText: `$ ${
        records?.bscRecord?.fiat_volume_24hrs
          ? formatNumberUSD(Math.abs(records?.bscRecord?.fiat_volume_24hrs))
          : "0.00"
      } USD`,
    },
    {
      text: (
        <div className="insect">
          7 Days ({" "}
          <span
            className={
              records?.bscRecord?.fiat_1week_change > 0
                ? "green"
                : records?.bscRecord?.fiat_1week_change < 0
                ? "red"
                : "no"
            }
          >
            {records?.bscRecord?.fiat_1week_change
              ? formatNumberUSD(Math.abs(records?.bscRecord?.fiat_1week_change))
              : "0.00"}
            %
          </span>
          )
        </div>
      ),
      subText: `$ ${
        records?.bscRecord?.fiat_volume_7days
          ? formatNumberUSD(records?.bscRecord?.fiat_volume_7days)
          : "0.00"
      } USD`,
    },
    {
      text: (
        <div className="insect">
          30 day (
          <span
            className={
              records?.bscRecord?.fiat_30day_change > 0
                ? "green"
                : records?.bscRecord?.fiat_30day_change < 0
                ? "red"
                : "no"
            }
          >
            {records?.bscRecord?.fiat_30day_change.toFixed(2)
              ? formatNumberUSD(Math.abs(records?.bscRecord?.fiat_30day_change))
              : "0.00"}
            %)
          </span>
        </div>
      ),
      subText: `$ ${
        records?.bscRecord?.fiat_volume_30days
          ? formatNumberUSD(Math.abs(records?.bscRecord?.fiat_volume_30days))
          : "0.00"
      } USD`,
    },
  ];
  const dataPls = [
    {
      text: "Total Swap Volume",
      subText: `$ ${
        records?.plsRecord?.total_volume
          ? formatNumberUSD(records?.plsRecord?.total_volume)
          : "0.00"
      } USD`,
    },
    {
      text: (
        <div className="insect">
          24 Hour (
          <span
            className={
              records?.plsRecord?.fiat_1day_change > 0
                ? "green"
                : records?.plsRecord?.fiat_1day_change < 0
                ? "red"
                : "no"
            }
          >
            {records?.plsRecord?.fiat_1day_change
              ? formatNumberUSD(Math.abs(records?.plsRecord?.fiat_1day_change))
              : "0.00"}
            %
          </span>
          )
        </div>
      ),
      subText: `$ ${
        records?.plsRecord?.fiat_volume_24hrs
          ? formatNumberUSD(Math.abs(records?.plsRecord?.fiat_volume_24hrs))
          : "0.00"
      } USD`,
    },
    {
      text: (
        <div className="insect">
          7 Days ({" "}
          <span
            className={
              records?.plsRecord?.fiat_1week_change > 0
                ? "green"
                : records?.plsRecord?.fiat_1week_change < 0
                ? "red"
                : "no"
            }
          >
            {records?.plsRecord?.fiat_1week_change
              ? formatNumberUSD(Math.abs(records?.plsRecord?.fiat_1week_change))
              : "0.00"}
            %
          </span>
          )
        </div>
      ),
      subText: `$ ${
        records?.plsRecord?.fiat_volume_7days
          ? formatNumberUSD(Math.abs(records?.plsRecord?.fiat_volume_7days))
          : "0.00"
      } USD`,
    },
    {
      text: (
        <div className="insect">
          30 day (
          <span
            className={
              records?.plsRecord?.fiat_30day_change > 0
                ? "green"
                : records?.plsRecord?.fiat_30day_change < 0
                ? "red"
                : "no"
            }
          >
            {records?.plsRecord?.fiat_30day_change
              ? formatNumberUSD(Math.abs(records?.plsRecord?.fiat_30day_change))
              : "0.00"}
            %)
          </span>
        </div>
      ),
      subText: `$ ${
        records?.plsRecord.fiat_volume_30days
          ? formatNumberUSD(Math.abs(records?.plsRecord.fiat_volume_30days))
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
      <h1>Swap Volume</h1>
      <div className="historydiv">
        <Tooltip title={<p>History</p>}>
          <img
            onClick={() => {
              navigate("/swapHistory");
            }}
            className="historyImg"
            src={history}
          />
        </Tooltip>
      </div>
      <Row gutter={[16, 24]}>
        {services &&
          services.map((detail, idx) => (
            <Col xs={24} md={12} xl={8} key={idx}>
              <CommonCard
                image={detail.img}
                heading={detail.heading}
                date={detail.date}
                text={detail.text}
                subText={detail.subText}
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
