import React, { useEffect, useState } from "react";
import { Select } from "antd";
import "./Revenue.scss";

import TransactionTotal from "./transactionTotal.js";
import SwapVolume from "./swapVolume.js";
import SwapFee from "./swapFee.js";
import { useGetTotalVolumeDataMutation } from "../../Redux/services/revenue/bakingApiServices.js";

function Revenue() {
  const [records, setRecords] = useState(null);
  const [getTotalVolumeData, { isLoading }] = useGetTotalVolumeDataMutation();

  useEffect(() => {
    findData();
  }, []);

  const findData = async () => {
    let { data } = await getTotalVolumeData();
    setRecords(data?.data?.data);
  };

  return (
    <div className="main_page_outer">
      <TransactionTotal record={records?.totalTransactionVolumeFee} />
      <SwapVolume records={records?.data} />
      <SwapFee records={records?.data} />
    </div>
  );
}

export default Revenue;
