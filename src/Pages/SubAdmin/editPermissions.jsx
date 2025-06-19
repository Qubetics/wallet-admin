import React, { useState, useEffect } from "react";
import { Button, Spin, Radio, Select, Modal } from "antd";
import { useForm, Controller } from "react-hook-form";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./SubAdmin.scss";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useChangeSubAdminPermissionsMutation } from "../../Redux/services/SubAdmin/SubAdminApiSlice";

import { setToast } from "../../Redux/slice/toastSlice";
// import { DownOutlined } from "@ant-design/icons";

const schema = yup
  .object({
    permission_type: yup
      .string("Permission Type required")
      .required("Permission Type is required"),
    permissions: yup.object().required("Permissions is required."),
  })
  .required();

const EditPermissionsForm = ({
  modalChangePermissionOpen,
  handleEditPermissionsCancel,
  edit_data,
}) => {
  const [menuOptions, setMenuOptions] = useState([]);
  const [defaultMenuOption, setDefaultMenuOptions] = useState([]);
  // const [permissions, setPermissions] = useState([]);
  // const [permission_type, setPermissionType] = useState("1");
  const [changeSubAdminPermissions, { isLoading }] =
    useChangeSubAdminPermissionsMutation();
  const dispatch = useDispatch();
  const menus = useSelector((state) => state?.userState?.menus);
  const ipData = useSelector((state) => state?.userState?.ipData);

  useEffect(() => {
    (async () => {
      if (menus?.length > 0) {
        const menuOptions = [];
        menus?.length > 0 &&
          menus?.map((value) => {
            if (value.id !== 7 && value.id !== 9) {
              return menuOptions.push({ value: value.id, label: value.name });
            }
          });
        setMenuOptions(menuOptions);
      }
      if (edit_data?.permission_data?.length > 0) {
        const defaultMenuOptions = [];
        // const permissions_data = [];
        // let permission_type = '0';
        edit_data?.permission_data?.length > 0 &&
          edit_data?.permission_data?.map((value) => {
            // permission_type = value.permission_type;
            // permissions_data.push({ menu_list_id: value.menu_list_id, permission_type: value.permission_type })

            if (value.menu_list_id !== 7 && value.menu_list_id !== 9) {
              return defaultMenuOptions.push(value.menu_list_id);
            }
          });
        setValue("permissions", Object.assign({}, defaultMenuOptions));
        // setPermissionType(permission_type);

        setDefaultMenuOptions(defaultMenuOptions);
        // setPermissions(permissions_data);
      }
    })();
  }, [menus, edit_data?.permission_data]);

  const {
    handleSubmit,
    reset,
    control,
    setValue,
    touched,
    trigger,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onFormSubmit = async (data) => {
    try {
      let permissions_data = [];
      Object.keys(data.permissions).map((key) =>
        //  data.permissions[key],
        permissions_data.push({
          menu_list_id: data.permissions[key],
          permission_type: data.permission_type,
        })
      );

      let SubmittedData = {
        admin_id: edit_data.id,
        permission_list: permissions_data,
        ip_address: ipData?.ip,
      };
      await changeSubAdminPermissions(SubmittedData).then((res) => {
        if (res.error) {
          if (res?.error?.status == "FETCH_ERROR") {
            dispatch(setToast({ message: "Network failed", status: false }));
          } else {
            // setTimeout(() => {
            if (res?.error?.data?.data?.message) {
              dispatch(
                setToast({
                  message: res?.error?.data?.data?.message,
                  status: false,
                })
              );
            } else {
              dispatch(
                setToast({ message: "Something went wrong.", status: false })
              );
            }
          }
        } else {
          // debugger;
          if (res?.data?.data?.status) {
            // setImages(true);
            // setConfirmLoading(false);
            dispatch(
              setToast({ message: `${res?.data?.data?.message}`, status: true })
            );
            // toast.success(`${res?.data?.data?.message}`);
            setTimeout(() => {
              handleEditPermissionsCancel(false, 1);
            }, 1500);
          } else if (res?.data) {
            // toast.success(`${res?.data?.message}`);
            dispatch(
              setToast({ message: `${res?.data?.data?.message}`, status: true })
            );
            setTimeout(() => {
              handleEditPermissionsCancel(false, 1);
            }, 1500);
          } else {
            // setConfirmLoading(false);
            dispatch(
              setToast({
                message: `${res?.error?.data?.data?.message}`,
                status: false,
              })
            );
          }
        }
      });
    } catch (res) {
      // toast.error(`${res?.error?.data?.message}`);
      dispatch(
        setToast({ message: `${res?.error?.data?.message}`, status: false })
      );
    }
  };

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  return (
    <div>
      <Modal
        title="Edit"
        // okButtonProps={{
        //   children: "Submit",
        // }}
        cancelButtonProps={{
          children: "cancel",
        }}
        style={{
          top: 20,
        }}
        // okText="Submit"
        // cancelText={false}
        open={modalChangePermissionOpen}
        // onOk={false}
        onCancel={() => handleEditPermissionsCancel(false, 0)}
        // onCancel={false}
        okText={false}
        closable={true}
        centered={true}
        footer={false}
        maskClosable={false}
      >
        <div className="main_page_outer">
          <ToastContainer />
          <div>
            <Spin
              spinning={isLoading}
              className="spininner"
              tip="Loading..."
              size="large"
            >
              <form
                onSubmit={handleSubmit(onFormSubmit)}
                // confirmLoading={confirmLoading}
              >
                <div className="inputLabel">
                  {/* <div className="aline-input"> */}
                  <p>Permission Type:</p>

                  <Controller
                    name="permission_type"
                    control={control}
                    defaultValue={edit_data?.permission_type}
                    // rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <Radio.Group
                        value={value}
                        onChange={(e) => {
                          setValue("permission_type", e.target.value);
                          trigger("permission_type");
                        }}
                      >
                        <Radio value={"1"}>Read</Radio>
                        <Radio value={"2"}>Write</Radio>
                      </Radio.Group>
                    )}
                  />
                  {/* </div> */}

                  {errors?.permission_type?.message && (
                    <div className="errorElement">
                      <p style={{ color: "red" }}>
                        {errors?.permission_type?.message}
                      </p>
                    </div>
                  )}
                </div>

                <div className="inputLabel">
                  <label>Select Permissions:</label>

                  <Controller
                    name="permissions"
                    control={control}
                    //value={Object.assign({}, defaultMenuOption)}
                    render={({ field: { value } }) => (
                      <Select
                        className="select-filter"
                        mode="multiple"
                        // suffixIcon={<DownOutlined />}
                        allowClear
                        // showSearch={true}
                        showArrow={true}
                        style={{ width: "100%" }}
                        placeholder="Please select any module"
                        // defaultValue={defaultMenuOption}
                        value={defaultMenuOption}
                        onChange={(values) => {
                          if (Object.assign(values).length > 0) {
                            setValue("permissions", Object.assign({}, values));
                            trigger("permissions");
                            setDefaultMenuOptions(values);
                          } else {
                            setValue("permissions");
                            trigger("permissions");
                            setDefaultMenuOptions(values);
                          }
                        }}
                        filterOption={filterOption}
                        options={menuOptions}
                      />
                    )}
                  />
                  {errors?.permissions?.message && (
                    <div className="errorElement">
                      <p style={{ color: "red" }}>
                        {errors?.permissions?.message}
                      </p>
                    </div>
                  )}

                  {/* <p className="error">{errors.link?.message}</p> */}
                </div>
                {/* {
                                    <Spin
                                        spinning={confirmLoading}
                                        className="spininner"
                                        tip="Loading..."
                                        size="large"
                                        style={{
                                            position: "fixed",
                                            top: "50%",
                                            left: "50%",
                                            transform: "translate(-50%)",
                                        }}
                                    ></Spin>
                                } */}

                <div className="submit_modal">
                  <Button
                    className=""
                    htmlType="submit"
                    type="primary"
                    disabled={isLoading}
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </Spin>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default EditPermissionsForm;
