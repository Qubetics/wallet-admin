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
  Upload,
  message,
  Switch,
  Tooltip,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { setToast } from "../../Redux/slice/toastSlice";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  useGetBannerListMutation,
  useSaveBannerMutation,
  useDeleteBannerMutation,
  useUpdateBannerListMutation
} from "../../Redux/services/BannerServices/BannerApiSlice";
import { ExclamationCircleFilled } from "@ant-design/icons";
import moment from "moment";
import dayjs from "dayjs";
import "./Banner.scss";
import { CONFIG } from "../../common/constant/constant";
import { encryption } from "../../common/encryption/encryption";
const { confirm } = Modal;

const BannerManagement = () => {
  // ...............pagination...................
  const permission_type = sessionStorage.getItem("permission_type");
  const [perPage, setPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [schedule, setSchedule] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [bannerImage, setBannerImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const [SaveBanner, {}] = useSaveBannerMutation();
  const [DeleteBanner, {}] = useDeleteBannerMutation();
  const [getBannerList, { isLoading }] = useGetBannerListMutation();
  const [updateBannerList, {}] = useUpdateBannerListMutation();
  const [bannerList, setBannerList] = useState([]);
  const dispatch = useDispatch();

  console.log("Environment Variables:", {
    imageUrl: CONFIG.IMAGE_URL,
    apiUrl: CONFIG.API_URL,
    ipTrackUrl: CONFIG.IP_TRACK_URL,
  });

  const updateBannerListFn = async (data) => {
    const enc = await encryption(JSON.stringify(data));
    const securedData = { dataString: enc };
    await updateBannerList(securedData).then((res) => {
      if (res?.data?.status) {
        dispatch(
          setToast({
            message: "Banner status updated successfully",
            status: true,
          })
        );
        getAnnouncementListFn(); // Refresh the list
      } else {
        dispatch(
          setToast({
            message: res?.error?.data?.message || "Failed to update banner status",
            status: false,
          })
        );
      }
    }).catch((error) => {
      dispatch(
        setToast({
          message: "Failed to update banner status",
          status: false,
        })
      );
    });
  };

  const AnnouncementDetails = useSelector(
    (state) => state?.Announcement?.announcementList
  );
  const AnnouncementListMeta = useSelector(
    (state) => state?.Announcement?.announcementListMeta
  );

  const IpData = useSelector((state) => state?.userState?.ipData);

  const schema = yup
    .object({
      message: yup
        .string()
        .required("Please enter the URL")
        .url("Please enter a valid URL (e.g., https://example.com)"),
      bannerImage: yup
        .mixed()
        .test("required", "Please upload a banner image", (value) => {
          return value !== null && value !== undefined;
        })
        .test("fileSize", "File Size is too large", (value) => {
          if (!value) return true; // Skip validation if no file
          return value?.size <= 5242880; // 5MB
        })
        .test("fileType", "Unsupported File Format", (value) => {
          if (!value) return true; // Skip validation if no file
          return [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/webp",
          ].includes(value?.type);
        })
        .test("imageDimensions", "Banner dimensions must be exactly 300x100 (width x height)", (value) => {
          if (!value) return true; // Skip validation if no file
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              const img = new Image();
              img.onload = () => {
                resolve(img.height === 100 && img.width === 300);
              };
              img.src = e.target.result;
            };
            reader.readAsDataURL(value);
          });
        }),
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
    const enc = await encryption(
      JSON.stringify({ page: currentPage, limit: perPage })
    );
    const securedData = { dataString: enc };
    await getBannerList(securedData).then((res, err) => {
      if (res?.data?.data) {
        console.log("res", res?.data?.data);
        setBannerList(res?.data?.data?.banner_list);
        // Update meta information for pagination
        const meta = {
          total_records: res?.data?.data?.total,
          current_page: res?.data?.data?.page,
          per_page: res?.data?.data?.per_page,
          total_pages: res?.data?.data?.total_pages,
        };
        // dispatch(setAnnouncementListMeta(meta));
      } else {
        if (res?.error?.status == "FETCH_ERROR") {
          setToast({
            message: `${"Unable to fetch banner list"}`,
            status: false,
          });
        }
      }
    });
  };

  useEffect(() => {
    getAnnouncementListFn();
  }, [dispatch, currentPage]);

  const onFormSubmit = async (data) => {
    console.log("data", data);

    // Check if bannerImage is provided
    if (!data.bannerImage) {
      dispatch(
        setToast({
          message: "Please upload a banner image",
          status: false,
        })
      );
      return;
    }

    try {
      setDisabled(true);
      const formData = new FormData();

      // Add image file
      if (data?.bannerImage) {
        formData.append("image", data.bannerImage);
      }

      // Add message
      if (data?.message) {
        formData.append("link", data.message);
      }

      console.log("Form Data entries:");
      for (let pair of formData.entries()) {
        console.log("FormData entry:", pair[0], pair[1]);
      }

      const response = await SaveBanner(formData).unwrap();
      console.log("response", response?.status);

      if (response?.status === true) {
        setDisabled(false);
        reset({
          message: "",
        });
        setBannerImage(null);
        setImageName("");
        getAnnouncementListFn();
        dispatch(setToast({ message: `${response?.message}`, status: true }));
      } else {
        setDisabled(false);
        dispatch(
          setToast({
            message: `${response?.message || "Failed to save banner"}`,
            status: false,
          })
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setDisabled(false);
      dispatch(
        setToast({
          message:
            error?.data?.message ||
            "Something went wrong while saving the banner",
          status: false,
        })
      );
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

  const handleBannerImageUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return false;
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("Image must be smaller than 5MB!");
      return false;
    }

    // Check image height
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        if (img.height !== 100) {
          // message.error("Banner height must be exactly 100!");
          dispatch(
            setToast({
              message:
                "Banner height must be exactly 100!",
              status: false,
            })
          );
          setBannerImage(null);
          setImageName("");
          setValue("bannerImage", null);
        } else if (img.width !== 300) {
          // message.error("Banner height must be exactly 100!");
          dispatch(
            setToast({
              message:
                "Banner Width must be exactly 300!",
              status: false,
            })
          );
          setBannerImage(null);
          setImageName("");
          setValue("bannerImage", null);
        } else {
          setBannerImage(file);
          setImageName(file.name);
          setValue("bannerImage", file);
          trigger("bannerImage");
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);

    return false;
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
    {
      title: "Link",
      dataIndex: "link",
      key: "link",
      render: (text) => {
        if (!text) return <p>N/A</p>;
        
        // Limit to 20 words
        const words = text.split(' ');
        const limitedText = words.slice(0, 20).join(' ');
        const hasMoreWords = words.length > 20;
        const displayText = hasMoreWords ? `${limitedText}...` : limitedText;
        
        return (
          <Tooltip title={text}>
            <p 
              style={{ cursor: 'pointer', color: '#1890ff', textDecoration: 'underline' }}
              onClick={() => window.open(text.startsWith('http') ? text : `https://${text}`, '_blank')}
            >
              {displayText}
            </p>
          </Tooltip>
        );
      },
    },
    {
      title: "Banner Image",
      // dataIndex: "image_path",
      // key: "image_path",
      render: (text) => (
        <div>
          {text?.image_path ? (
            <img
              src={`${CONFIG.IMAGE_URL}/${text.image_path}`}
              alt="Banner"
              style={{
                width: "100px",
                height: "60px",
                objectFit: "cover",
                borderRadius: "4px",
              }}
            />
          ) : (
            <span style={{ color: "#999" }}>No image</span>
          )}
        </div>
      ),
    },
    {
      title: "Date and Time",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => (
        <p style={{ whiteSpace: "normal" }}>
          {text
            ? moment.utc(text).local().format("MM/DD/YYYY h:mm:ss A")
            : "N/A"}
        </p>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => {
        return (
          <div className="status-cell">
            <span className="status-text">{status === "1" ? "Active" : "Inactive"}</span>
            <Switch
              checked={status === "1"}
              className={status === "0" ? "custom-switch-off" : ""}
              onChange={() => {
                const newStatus = status === "1" ? "0" : "1";
                const statusText = newStatus === "1" ? "activate" : "deactivate";
                
                confirm({
                  title: (
                    <span style={{ color: "black", whiteSpace: "nowrap" }}>
                      Do you want to {statusText} this banner?
                    </span>
                  ),
                  icon: <ExclamationCircleFilled />,
                  centered: true,
                  okText: "Yes",
                  cancelText: "No",
                  onOk() {
                    const data = {
                      id: record?.id,
                      status: newStatus
                    }
                    updateBannerListFn(data);
                  },
                  onCancel() {
                    // Reset switch to original state
                    getAnnouncementListFn();
                  },
                });
              }}
            />
          </div>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button
          // disabled={permission_type == "2" ? false : true}
          className="btn mr10"
          type="primary"
          // danger
          onClick={(e) => {
            confirm({
              title: (
                <span style={{ color: "black", whiteSpace: "nowrap" }}>
                  Do you want to delete this banner?
                </span>
              ),
              icon: <ExclamationCircleFilled style={{marginTop:'6px'}} />,
              centered: true,
              okText: "Delete",
              onOk() {
                console.log("record", record);
                DeleteBanner({ id: record?.id })
                  .then((res) => {
                    console.log("res", res);
                    if (res?.data?.status) {
                      console.log("res?.data?.data", res?.data);
                      dispatch(
                        setToast({
                          message: `${res?.data?.message}`,
                          status: true,
                        })
                      );
                      getAnnouncementListFn();
                    } else {
                      dispatch(
                        setToast({
                          message: `${
                            res?.error?.data?.message ||
                            "Failed to delete banner"
                          }`,
                          status: false,
                        })
                      );
                    }
                  })
                  .catch((error) => {
                    dispatch(
                      setToast({
                        message: "Failed to delete banner",
                        status: false,
                      })
                    );
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
    }
  ];

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
              <div className="input-fields">
                <label
                  style={{
                    marginBottom: "8px",
                    display: "block",
                    color: "#333",
                  }}
                >
                  Upload Banner Image:
                </label>
                <Controller
                  name="bannerImage"
                  control={control}
                  render={({ field: { value } }) => (
                    <Upload
                      beforeUpload={handleBannerImageUpload}
                      showUploadList={false}
                      accept="image/*"
                    >
                      <Button
                        icon={<UploadOutlined />}
                        style={{ width: "100%", height: "40px" }}
                      >
                        {imageName ? imageName : "Click to upload banner image"}
                      </Button>
                    </Upload>
                  )}
                />
                {errors?.bannerImage?.message && (
                  <div className="errorElement">
                    <p style={{ color: "red" }}>
                      {errors?.bannerImage?.message}
                    </p>
                  </div>
                )}
                <p
                  style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}
                >
                  Supported formats: JPG, PNG, WebP. Max size: 5MB.
                  <br />
                   Height must be exactly 100 and Width must be exactly 300.
                </p>
              </div>
              <Controller
                name="message"
                control={control}
                render={({ field: { value } }) => (
                  <Input
                    name="message"
                    style={{ width: "100%" }}
                    placeholder="Enter URL"
                    maxLength={255}
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
                  Upload Banner
                </Button>
              </div>
            </div>
          </form>

          <Table
            columns={columns}
            dataSource={bannerList}
            pagination={false}
            rowKey="id"
            bordered
            className="annoucementTable"
          />
          <Pagination
            pageSize={perPage}
            current={currentPage}
            showSizeChanger={false}
            total={AnnouncementListMeta?.total_records}
            onChange={handlePagenationChange}
            style={{ bottom: "0px" }}
          />
        </Spin>
      </div>
    </>
  );
};

export default BannerManagement;
