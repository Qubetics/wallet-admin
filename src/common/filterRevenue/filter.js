import React from "react";
import { Button, Dropdown, Input, Menu, Space } from "antd";

export default function FilterComponent({
  handleMenuClick,
  dispatchFilter,
  filterState,
  searchData,
}) {
  const items = [
    {
      label: "Deposit",
      key: "deposit",
    },
    {
      label: "Withdraw",
      key: "withdraw",
    },
  ];

  const itemsStatus = [
    {
      label: "Completed",
      key: "completed",
    },
    {
      label: "Pending",
      key: "pending",
    },
    {
      label: "Canceled",
      key: "canceled",
    },
    {
      label: "Rejected",
      key: "rejected",
    },
  ];

  return (
    <div className="topper">
      <div className="headerTopSec">
        <div
          className="form-group reactDatePicker"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <label
            htmlFor=""
            style={{ color: "#000", fontWeight: "bold" }}
            className="labelHead"
          >
            From Date
          </label>
          <Input
            type="date"
            style={{ cursor: "text", textTransform: "uppercase" }}
            className="form-control"
            onChange={(e) => {
              dispatchFilter({ type: "fromDate", payload: e.target.value });
            }}
          />
        </div>
        <div
          className="form-group reactDatePicker"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <label
            htmlFor=""
            style={{ color: "#000", fontWeight: "bold" }}
            className="labelHead"
          >
            To Date
          </label>
          <div style={{ cursor: "pointer" }}>
            <Input
              type="date"
              value={filterState?.toDate}
              className="form-control"
              defaultValue="DD-MM-YYYY"
              style={{ cursor: "text", textTransform: "uppercase" }}
              onChange={(e) => {
                dispatchFilter({ type: "toDate", payload: e.target.value });
              }}
            />
          </div>
        </div>

        <div
          className="form-group searchBox"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <label
            htmlFor=""
            style={{ color: "#000", fontWeight: "bold" }}
            className="labelHead"
          >
            Search
          </label>
          <Input
            type="text"
            title="Search by token name/ symbol/ address/ hash"
            placeholder="Search by token name/ symbol/ address/ hash"
            className="form-control"
            maxLength={100}
            onChange={(e) => {
              dispatchFilter({ type: "search", payload: e.target.value });
            }}
          />
        </div>
      </div>
      {/* <div>
        <div className="select-Design firstSelect addStyle_select">
          <Dropdown menu={menuPropsType}>
            <Button style={{ width: "140px" }}>
              <Space>Type</Space>
            </Button>
          </Dropdown>
        </div>
      </div>
      <div>
        <div className="select-Design firstSelect addStyle_select">
          <Dropdown menu={menuPropsStatus}>
            <Button style={{ width: "140px" }}>
              <Space>Status</Space>
            </Button>
          </Dropdown>
        </div>
      </div> */}

      <div>
        <div className="select-Design firstSelect addStyle_select">
          <Dropdown
            overlay={
              <Menu onClick={(e) => handleMenuClick(e, "type")}>
                {items.map((item) => (
                  <Menu.Item key={item.key}>{item.label}</Menu.Item>
                ))}
              </Menu>
            }
          >
            <Button style={{ width: "140px" }}>
              <Space>Type</Space>
            </Button>
          </Dropdown>
        </div>
      </div>
      <div>
        <div className="select-Design firstSelect addStyle_select">
          <Dropdown
            overlay={
              <Menu onClick={(e) => handleMenuClick(e, "status")}>
                {itemsStatus.map((item) => (
                  <Menu.Item key={item.key}>{item.label}</Menu.Item>
                ))}
              </Menu>
            }
          >
            <Button style={{ width: "140px" }}>
              <Space>Status</Space>
            </Button>
          </Dropdown>
        </div>
      </div>

      <div className="searchInput">
        <Button
          className="btn"
          type="primary"
          onClick={() => {
            searchData();
          }}
        >
          Search
        </Button>
      </div>
    </div>
  );
}
