import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Input, Modal, Upload, Button, Select } from "antd";
// import { UploadOutlined } from "@ant-design/icons";
// import { useForm, Controller } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { useChangePasswordMutation } from "../../Redux/services/settingApi";
import * as yup from "yup";
import { encryption } from "../../common/encryption/encryption";
// import useSelection from "antd/lib/table/hooks/useSelection";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useChangePasswordMutation } from "../../Redux/services/SettingServices/SettingServicesApiSlice";
// import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { setToast } from "../../Redux/slice/toastSlice";
import { logout } from "../../Redux/slice/userSlice";
import eye1 from "../../Images/hidden.png";
import eye2 from "../../Images/eye.png";
import validationRule from "../../common/validation_rules";
import { clearStorage } from "../../common/constant/constant";

const schema = yup.object({
  old_password: yup
    .string()
    // .min(3, "must be at least 3 characters long")
    // .max(15, "password should not be more than 15 characters long")
    .required("Old password is required"),
  new_password: yup
    .string()
    // .min(3, "must be at least 3 characters long")
    // .max(15, "password should not be more than 15 characters long")
    //.required("Old password is required")
    .required("New password is required")
    .when("old_password", (password, field) =>
      password
        ? field
          .required("New password is required")
          .notOneOf([yup.ref("old_password")], "New password does not same!")
        : field
    ),
  confirm_password: yup
    .string()
    // .min(3, "must be at least 3 characters long")
    // .max(15, "password should not be more than 15 characters long")
    .required("Confirm password is required")
    .when("new_password", (password, field) =>
      password
        ? field
          .required("Confirm password is required")
          .oneOf([yup.ref("new_password")], "Password mismatch!")
        : field
    ),
});
// .required();

