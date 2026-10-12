import React, { useState, useEffect } from "react";
import { Input, Button, Spin, Radio, Select } from "antd";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./SubAdmin.scss";
import { useDispatch, useSelector } from "react-redux";

import { useAddSubAdminMutation } from "../../Redux/services/SubAdmin/SubAdminApiSlice";

import { setToast } from "../../Redux/slice/toastSlice";

const schema = yup
  .object({
    username: yup
      .string("Username is required")
      .required("Username is required")
      .min(2, "Username is minimum 2 characters!")
      .max(50, "Username is maximum 50 characters!"),
    email: yup
      .string("Email Address is required")
      .required("Email Address is required")
      .max(50, "Email Address is maximum 50 characters!")
      .email("Invalid email address"),
    permissions: yup.object().required("Permissions is required."),
  })
  .required();

const AddSubAdminForm = ({ handleAddSubAdminCancel }) => {
  const [menuOptions, setMenuOptions] = useState(false);

  const [addSubAdmin, { isLoading }] = useAddSubAdminMutation();
  const dispatch = useDispatch();
  const menus = useSelector((state) => state?.userState?.menus);
  const ipData = useSelector((state) => state?.userState?.ipData);

  useEffect(() => {
    (async () => {
      if (menus?.length > 0) {
        const menuOptions = [];
        // { label: "Revenue", value: 7 }
        menus?.length > 0 &&
          menus?.map((value) => {
            if (value.id !== 7 && value.id !== 9) {
              return menuOptions.push({ value: value.id, label: value.name });
            }
          });

        setMenuOptions(menuOptions);
      }
    })();
  }, [menus]);

  const { handleSubmit, control, setValue, trigger, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  const onFormSubmit = async (data) => {
    let permissions_data = [];
    Object.keys(data.permissions).map((key) =>
      permissions_data.push({
        menu_list_id: data.permissions[key],
        permission_type: data.permission_type,
      })
    );

    try {
      let SubmittedData = {
        username: data.username,
        email: data?.email,
        permission_list: permissions_data,
        ip_address: ipData?.ip,
      };
      await addSubAdmin(SubmittedData).then((res) => {
        if (res.error) {
          if (res?.error?.status == "FETCH_ERROR") {
            dispatch(setToast({ message: "Network failed", status: false }));
          } else {

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
          if (res?.data?.data?.status) {
            dispatch(
              setToast({ message: `${res?.data?.data?.message}`, status: true })
            );
            setTimeout(() => {
              handleAddSubAdminCancel(false, 1);
            }, 1500);
          } else if (res?.data) {
            dispatch(
              setToast({ message: `${res?.data?.data?.message}`, status: true })
            );
            setTimeout(() => {
              handleAddSubAdminCancel(false, 1);
            }, 1500);
          } else {
            dispatch(
              setToast({
                message: `${res?.error?.data?.message}`,
                status: false,
              })
            );
          }
        }
      });
    } catch (res) {
      dispatch(
        setToast({ message: `${res?.error?.data?.message}`, status: false })
      );
    }
  };

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  return (
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
          >
            <div className="inputLabel">
              <label>Username:</label>

              <Controller
                name="username"
                control={control}
                render={({ field: { value } }) => (
                  <Input
                    maxLength={50}
                    placeholder="Enter username"
                    value={value}
                    onChange={(e) => {
                      setValue("username", e.target.value);
                      trigger("username");
                    }}
                  />
                )}
              />
              {errors?.username?.message && (
                <div className="errorElement">
                  <p style={{ color: "red" }}>{errors?.username?.message}</p>
                </div>
              )}

            </div>

            <div className="inputLabel">
              <label>Email Address:</label>

              <Controller
                name="email"
                control={control}
                render={({ field: { value } }) => (
                  <Input
                    maxLength={50}
                    placeholder="Enter Email Address"
                    onChange={(e) => {
                      setValue("email", e.target.value);
                      trigger("email");
                    }}
                    value={value}
                  />
                )}
              />
              {errors?.email?.message && (
                <div className="errorElement">
                  <p style={{ color: "red" }}>{errors?.email?.message}</p>
                </div>
              )}

            </div>

            <div className="inputLabel">
              {/* <div className="aline-input"> */}
              <p>Permission Type:</p>
              <Controller
                name="permission_type"
                control={control}
                defaultValue={"1"}
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
                render={({ field: { value } }) => (
                  <Select
                    className="select-filter"
                    mode="multiple"
                    allowClear
                    style={{ width: "100%" }}
                    showArrow={true}
                    placeholder="Please select any module"
                    defaultValue={[]}
                    onChange={(values) => {
                      if (Object.assign(values).length > 0) {
                        setValue("permissions", Object.assign({}, values));
                        trigger("permissions");
                      } else {
                        setValue("permissions");
                        trigger("permissions");
                      }
                    }}
                    filterOption={filterOption}
                    options={menuOptions}
                  />
                )}
              />
              {errors?.permissions?.message && (
                <div className="errorElement">
                  <p style={{ color: "red" }}>{errors?.permissions?.message}</p>
                </div>
              )}

            </div>

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
  );
};
export default AddSubAdminForm;
