// Know this page is cancel by shivam project

import React, { useEffect, useState } from "react";
import {
  Button,
  Pagination,
  Table,
  Input,
  Spin,
  Select,
  DatePicker,
  Modal,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setToast } from "../../Redux/slice/toastSlice";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  useSaveAnnouncementMutation,
  useGetAnnouncementNotificationMutation,
  useDeleteAnnouncementMutation,
} from "../../Redux/services/AnnouncementServices/AnnouncementApiSlice";

import {
  setAnnouncementList,
  setAnnouncementListMeta,
} from "../../Redux/slice/announcementSlice";
import { ExclamationCircleFilled } from "@ant-design/icons";
import moment from "moment";
import dayjs from "dayjs";
import "./Announcement.scss";
import { encryption } from "../../common/encryption/encryption";
const { confirm } = Modal;

const Announcement = () => {
  // ...............pagination...................
  const permission_type = sessionStorage.getItem("permission_type");
  const [perPage, setPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [schedule, setSchedule] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [SaveAnnouncement, {}] = useSaveAnnouncementMutation();
  const [DeleteAnnouncement, {}] = useDeleteAnnouncementMutation();
  const [tableData, setTableData] = useState([]);
  const [getAnnouncementist, { isLoading }] =
    useGetAnnouncementNotificationMutation();

  const dispatch = useDispatch();

  const AnnouncementDetails = useSelector(
    (state) => state?.Announcement?.announcementList
  );
  const AnnouncementListMeta = useSelector(
    (state) => state?.Announcement?.announcementListMeta
  );

  const IpData = useSelector((state) => state?.userState?.ipData);

  const schema = yup
    .object({
      title: yup.string().required("Please enter the title"),
      message: yup.string().required("Please enter the message"),
      schedule_time: schedule
        ? yup.string().nullable().required("Please select schedule date time")
        : yup.string().notRequired(),
    })
    .required();
  const {
    handleSubmit,
    control,
    setValue,
    touched,
    trigger,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const { TextArea } = Input;

  useEffect(() => {
    reset({
      type: "0",
    });
  }, [reset]);

  const getAnnouncementListFn = async () => {
    const enc = await encryption(JSON.stringify({ page: currentPage, limit: perPage }));
    const securedData = { dataString: enc };
    await getAnnouncementist(securedData).then(
      (res, err) => {
        if (res?.data?.data) {
          console.log("here i am",res?.data?.data);
          setTableData(res?.data?.data)
          dispatch(setAnnouncementList(res?.data?.data?.data));
          dispatch(setAnnouncementListMeta(res?.data?.data?.meta));
        } else {
          if (res?.error?.status == "FETCH_ERROR") {
            dispatch(setToast({ message: "Something went wrong", status: false }));
          }
        }
      }
    );
  };

  useEffect(() => {
    (() => {
      getAnnouncementListFn();
    })();
  }, [dispatch, currentPage]);

  const onFormSubmit = async (data) => {
    try {
      setDisabled(true);
      let submitted_data = {
        title: data.title,
        message: data.message,
        // is_scheduled: data.type,
        // ip_address: IpData?.ip,
      };
      // if (data.schedule_time && data.schedule_time !== "") {
      //   submitted_data.schedule_time = data.schedule_time;
      // } else {
      //   if (data.type == "1" && data.schedule_time == "") {
      //     dispatch(
      //       setToast({
      //         message: `Please set schedule date time`,
      //         status: false,
      //       })
      //     );
      //   }
      // }
      const enc = await encryption(JSON.stringify(submitted_data));
      const securedData = { dataString: enc };
      await SaveAnnouncement(securedData).then((res) => {
        if (res?.data?.status) {
          console.log("resssss",res?.data?.message)
          setDisabled(false);
          reset({
            schedule_time: "",
            type: data.type,
            title: "",
            message: "",
          });
          getAnnouncementListFn();
          dispatch(
            setToast({ message: `${res?.data?.message}`, status: true })
          );
        } else if (res?.data) {
          setDisabled(false);
          dispatch(
            setToast({ message: `${res?.data?.message}`, status: true })
          );
        } else {
          setDisabled(false);
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
        }
      });
    } catch (er) {
      dispatch(setToast({ message: "something went wrong", status: false }));
    }
  };

  const handlePagenationChange = (event) => {
    setCurrentPage(event);
  };

  const range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  };

  const disabledDate = (current) => {
    return current && current <= dayjs().startOf("day");
  };
  

  const disabledDateTime = (current) => {
    const now = dayjs();

    if (current && current.isSame(now, "day")) {
        const hours = [];
        for (let i = 0; i < 24; i++) {
            if (i < now.hour()) {
                hours.push(i);
            }
        }

        const minutes = [];
        for (let i = 0; i < 60; i++) {
            if (i < now.minute()) {
                minutes.push(i);
            }
        }

        return {
            disabledHours: () => hours,
            disabledMinutes: () => minutes,
        };
    }

    return {
      disabledHours: () => [],
      disabledMinutes: () => [],
    };
};


  const columns = [
    {
      title: "S.No",
      dataIndex: "Number",
      key: "Number",
      render: (item, record, index) => (
        <>{currentPage > 1 ? (currentPage - 1) * 10 + index + 1 : index + 1}</>
      ),
    },
    // {
    //   title: "Type",
    //   dataIndex: "Type",
    //   key: "Type",
    //   render: (item, record, index) => (
    //     <p>
    //       {record?.is_scheduled && record?.is_scheduled == "0"
    //         ? "Instant"
    //         : "Scheduled"}
    //     </p>
    //   ),
    // },
    {
      title: "Title",
      dataIndex: "Title",
      key: "Title",
      render: (text, record) => <p>{record?.title ? record.title : "N/A"}</p>,
    },
    {
      title: "Description",
      dataIndex: "Description",
      key: "message",
      render: (text, record) => (
        <p>{record?.message ? record.message : "N/A"}</p>
      ),
    },
    // {
    //   title: "Scheduled Date and Time",
    //   dataIndex: "schedule_time",
    //   key: "Scheduled Date and Time",
    //   render: (text, record) => (
    //     <p style={{ whiteSpace: "normal" }}>
    //       {record?.schedule_time && record?.schedule_time !== null
    //         ? moment.utc(text).local().format("MM/DD/YYYY h:mm:ss A")
    //         : "Instant"}
    //     </p>
    //     // moment.utc(record?.schedule_time).format('MM/DD/YYYY HH:mm')
    //   ),
    // },
    {
      title: "Date and Time",
      dataIndex: "created_at",
      key: "Date Time",
      render: (text, record) => (
        <p style={{ whiteSpace: "normal" }}>
          {record?.created_at === null
            ? "N/A"
            : moment.utc(text).local().format("MM/DD/YYYY h:mm:ss A")}
        </p>
      ),
    },
    {
      title: "Status",
      key: "Status",
      dataIndex: "status",
      render: (text, record) => {
        let style = { color: "orange", fontWeight: "bold" };
        if (text == "sent") {
          style = { color: "green", fontWeight: "bold" };
        } else if (text == "pending") {
          style = { color: "orange", fontWeight: "bold" };
        }
        return (
          <p style={style}>
            {text === null
              ? "N/A"
              : text.charAt(0).toUpperCase() + text.slice(1)}{" "}
          </p>
        );
      },
    },
  ];
  permission_type == "2" &&
    columns.push({
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button
          disabled={permission_type == "2" ? false : true}
          className="btn mr10"
          type="primary"
          onClick={(e) => {
            confirm({
              title: <span style={{color: "black"}}>Do you want to delete this announcement?</span>,
              icon: <ExclamationCircleFilled style={{marginTop:'6px'}}/>,  
              centered: true,
              okText: "Delete",
              onOk() {
                let deleteValue = { id: record?.id};
                DeleteAnnouncement(deleteValue).then((res, err) => {
                  if (res?.data?.status) {
                    dispatch(
                      setToast({
                        message: `${res?.data?.data}`,
                        status: true,
                      })
                    );
                    getAnnouncementListFn();
                  } else {
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
      ),
    });

  return (
    <>
      <div className="main_page_outer">
        <Spin
          spinning={isLoading}
          className="spininner"
          tip="Loading..."
          size="large"
        >
          
            <form onSubmit={handleSubmit(onFormSubmit)}>
              <div className="topper Send-massage">
                {/* <div className="drop-select">
                  <Controller
                    name="type"
                    control={control}
                    render={({ field: { value } }) => (
                      <>
                        <Select
                          defaultValue="0"
                          className="selectReactCmn"
                          getPopupContainer={(trigger) => trigger.parentNode}
                          onChange={(value) => {
                            if (value == "1") {
                              setSchedule(true);
                            } else {
                              setSchedule(false);
                            }
                            setValue("type", value);
                            trigger("type");
                          }}
                          options={[
                            { value: "0", label: "Instant" },
                            { value: "1", label: "Schedule" },
                          ]}
                        />
                      </>
                    )}
                  />
                </div> */}
                <div className="input-fields">
                  <Controller
                    name="title"
                    control={control}
                    render={({ field: { value } }) => (
                      <Input
                        className="annocInput"
                        name="title"
                        showCount
                        maxLength={20}
                        placeholder="Title"
                        onChange={(e) => {
                          setValue("title", e.target.value.trimStart());
                          trigger("title");
                        }}
                        value={value}
                      />
                    )}
                  />
                  {errors?.title?.message && (
                    <div className="errorElement">
                      <p style={{ color: "red" }}>{errors?.title?.message}</p>
                    </div>
                  )}
                </div>
                <Controller
                  name="message"
                  control={control}
                  render={({ field: { value } }) => (
                    <TextArea
                      name="message"
                      style={{ width: "100%" }}
                      placeholder="Description "
                      showCount
                      maxLength={100}
                      onChange={(e) => {
                        setValue("message", e.target.value.trimStart());
                        trigger("message");
                      }}
                      value={value}
                    />
                  )}
                />
                {errors?.message?.message && (
                  <div className="errorElement">
                    <p style={{ color: "red" }}>{errors?.message?.message}</p>
                  </div>
                )}
                {schedule && (
                  <div className="input-fields">
                    <Controller
                      name="schedule_time"
                      control={control}
                      render={({ field: { value } }) => (
                        <DatePicker
                          className="annocInput"
                          name="schedule_time"
                          format="YYYY-MM-DD HH:mm"
                          disabledDate={disabledDate}
                          disabledTime={disabledDateTime}
                          showTime={{
                            defaultValue: dayjs("00:00", "HH:mm"),
                          }}
                          onChange={(e) => {
                            setValue("schedule_time", e);
                            trigger("schedule_time");
                          }}
                          value={value}
                        />
                      )}
                    />
                    {errors?.schedule_time?.message && (
                      <div className="errorElement">
                        <p style={{ color: "red", marginBottom: "0px" }}>
                          {errors?.schedule_time?.message}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                <div
                  className="submit_modal"
                  style={{ display: "inline-block", width: "100%" }}
                >
                  <Button htmlType="submit" disabled={disabled} type="primary">
                    Send message
                  </Button>
                </div>
              </div>
            </form>
          
          <Table
            columns={columns}
            dataSource={tableData?.notification_list}
            pagination={false}
            rowKey={"id"}
            bordered
            className="annoucementTable "
          />
          <Pagination
            pageSize={perPage}
            current={currentPage}
            showSizeChanger={false}
            total={tableData?.total}
            onChange={(event) => {
              handlePagenationChange(event);
            }}
            style={{ bottom: "0px" }}
          />
        </Spin>
      </div>
    </>
  );
};

export default Announcement;