const ChangePasswordModal = ({ isOpen, card, closeCardModal, action }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  // const [oldPassword, setOldPassword] = useState(null);
  // const [newPassword, setNewPassword] = useState(null);
  // const [confirmPassword, setConfirmPassword] = useState(null);

  const IpData = useSelector((state) => state?.userState?.ipData);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initilaObj = {
    old_password: "",
    new_password: "",
    confirm_password: "",
    errors: {
      old_password: "",
      new_password: "",
      confirm_password: "",
    },
  };

  const [allState, setAllState] = useState(initilaObj);
  console.log(allState, 'allState')
  const setValue = (event) => {
    handleValidaton({ [event.target.name]: event.target.value });
    setAllState({ ...allState, [event.target.name]: event.target.value });
  };
  const resetState = () => {
    // alert('teddd22');

    setAllState(initilaObj);
  };
  const handleValidaton = (data) => {
    let error = allState?.errors;
    let isValidate = true;
    for (let [key, value] of Object.entries(data)) {
      switch (key) {
        case "old_password":
          if (value === undefined || value?.length === 0) {
            error[key] = "Old password field is required";
            isValidate = false;
          } else if (validationRule.password(value)) {
            error[key] = validationRule.password(value);
            isValidate = false;
          } else if (
            validationRule.passwordMatch(allState.new_password, value)
          ) {
            error[key] = validationRule.passwordMatch(
              allState.new_password,
              value
            );
            isValidate = false;
          } else {
            error[key] = "";
            error["new_password"] = validationRule.password(
              allState.new_password
            );
          }
          break;
        case "new_password":
          if (validationRule.required(value)) {
            error[key] = "New password field is required";
            isValidate = false;
          } else if (validationRule.password(value)) {
            error[key] = validationRule.password(value);
            isValidate = false;
          } else if (
            validationRule.passwordMatch(allState.old_password, value)
          ) {
            error[key] = validationRule.passwordMatch(
              allState.old_password,
              value
            );
            isValidate = false;
          } else {
            error[key] = "";
            error["old_password"] = "";
          }
          break;
        case "confirm_password":
          if (validationRule.required(value)) {
            error[key] = "Confirm password field is required";
            isValidate = false;
          } else if (
            validationRule.passwordNotMatch(allState.new_password, value)
          ) {
            error[key] = validationRule.passwordNotMatch(value);
            isValidate = false;
          } else {
            error[key] = "";
          }
          break;
        default:
      }
    }
    setAllState({ ...allState, errors: { ...error } });
    return isValidate;
  };

  function validatePassword(password) {
    const errors = [];

    if (password.length < 3) {
      dispatch(
        setToast({
          message: "Password should have a minimum length of 3 characters",
        })
      );
      errors.push("Password should have a minimum length of 3 characters");
    } else if (password.length > 15) {
      dispatch(
        setToast({
          message: "Password should not be more than 15 characters long",
        })
      );
      errors.push("Password should not be more than 15 characters long");
    } else if (!/[A-Z]/.test(password)) {
      dispatch(
        setToast({
          message: "Password should contain at least one uppercase letter",
        })
      );
      errors.push("Password should contain at least one uppercase letter");
    } else if (!/[a-z]/.test(password)) {
      dispatch(
        setToast({
          message: "Password should contain at least one lowercase letter",
        })
      );
      errors.push("Password should contain at least one lowercase letter");
    } else if (!/[0-9]/.test(password)) {
      dispatch(
        setToast({ message: "Password should contain at least one number" })
      );
      errors.push("Password should contain at least one number");
    } else if (!/[^A-Za-z0-9]/.test(password)) {
      dispatch(
        setToast({
          message: "Password should contain at least one special character",
        })
      );
      errors.push("Password should contain at least one special character");
    }

    return errors;
  }

  // useEffect(() => { }, []);
  // const {
  //   handleSubmit,
  //   // reset,
  //   control,
  //   //trigger,
  //   //setValue,
  //   //formState: { errors },
  // } = useForm({});

  const handleOk = async () => {
    var validationData = {
      old_password: allState.old_password,
      new_password: allState.new_password,
      confirm_password: allState.confirm_password,
    };
    var isValid = handleValidaton(validationData);
    // handleValidaton()

    // if (validation.length > 0) {
    //   return;
    // }
    if (isValid) {
      let data = {
        oldPassword: allState.old_password.trim(),
        newPassword: allState.new_password.trim(),
        confirmPassword: allState.confirm_password
      };
      if (IpData && IpData?.ip) {
        data.ip_address = IpData?.ip;
      }
      const enc = await encryption(JSON.stringify(data));
      const securedData = { dataString: enc };
      // trigger();
      changePassword(securedData).then((res) => {
        if (res.error) {
          dispatch(
            setToast({
              message: `${res?.error?.data?.data?.message}`,
              status: false,
            })
          );
          // toast.error(res.error.data.message);
        } else {
          // toast.success(res.data.message);
          dispatch(setToast({ message: `${res?.data?.message}`, status: true }));
          closeCardModal();
          resetState();
          // reset();
          // localStorage.clear();
          clearStorage();
          dispatch(logout({ navigate: navigate }));
          dispatch(setToast({ message: "Logout successfully", status: true }));
          setTimeout(() => {
            dispatch(setToast({ message: null, status: false }));
          }, 5000);
        }
      });
      // this is use for ok button loading
      //  setConfirmLoading(true);
      //   setConfirmLoading(false);
    }
  };

  const handleCancel = () => {
    // alert('tesedd');
    closeCardModal();
    resetState();
    // reset()
    // setValue("old_password", "");
    // setValue("new_password", "");
    // setValue("confirm_password", "");
    // errors[`old_password`][`message`] = "";
    // errors[`new_password`][`message`] = "";
    // errors[`confirm_password`][`message`] = "";
  };

  // useEffect(() => { });

  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [passwordVisiblenew, setPasswordVisiblenew] = React.useState(false);
  const [passwordconfirm, setPasswordconfirm] = React.useState(false);

  return (
    <>
      <ToastContainer />
      <Modal
        className="submit_changes"
        title="Change Password"
        open={isOpen}
        onOk={handleOk}
        okText="Submit"
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        cancelText={"Cancel"}
        maskClosable={false}
      >
        <form>
          <div className="inputLabel changeInput">
            {/* <Controller
              name='old_password'
              control={control}
              render={({ field: { value } }) => (
                // <Input
                //   type='password'
                //   placeholder='Old Password'
                //   onChange={(e) => {
                //     if (e.target.value.length <= 15) {
                //       setValue("old_password", e.target.value);
                //       setOldPassword(e.target.value);
                //       trigger("old_password");
                //     }
                //   }}
                //   value={value}
                // /> */}
            <Input.Password
              type="password"
              placeholder="Old Password"
              name="old_password"
              onChange={(e) => {
                //if (e.target.value.length <= 15) {
                setValue(e);
                //setOldPassword(e.target.value);
                //trigger("old_password");
                // }
              }}
              value={allState.old_password}
              // value={value}
              visibilityToggle={{
                visible: passwordVisible,
                onVisibleChange: setPasswordVisible,
              }}
              iconRender={(visible) =>
                visible ? (
                  <img src={eye2} style={{ width: "20px" }} />
                ) : (
                  <img src={eye1} style={{ width: "20px" }} />
                )
              }
            />
            {/* )}
            /> */}
            <p className="error">{allState?.errors.old_password}</p>
          </div>

          <div className="inputLabel changeInput">
            {/* <Controller
              name='new_password'
              control={control}
              render={({ field: { value } }) => (
                // <Input
                //   type='password'
                //   onChange={(e) => {
                //     if (e.target.value.length <= 15) {
                //       setValue("new_password", e.target.value);
                //       setNewPassword(e.target.value);
                //       trigger("new_password");
                //     }
                //   }}
                //   value={value}
                //   placeholder='New Password'
                // /> */}
            <Input.Password
              type="password"
              name="new_password"
              onChange={(e) => {
                //if (e.target.value.length <= 15) {
                setValue(e);
                //setNewPassword(e.target.value);
                //trigger("new_password");
                //}
              }}
              value={allState.new_password}
              placeholder="New Password"
              visibilityToggle={{
                visible: passwordVisiblenew,
                onVisibleChange: setPasswordVisiblenew,
              }}
              iconRender={(visible) =>
                visible ? (
                  <img src={eye2} style={{ width: "20px" }} />
                ) : (
                  <img src={eye1} style={{ width: "20px" }} />
                )
              }
            />
            {/* )}
            /> */}
            <p className="error">{allState?.errors?.new_password}</p>
          </div>

          <div className="inputLabel changeInput">
            {/* <Controller
              name='confirm_password'
              control={control}
              render={({ field: { value } }) => (
                // <Input
                // type='password'
                // onChange={(e) => {
                //   if (e.target.value.length <= 15) {
                //     setValue("confirm_password", e.target.value);
                //     setConfirmPassword(e.target.value);
                //     trigger("confirm_password");
                //   }
                // }}
                // value={value}
                // placeholder='Confirm Password'
                // /> */}
            <Input.Password
              type="password"
              name="confirm_password"
              onChange={(e) => {
                //if (e.target.value.length <= 15) {
                setValue(e);
                //setConfirmPassword(e.target.value.trim());
                //trigger("confirm_password");
                //}
              }}
              value={allState.confirm_password}
              // value={value}
              placeholder="Confirm Password"
              visibilityToggle={{
                visible: passwordconfirm,
                onVisibleChange: setPasswordconfirm,
              }}
              iconRender={(visible) =>
                visible ? (
                  <img src={eye2} style={{ width: "20px" }} />
                ) : (
                  <img src={eye1} style={{ width: "20px" }} />
                )
              }
            />

            {/* )}
            /> */}
            <p className="error">{allState?.errors?.confirm_password}</p>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ChangePasswordModal;
