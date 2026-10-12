import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Input, Modal } from "antd";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { set2FaStatus } from "../../Redux/slice/userSlice";
import * as yup from "yup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGoogleAuthEnableDisableMutation } from "../../Redux/services/SettingServices/SettingServicesApiSlice";
import { setToast } from "../../Redux/slice/toastSlice";
import { useNavigate } from "react-router-dom";
import { encryption } from "../../common/encryption/encryption";
import eye1 from "../../Images/hidden.png";
import eye2 from "../../Images/eye.png";

const schema = yup
  .object({
    password: yup.string().required("Password is required"),
    token: yup
      .number("Code must be number")
      .integer("Code must be integer")
      .transform((value) => (isNaN(value) ? undefined : value))
      .nullable(true)
      .required("Code must be integer and required."),
  })
  .required();

const GoogleStepTwo = ({
  isOpenStepTwo,
  googleSecretKeyData,
  closeCardModal,
}) => {
  const dispatch = useDispatch();
  const [, setHideShowDivOne] = useState(false);
  const [, setHideShowDivTwo] = useState(true);
  const [disabledButton, setDisabledButton] = useState(false);

  const [googleAuthEnableDisable, { isLoading }] =
    useGoogleAuthEnableDisableMutation();

  const { handleSubmit, trigger, setValue, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const handleOk = () => {
    closeCardModal();
    resetModal();
    // this is use for ok button loading
  };

  const resetModal = () => {
    setHideShowDivOne(false);
    setHideShowDivTwo(true);
    if (errors?.password?.message) {
      errors.password.message = "";
    }
    if (errors?.token?.message) {
      errors.token.message = "";
    }
  };

  const handleCancel = () => {
    closeCardModal();
    resetModal();
    reset();
  };

  const onSubmit = async (data) => {
    let validation = await trigger();
    if (validation) {
      data.action = 0;
      data.token = data?.token?.toString();
      data.googleSecretKey = googleSecretKeyData?.google_secret_key;

      const enc = await encryption(JSON.stringify(data));
      const securedData = { dataString: enc };

      setDisabledButton(true);
      googleAuthEnableDisable(securedData).then((res) => {
        if (res.error) {
          if (res?.error?.status == "FETCH_ERROR") {
            dispatch(setToast({ message: "Network failed", status: false }));
            setTimeout(() => {
              setDisabledButton(false);
            }, 3000);
          } else {
            if (res?.error?.data?.data?.message) {
              dispatch(set2FaStatus(false));
              dispatch(
                setToast({
                  message: `${res?.error?.data?.data?.message}`,
                  status: false,
                })
              );
            } else {
              dispatch(
                setToast({
                  message: `${res?.error?.data?.message}`,
                  status: false,
                })
              );
            }
            setTimeout(() => {
              setDisabledButton(false);
            }, 3000);
          }
        } else {
          localStorage.setItem("google_2fa", "enable");
          dispatch(setToast({ message: res.data.data.message, status: true }));
          dispatch(set2FaStatus(false));
          setTimeout(() => {
            dispatch(setToast({ message: null, status: false }));
          }, 2000);
          closeCardModal();
          resetModal();
        }
      });
    }
  };
  const [passwordVisible, setPasswordVisible] = React.useState(false);

  return (
    <>
      <ToastContainer />
      <Modal
        title="Disable Google Authentication"
        open={isOpenStepTwo}
        onOk={handleOk}
        centered
        // okText={false}
        onCancel={handleCancel}
        footer={false}
        maskClosable={false}
      >
        <form>
          <div id="stepTwo" className={`stepTwo`}>
            <div className="inputStyle" style={{ marginTop: 0 }}>
              <label>Login password</label>
              <Input.Password
                placeholder="Please enter password"
                onChange={(e) => {
                  setValue("password", e.target.value);
                  trigger("password");
                  if (errors?.password?.message) {
                    errors.password.message = "";
                  }
                }}
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
              <p className="error">{errors.password?.message}</p>
            </div>
            <div className="inputStyle">
              <label>Google authentication code</label>
              <Input
                placeholder="Enter authentication code"
                onChange={(e) => {
                  setValue("token", e.target.value);
                  trigger("token");
                  if (errors?.token?.message) {
                    errors.token.message = "";
                  }
                }}
              ></Input>
              <p className="error">{errors.token?.message}</p>
            </div>
            <div className="disableButton">
              <button
                type="submit"
                onClick={handleSubmit(onSubmit)}
                disabled={disabledButton}
                className="enable ant-btn ant-btn-default"
              >
                Disable
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default GoogleStepTwo;
