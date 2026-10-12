import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Input, Modal } from 'antd';
import * as yup from "yup";
import { encryption } from "../../common/encryption/encryption";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useChangePasswordMutation } from "../../Redux/services/SettingServices/SettingServicesApiSlice";
import { setToast } from "../../Redux/slice/toastSlice";
import { logout } from "../../Redux/slice/userSlice";
import eye1 from "../../Images/hidden.png";
import eye2 from "../../Images/eye.png";
import validationRule from "../../common/validation_rules";
import { clearStorage } from "../../common/constant/constant";

yup.object({
  old_password: yup
    .string()
    .required("Old password is required"),
  new_password: yup
    .string()
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
    .required("Confirm password is required")
    .when("new_password", (password, field) =>
      password
        ? field
          .required("Confirm password is required")
          .oneOf([yup.ref("new_password")], "Password mismatch!")
        : field
    ),
});

const ChangePasswordModal = ({ isOpen, card, closeCardModal, action }) => {
  const [confirmLoading] = useState(false);
  const [changePassword, { isLoading }] = useChangePasswordMutation();

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
  const setValue = (event) => {
    handleValidaton({ [event.target.name]: event.target.value });
    setAllState({ ...allState, [event.target.name]: event.target.value });
  };
  const resetState = () => {

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

  const handleOk = async () => {
    var validationData = {
      old_password: allState.old_password,
      new_password: allState.new_password,
      confirm_password: allState.confirm_password,
    };
    var isValid = handleValidaton(validationData);

    if (isValid) {
      let data = {
        oldPassword: allState.old_password.trim(),
        newPassword: allState.new_password.trim(),
        confirmPassword: allState.confirm_password
      };
      const enc = await encryption(JSON.stringify(data));
      const securedData = { dataString: enc };
    
      changePassword(securedData).then((res) => {
        if (res.error) {
          const errorMsg = res?.error?.data?.message || "Something went wrong";
          dispatch(
            setToast({
              message: errorMsg,
              status: false,
            })
          );
        } else {
          dispatch(setToast({ message: `${res?.data?.data?.message}`, status: true }));
          closeCardModal();
          resetState();
          clearStorage();
          dispatch(logout({ navigate: navigate }));
          dispatch(setToast({ message: "Logout successfully", status: true }));
          setTimeout(() => {
            dispatch(setToast({ message: null, status: false }));
          }, 5000);
        }
      });
      // this is use for ok button loading
    }
  };

  const handleCancel = () => {
    closeCardModal();
    resetState();
  };

  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [passwordVisiblenew, setPasswordVisiblenew] = React.useState(false);
  const [passwordconfirm, setPasswordconfirm] = React.useState(false);

  return (
    <>
      <ToastContainer />
      <Modal
        className="submit_changes"
        title="Change Password"
        centered
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
            <Input.Password
              type="password"
              placeholder="Old Password"
              name="old_password"
              onChange={(e) => {
                setValue(e);
              }}
              value={allState.old_password}
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
            <p className="error">{allState?.errors.old_password}</p>
          </div>

          <div className="inputLabel changeInput">
            <Input.Password
              type="password"
              name="new_password"
              onChange={(e) => {
                setValue(e);
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
            <p className="error">{allState?.errors?.new_password}</p>
          </div>

          <div className="inputLabel changeInput">
            <Input.Password
              type="password"
              name="confirm_password"
              onChange={(e) => {
                setValue(e);
              }}
              value={allState.confirm_password}
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

            <p className="error">{allState?.errors?.confirm_password}</p>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ChangePasswordModal;
