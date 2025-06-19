import React, { useEffect, useState } from "react";
import {
  Spin,
  Table,
  message,
  Switch,
  Pagination,
  Button,
  Dropdown,
  InputNumber,
  Image,
  Modal,
} from "antd";
import { useNavigate } from "react-router-dom";
import { ExclamationCircleFilled } from "@ant-design/icons";
import {
  // useGetTransactionsRequestMutation,
  useActionEnableDisableMutation,
  useSwapActionMutation,
  useGetDefaultTokenListMutation,
  useMakeRemoveDefaultTokenMutation,
} from "../../Redux/services/TransactionsDetail/TransactionsDetailApiSlice";
// import { setRequestList } from "../../Redux/slice/TransactionDetailSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  // setRequestList,
  // setRequestListMeta,
  setDefaultTokenList,
  setDefaultTokenMeta,
} from "../../Redux/slice/TransactionRequestSlice";
import { setToast } from "../../Redux/slice/toastSlice";
// import ModalforTransaction from "./ModalforTransaction";
import moment from "moment";
import UploadTokenModal from "../TokenManagement/UploadTokenModal";
import not_image_available from "../../Images/not_image_available.jpg";
import { CONFIG } from "../../common/constant/constant";

const { confirm } = Modal;

function DefaultTokenManagement() {
  const navigate = useNavigate();
  const onChange = (value) => {};
  const permission_type = sessionStorage.getItem("permission_type");

  // const [value, setValue] = useState("0.005");
  // const [page,setPage] =useState('0')
  const [perPage, setPage] = useState(10);
  const [action, setAction] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [disableToggleSwap, setDisableToggleSwap] = useState(false);

  // const [swapData, setSwapData] = useState();
  const [editTokenName, setEditTokenName] = useState("");
  const [EditModalOpen, setEditModalOpen] = useState(false);

  // const [editRank, setEditRank] = useState(0);
  const [editAction, setEditAction] = useState("");
  const [editTokenTitle, setEditTokenTitle] = useState("");
  const [editTokenRank, setEditTokenRank] = useState(0);
  const [TokenId, setTokenId] = useState(0);

  // const [getTransactionsRequest, { isLoading }] =
  //   useGetTransactionsRequestMutation();
  const [getDefaultTokenList, { isLoading }] = useGetDefaultTokenListMutation();
  const [swapAction, {}] = useSwapActionMutation();
  const [ActionEnableDisable, {}] = useActionEnableDisableMutation();
  const [MakeRemoveDefaultToken, {}] = useMakeRemoveDefaultTokenMutation();

  const dispatch = useDispatch();

  const RequestDetails = useSelector(
    (state) => state?.TransactionList?.defaultTokenList
  );
  const RequestListMeta = useSelector(
    (state) => state?.TransactionList?.defaultTokenMeta
  );

  const IpData = useSelector((state) => state?.userState?.ipData);

  const getDefaultTokenListFn = async () => {
    await getDefaultTokenList({ page: currentPage, limit: perPage }).then(
      (res, err) => {
        if (res?.data?.data) {
          dispatch(setDefaultTokenList(res?.data?.data?.data));
          dispatch(setDefaultTokenMeta(res?.data?.data?.meta));
        } else {
          if (res?.error?.status == "FETCH_ERROR") {
            getDefaultTokenListFn();
          }
        }
      }
    );
  };

  useEffect(() => {
    (() => {
      getDefaultTokenListFn();
    })();
  }, [dispatch, currentPage]);

  useEffect(() => {
    (() => {
      if (action !== "") {
        getDefaultTokenListFn();
      }
    })();
  }, [dispatch, action]);

  const onChangeSwitch = async (data) => {
    confirm({
      title:
        data.allow_swap_status == 1
          ? "Do you want to on this token for swap?"
          : "Do you want to off this token for swap?",
      icon: <ExclamationCircleFilled />,
      centered: true,
      onOk() {
        setDisableToggleSwap(true);
        setAction("");
        swapAction(data).then(async (res, err) => {
          if (res?.data?.data?.status) {
            setDisableToggleSwap(false);
            setAction("token_swap_on_off");
            // setSwapData(data);
            // setAction("swap_token");
            dispatch(
              setToast({ message: `${res?.data?.data?.message}`, status: true })
            );
          } else {
            if (!res?.error?.data?.status && res?.error?.data?.message) {
              dispatch(
                setToast({
                  message: `${res?.error?.data?.message}`,
                  status: false,
                })
              );
            } else {
              dispatch(
                setToast({ message: `Something went wrong`, status: false })
              );
            }
            setDisableToggleSwap(false);
          }
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  const handlePagenationChange = (event) => {
    setCurrentPage(event);
    // getTokenDataFn(fromDate, toDate, SearchData);
  };
  const handleEditTokenCancel = (value, action) => {
    setEditModalOpen(value);
    if (action != "") {
      setAction(action);
    }
  };
  const showConfirm = (e, parsedValue) => {
    setAction("");
    if (e.key === "1" && parsedValue) {
      confirm({
        title: "Do you want to enable this token?",
        icon: <ExclamationCircleFilled />,
        centered: true,
        onOk() {
          // let enableValue ={id:'1',token_status:'inactive'}
          let disableValue = {
            id: parsedValue?.id,
            token_status: "active",
            ip_address: IpData?.ip,
          };

          ActionEnableDisable(disableValue).then((res, err) => {
            setAction("enable_token");
            if (res?.data?.data?.status) {
              // toast(`${res?.data?.data?.message}`);
              dispatch(
                setToast({
                  message: `${res?.data?.data?.message}`,
                  status: true,
                })
              );
            } else {
              dispatch(
                setToast({
                  message: `${res?.error?.data?.message}`,
                  status: false,
                })
              );
              // setTimeout(toast(`${res?.error?.data?.message}`), 3000);
            }
          });
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    } else if (e.key === "2" && parsedValue) {
      confirm({
        title: "Do you want to disable this token?",
        icon: <ExclamationCircleFilled />,
        centered: true,
        onOk() {
          let disableValue = {
            id: parsedValue?.id,
            token_status: "inactive",
            ip_address: IpData?.ip,
          };

          ActionEnableDisable(disableValue).then((res, err) => {
            setAction("disable_token");

            if (res?.data?.data?.status) {
              // toast(`${res?.data?.data?.message}`);
              dispatch(
                setToast({
                  message: `${res?.data?.data?.message}`,
                  status: true,
                })
              );
            } else {
              // setTimeout(toast(`${res?.error?.data?.message}`), 3000);
              dispatch(
                setToast({
                  message: `${res?.error?.data?.message}`,
                  status: false,
                })
              );
            }
          });
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    } else if (e.key === "4" && parsedValue) {
      setTokenId(parsedValue?.id);
      setEditTokenName(parsedValue?.coin_name);
      setEditAction("edit_token_name");
      setEditTokenTitle("Edit Token Name");
      setEditModalOpen(true);
      // setAction('');
    } else if (e.key === "5" && parsedValue) {
      confirm({
        title: "Do you want to remove this token from default token list?",
        icon: <ExclamationCircleFilled />,
        centered: true,
        onOk() {
          let disableValue = {
            id: parsedValue?.id,
            is_default: 0,
            ip_address: IpData?.ip,
          };
          MakeRemoveDefaultToken(disableValue).then((res, err) => {
            setAction("default_token");
            if (res?.data?.data?.status) {
              // toast(`${res?.data?.data?.message}`);
              dispatch(
                setToast({
                  message: `${res?.data?.data?.message}`,
                  status: true,
                })
              );
            } else {
              dispatch(
                setToast({
                  message: `${res?.error?.data?.message}`,
                  status: false,
                })
              );
              // setTimeout(toast(`${res?.error?.data?.message}`), 3000);
            }
          });
        },
        onCancel() {
          console.log("Cancel");
        },
      });
      // setTokenId(parsedValue?.id);
      // setEditRank(parsedValue?.rank);
      // setEditTokenName("");
      // setEditAction('edit_token_rank');
      // setEditTokenTitle('Edit Token Order')
      // setEditModalOpen(true);
    } else if (e.key === "6" && parsedValue) {
      setTokenId(parsedValue?.id);
      setEditTokenRank(parsedValue?.rank);
      setEditAction("edit_token_rank");
      setEditTokenTitle("Edit Token Rank");
      setEditModalOpen(true);
      // setAction('');
    } else if (parsedValue) {
      setTokenId(parsedValue?.id);
      setEditAction("edit_token_image");
      setEditTokenTitle("Upload Token Image");
      setEditModalOpen(true);
      // setAction('');
    }
  };
  const redirectToExplorer = (coinFamily, contractAddress) => {
    let explorerUrl;

    switch (coinFamily) {
      case 1: // Ethereum
        explorerUrl = `https://etherscan.io/address/${contractAddress}`;
        break;
      case 3: // Binance Smart Chain
        explorerUrl = `https://bscscan.com/address/${contractAddress}`;
        break;
      case 4: // Solana
        explorerUrl = `https://explorer.solana.com/address/${contractAddress}`;
        break;
      case 5: // Cardano
        explorerUrl = `https://cardanoscan.io/token/${contractAddress}`;
        break;
      case 6: // Polygon
        explorerUrl = `https://polygonscan.com/address/${contractAddress}`;
        break;
      case 7: // Avalanche
        explorerUrl = `https://cchain.explorer.avax.network/address/${contractAddress}`;
        break;
      default: // Cronos
        explorerUrl = `https://cronos-explorer.crypto.org/address/${contractAddress}`;
        break;
    }

    window.open(explorerUrl, "_blank");
  };
  // const dataSource = [
  //   {
  //     key: "1",
  //     name: "Mike",
  //     age: 32,
  //     address: "10 Downing Street",
  //   },
  //   {
  //     key: "2",
  //     name: "John",
  //     age: 42,
  //     address: "10 Downing Street",
  //   },
  // ];

  const read_columns = [
    {
      title: "S.No.",
      // dataIndex: data.index,
      // key: data.index,
      render: (item, record, index) => (
        <>{currentPage > 1 ? (currentPage - 1) * 10 + index + 1 : index + 1}</>
      ),
    },
    {
      title: "Token Name",
      // dataIndex: "coin_data",
      // key: "coin_data",
      render: (text) => <p>{text?.coin_name ? text.coin_name : "N/A"}</p>,
    },
    {
      title: "Token Symbol",
      // dataIndex: "coin_data",
      // key: "coin_data",
      render: (text) => (
        <p>{text?.coin_symbol ? text.coin_symbol.toUpperCase() : "N/A"}</p>
      ),
    },
    {
      title: "Token Type",
      // dataIndex: "coin_data",
      // key: "coin_data",
      render: (text) => <p>{text?.token_type ? text?.token_type : "Coin"}</p>,
    },
    {
      title: "Image",
      // dataIndex: "coin_data",
      // key: "coin_data",
      render: (text) =>
        text.coin_image ? (
          <Image
            width={50}
            preview={false}
            src={`${CONFIG.IMAGE_URL}${text?.coin_image}`}
            // onError={handleImageError}
          />
        ) : (
          <Image
            width={50}
            preview={false}
            src={not_image_available}
            // onError={handleImageError}
          />
        ),
    },
    {
      title: "Decimal",

      render: (text) => (
        // <>18</>
        <p>
          {text?.decimals === null
            ? "N/A"
            : text?.decimals.toString()?.length - 1}
        </p>
      ),
    },
    {
      title: (
        <p style={{ textAlign: "center", marginBottom: "0" }}>
          Contract Address
        </p>
      ),
      render: (text) => (
        <p
          style={{
            cursor: "pointer",
            textDecoration: "underline",
            color: "#367CC7",
            textAlign: "center",
            marginBottom: "0",
          }}
          onClick={() => {
            if (text?.token_address !== null) {
              redirectToExplorer(text.coin_family, text.token_address);
            }
          }}
        >
          {text?.token_address === null ? "N/A" : text?.token_address}
        </p>
      ),
    },
    {
      title: "Added on ",
      render: (text) => (
        // <></>
        <p>
          {text?.created_at === null
            ? "N/A"
            : moment.utc(text?.created_at).format("MM/DD/YYYY")}
          {/*new Date(text?.created_at).toLocaleDateString()*/}
        </p>
      ),
    },
    {
      title: <p style={{ textAlign: "center", marginBottom: "0" }}>Order</p>,
      // dataIndex: "rank",
      key: "rank",
      render: (text, record) => (
        <p>
          {text?.rank === null ? "N/A" : text?.rank}
          {/*new Date(text?.created_at).toLocaleDateString()*/}
        </p>
        // <div style={{ textAlign: "center", marginBottom: "0" }}>
        //   <InputNumber min={1} max={10} defaultValue={record.rank} onChange={onChange} />
        // </div>
        // <p>
        //   {record.total_req_users_count ? record.total_req_users_count : "N/A"}
        // </p>
      ),
    },
  ];
  const write_columns = [
    {
      title: "S.No.",
      // dataIndex: data.index,
      // key: data.index,
      render: (item, record, index) => (
        <>{currentPage > 1 ? (currentPage - 1) * 10 + index + 1 : index + 1}</>
      ),
    },
    {
      title: "Token Name",
      // dataIndex: "coin_data",
      // key: "coin_data",
      render: (text) => <p>{text?.coin_name ? text.coin_name : "N/A"}</p>,
    },
    {
      title: "Token Symbol",
      // dataIndex: "coin_data",
      // key: "coin_data",
      render: (text) => (
        <p>{text?.coin_symbol ? text.coin_symbol.toUpperCase() : "N/A"}</p>
      ),
    },
    {
      title: "Token Type",
      // dataIndex: "coin_data",
      // key: "coin_data",
      render: (text) => <p>{text?.token_type ? text?.token_type : "Coin"}</p>,
    },
    {
      title: "Image",
      // dataIndex: "coin_data",
      // key: "coin_data",
      render: (text) =>
        text.coin_image ? (
          <Image
            width={50}
            preview={false}
            src={`${CONFIG.IMAGE_URL}${text?.coin_image}`}
            // onError={handleImageError}
          />
        ) : (
          <Image
            width={50}
            preview={false}
            src={not_image_available}
            // onError={handleImageError}
          />
        ),
    },
    {
      title: "Decimal",

      render: (text) => (
        // <>18</>
        <p>
          {text?.decimals === null
            ? "N/A"
            : text?.decimals.toString()?.length - 1}
        </p>
      ),
    },
    {
      title: (
        <p style={{ textAlign: "center", marginBottom: "0" }}>
          Contract Address
        </p>
      ),
      render: (text) => (
        <p
          style={{
            cursor: "pointer",
            textDecoration: "underline",
            color: "#367CC7",
            textAlign: "center",
            marginBottom: "0",
          }}
          onClick={() => {
            if (text?.token_address !== null) {
              redirectToExplorer(text.coin_family, text.token_address);
            }
          }}
        >
          {text?.token_address === null ? "N/A" : text?.token_address}
        </p>
      ),
    },
    {
      title: "Added on ",
      render: (text) => (
        // <></>
        <p>
          {text?.created_at === null
            ? "N/A"
            : moment.utc(text?.created_at).format("MM/DD/YYYY")}
          {/*new Date(text?.created_at).toLocaleDateString()*/}
        </p>
      ),
    },
    {
      title: <p style={{ textAlign: "center", marginBottom: "0" }}>Order</p>,
      // dataIndex: "rank",
      key: "rank",
      render: (text, record) => (
        <p>
          {text?.rank === null ? "N/A" : text?.rank}
          {/*new Date(text?.created_at).toLocaleDateString()*/}
        </p>
        // <div style={{ textAlign: "center", marginBottom: "0" }}>
        //   <InputNumber min={1} max={10} defaultValue={record.rank} onChange={onChange} />
        // </div>
        // <p>
        //   {record.total_req_users_count ? record.total_req_users_count : "N/A"}
        // </p>
      ),
    },
    {
      title: (
        <p style={{ textAlign: "center", marginBottom: "0" }}>Swap On/Off</p>
      ),
      key: "allow_swap",
      render: (text, record) => (
        <p style={{ textAlign: "center", marginBottom: "0" }}>
          <Switch
            disabled={
              record?.token_type ? false : true
              // !disableToggleSwap &&
              // (record?.coin_family == 1 || record?.coin_family == 3)
              //   ? false
              //   : true
            }
            checked={
              record?.allow_swap !== null && record?.allow_swap !== "0"
                ? true
                : false
            }
            onChange={() => {
              if (record?.allow_swap === "0" || record?.allow_swap == null) {
                onChangeSwitch({
                  id: record?.id,
                  allow_swap_status: "1",
                  ip_address: IpData?.ip,
                });
              } else {
                onChangeSwitch({
                  id: record?.id,
                  allow_swap_status: "0",
                  ip_address: IpData?.ip,
                });
              }
            }}
          />
        </p>
      ),
    },
    {
      title: <p style={{ textAlign: "center", marginBottom: "0" }}>Action</p>,
      key: "drop",
      render: (text, record) => (
        <>
          <div className="select-Design select-width firstSelect addStyle_select">
            <Dropdown
              menu={{
                // onClick: (e, data) => showConfirm(e, data),
                items: [
                  // {
                  //   key: "1",
                  //   value: record,
                  //   label: "Active",
                  //   disabled:
                  //     record.token_type == null || record?.status === "active"
                  //       ? true
                  //       : false,
                  //   onClick: (e) => {
                  //     showConfirm(e, record);
                  //   },
                  // },
                  // {
                  //   key: "2",
                  //   value: record,
                  //   label: "Inactive",
                  //   disabled:
                  //     record.token_type == null || record?.status === "inactive"
                  //       ? true
                  //       : false,
                  //   onClick: (e) => {
                  //     showConfirm(e, record);
                  //   },
                  // },
                  {
                    key: "3",
                    value: record,
                    label: "Upload Image",
                    onClick: (e) => {
                      showConfirm(e, record);
                    },
                  },
                  {
                    key: "4",
                    value: record,
                    label: "Edit Name",
                    onClick: (e) => {
                      showConfirm(e, record);
                    },
                  },
                  {
                    key: "5",
                    value: record,
                    label: "Remove From Default Token List",
                    disabled: record.token_type == null ? true : false,
                    onClick: (e) => {
                      showConfirm(e, record);
                    },
                  },
                  {
                    key: "6",
                    value: record,
                    label: "Edit Rank",
                    onClick: (e) => {
                      showConfirm(e, record);
                    },
                  },
                ],
              }}
              placement="bottomRight"
            >
              <Button>View More</Button>
            </Dropdown>
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="main_page_outer">
      {/* <ModalforTransaction /> */}
      {/* <div className="modal-page-btnGroup">
        <Button
          type="primary"
          onClick={() => {
            navigate("/transaction-type");
          }}
        >
          Transition type
        </Button>
      </div> */}
      <Spin
        spinning={isLoading}
        className="spininner"
        tip="Loading..."
        size="large"
      >
        <Table
          className="tokenmanagementTable"
          pagination={false}
          columns={permission_type == "2" ? write_columns : read_columns}
          rowKey={"id"}
          dataSource={RequestDetails}
          // dataSource={dataSource}
          bordered
        />
        {RequestListMeta?.total > 10 ? (
          <Pagination
            pageSize={perPage}
            current={currentPage}
            showSizeChanger={false}
            total={RequestListMeta?.total}
            onChange={(event) => {
              handlePagenationChange(event);
            }}
            style={{ bottom: "0px" }}
          />
        ) : null}
        {EditModalOpen && (
          <UploadTokenModal
            modal2Open={EditModalOpen}
            handleEditTokenCancel={handleEditTokenCancel}
            TokenId={TokenId}
            editTokenName={editTokenName}
            editTokenTitle={editTokenTitle}
            editAction={editAction}
            editTokenRank={editTokenRank}
          />
        )}
      </Spin>
    </div>
  );
}

export default DefaultTokenManagement;
