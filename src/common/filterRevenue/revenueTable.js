import { Spin, Table } from "antd";
import React, { useEffect } from "react";
import { useGetBankingDataMutation } from "../../Redux/services/revenue/bakingApiServices";
import { useDispatch } from "react-redux";

export default function RevenueTable({ filter, activeTab }) {
  const dispatch = useDispatch();
  const [getBankingData, { isLoading }] = useGetBankingDataMutation();
  const bankingData = [
    {
      key: "1",
      name: "Mike",
      age: 32,
      address: "10 Downing Street",
      amount: "1000",
      hash: "#17319",
      status: "Status",
    },
  ];

  const columns = [
    {
      title: "Email Address",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Transaction Type",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Hash",
      dataIndex: "hash",
      key: "hash",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
  ];

  useEffect(() => {
    if (activeTab == "banking") {
      bankingList();
    }
  }, [filter]);

  const bankingList = () => {
    try {
      let data = getBankingData(filter);
    } catch (error) {}
  };
  return (
    <Spin spinning={isLoading}>
      <Table
        pagination={false}
        dataSource={bankingData}
        columns={columns}
        bordered
        rowKey={"id"}
      />
    </Spin>
  );
}
