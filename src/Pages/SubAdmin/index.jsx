import React, { useEffect, useState } from "react";
import { Spin, Table, Button, Modal, Pagination } from "antd";
// import { useNavigate } from 'react-router-dom';
import {
  useSubAdminListMutation,
  useDeleteSubAdminMutation,
} from "../../Redux/services/SubAdmin/SubAdminApiSlice";
import { setListData } from "../../Redux/slice/subAdminSlice";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { setToast } from "../../Redux/slice/toastSlice";
import AddSubAdmin from "./addSubAdmin";
import moment from "moment";
import EditPermissionsForm from "./editPermissions";
import { ExclamationCircleFilled } from "@ant-design/icons";

const { confirm } = Modal;

const SubAdminManagement = () => {
  const permission_type = sessionStorage.getItem("permission_type");
  const [perPage, setPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  // const [disabledButton, setDisabledButton] = useState(false);
  const dispatch = useDispatch();
  const [subAdminList, { isLoading }] = useSubAdminListMutation();
  const [deleteSubAdmin, { deleteIsLoading }] = useDeleteSubAdminMutation();
  const [SearchData, SetSearchData] = useState("");
  const [modalAddSubAdminOpen, SetModalAddSubAdminOpen] = useState(false);
  const [modalChangePermissionOpen, SetModalChangePermissionOpen] =
    useState(false);
  const [editData, setEditData] = useState(false);
  const [enableSearchButton, setEnableSearchButton] = useState(false);

  const IpData = useSelector((state) => state?.userState?.ipData);

  const subAdminData = useSelector((state) => state?.SubAdmin?.data);
  const subAdminMeta = useSelector((state) => state?.SubAdmin?.data);

  const handleAddSubAdminCancel = (value, action) => {
    SetModalAddSubAdminOpen(value);
    if (action == 1) {
      getSubAdminsDataFn(SearchData, currentPage);
    }
  };

  const getSubAdminsDataFn = async (searchData, myPage) => {
    let filter_data = {
      page: !myPage ? (SearchData != "" ? 1 : currentPage) : myPage,
      limit: perPage,
      search: searchData ? searchData?.trim() : undefined,
    };

    await subAdminList(filter_data).then((res, err) => {
      if (res?.data?.data) {
        dispatch(setListData(res?.data?.data));
      } else if (res?.error?.data) {
        dispatch(
          setToast({
            message: `${res?.error?.data?.message}`,
            status: false,
          })
        );
      } else {
        dispatch(
          setToast({
            message: `${err?.message}`,
            status: false,
          })
        );
      }
    });
  };

  useEffect(() => {
    (async () => {
      // alert('testddd')
      getSubAdminsDataFn(SearchData, currentPage);
    })();
  }, [currentPage, dispatch, subAdminList, perPage]);
  // const navigate = useNavigate();

  const handlePagenationChange = (event) => {
    if (!enableSearchButton) {
      SetSearchData("");
    }
    setCurrentPage(event);
  };
  const handleEditPermissionsCancel = (value, action) => {
    SetModalChangePermissionOpen(value);
    if (action == 1) {
      getSubAdminsDataFn(SearchData, currentPage);
    }
  };
  const handleEditPermissionsOpen = (edit_data) => {
    SetModalChangePermissionOpen(true);
    setEditData(edit_data);
  };

  const columns = [
    {
      title: "S.No.",
      // dataIndex:data.index,
      // key: data.index,
      render: (item, record, index) => (
        <>{currentPage > 1 ? (currentPage - 1) * 10 + index + 1 : index + 1}</>
      ),
    },
    {
      title: "Username",
      render: (text) => (
        <p>{text?.username === null ? "N/A" : text?.username}</p>
      ),
    },
    {
      title: "Email Address",
      render: (text) => (
        <p>
          {text?.email === null ? "N/A" : text?.email}
          {/* {'abc@gmail.com'} */}
        </p>
      ),
    },
    {
      title: "Created At",
      render: (text) => (
        <p>
          {text?.created_at === null
            ? "N/A"
            : moment.utc(text?.created_at).format("MM/DD/YYYY")}
          {/* {/*new Date(text?.created_at).toLocaleDateString() */}
        </p>
      ),
    },
    {
      title: "Permission Type",
      render: (text) => (
        <p>
          {text?.permissions_data === null
            ? "N/A"
            : text?.permissions_data[0]?.permission_type == "1"
            ? "Read"
            : "Write"}
          {/* {/*new Date(text?.created_at).toLocaleDateString() */}
        </p>
      ),
    },
  ];
  const write_columns = [
    {
      title: "S.No.",
      // dataIndex:data.index,
      // key: data.index,
      render: (item, record, index) => (
        <>{currentPage > 1 ? (currentPage - 1) * 10 + index + 1 : index + 1}</>
      ),
    },
    {
      title: "Username",
      render: (text) => (
        <p>{text?.username === null ? "N/A" : text?.username}</p>
      ),
    },
    {
      title: "Email Address",
      render: (text) => (
        <p>
          {text?.email === null ? "N/A" : text?.email}
          {/* {'abc@gmail.com'} */}
        </p>
      ),
    },
    {
      title: "Created At",
      render: (text) => (
        <p>
          {text?.created_at === null
            ? "N/A"
            : moment.utc(text?.created_at).format("MM/DD/YYYY")}
          {/* {/*new Date(text?.created_at).toLocaleDateString() */}
        </p>
      ),
    },
    {
      title: "Permission Type",
      render: (text) => (
        <p>
          {text?.permissions_data === null
            ? "N/A"
            : text?.permissions_data[0]?.permission_type == "1"
            ? "Read"
            : "Write"}
          {/* {/*new Date(text?.created_at).toLocaleDateString() */}
        </p>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <p>
          <Button
            className="btn mr10"
            type="primary"
            onClick={(e) => {
              handleEditPermissionsOpen({
                id: record?.id,
                permission_data: record?.permissions_data,
                permission_type: record?.permissions_data[0]?.permission_type,
              });
            }}
          >
            Edit
          </Button>
          <Button
            className="btn mr10"
            // type="danger"
            onClick={(e) => {
              confirm({
                title: "Do you want to delete this user?",
                icon: <ExclamationCircleFilled />,
                centered: true,
                okText: "Delete",
                onOk() {
                  let disableValue = {
                    admin_id: record?.id,
                    ip_address: IpData?.ip,
                  };
                  deleteSubAdmin(disableValue).then((res, err) => {
                    getSubAdminsDataFn(SearchData, currentPage);
                    if (res?.data?.data?.status) {
                      dispatch(
                        setToast({
                          message: `${res?.data?.data?.message}`,
                          status: true,
                        })
                      );
                    } else {
                      //setTimeout(toast(`${res?.error?.data?.data?.message}`), 3000);
                      dispatch(
                        setToast({
                          message: `${res?.error?.data?.data?.message}`,
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
            }}
          >
            Delete
          </Button>
        </p>
      ),
    },
  ];

  return (
    <div className="main_page_outer">
      <ToastContainer />
      <Spin
        spinning={isLoading}
        className="spininner"
        tip="Loading..."
        size="large"
      >
        {permission_type === "2" && (
          <div className="main_page_outer_btn">
            {/* <div className='topper'>
            <div className='headerTopSec'>
              <div
                className='form-group searchBox'
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                }}
              >
                <label
                  htmlFor=''
                  style={{ color: '#000', fontWeight: 'bold' }}
                  className='labelHead'
                >
                  Search
                </label>
                <Input
                  // maxLength={23}
                  type='text'
                  title='Seach by token name/ symbol/ address'
                  placeholder='Seach by token name/ symbol/ address'
                  className='form-control'
                  value={SearchData}
                  onChange={(e) => SetSearchData(e.target.value.trimStart())}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setCurrentPage(1);
                      getSubAdminsDataFn(
                        SearchData,
                        1
                      );
                    }
                  }}
                />
              </div>
            </div>

            <div className='searchInput'>
              <Button
                className='btn'
                type='primary'
                disabled={disabledButton}
                onClick={async () => {
                    setCurrentPage(1);
                    await getSubAdminsDataFn(
                      SearchData,
                      1
                    );
                }}
              >
                Search
              </Button>
              <Button
                className='btn'
                type='primary'
                // style={{ marginLeft: "20px" }}
                onClick={async () => {
                  SetSearchData('');
                  setEnableSearchButton(false);
                  getSubAdminsDataFn( null, 1);
                }}
              >
                Reset
              </Button>
               
              
            </div>
          </div> */}

            {/* <div className="select-Design select-width firstSelect mangTonkn">
            <Option value='0'>ALL</Option>
              <Option value='2'>Added by User</Option>
              <Option value='1'>Added by Admin</Option>
            </Select>
          </div> */}
            <Button
              className="btn mr10 mb20"
              type="primary"
              onClick={() => SetModalAddSubAdminOpen(true)}
            >
              Add
            </Button>
          </div>
        )}

        <Table
          className="tokenmanagementTable"
          pagination={false}
          columns={permission_type == "2" ? write_columns : columns}
          rowKey={"id"}
          dataSource={subAdminData}
          bordered
        />

        {subAdminMeta?.total > 10 ? (
          <Pagination
            pageSize={perPage}
            current={currentPage}
            showSizeChanger={false}
            total={subAdminMeta?.total}
            onChange={(event) => {
              handlePagenationChange(event);
            }}
            style={{ bottom: "0px" }}
          />
        ) : null}
        {modalAddSubAdminOpen && (
          <AddSubAdmin
            modalAddSubAdminOpen={modalAddSubAdminOpen}
            handleAddSubAdminCancel={handleAddSubAdminCancel}
          />
        )}
        {modalChangePermissionOpen && (
          <EditPermissionsForm
            modalChangePermissionOpen={modalChangePermissionOpen}
            handleEditPermissionsCancel={handleEditPermissionsCancel}
            edit_data={editData}
          />
        )}
      </Spin>
    </div>
  );
};

export default SubAdminManagement;
