import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Input, Modal, Button, Spin } from "antd";
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import {
  // logout,
  set2FaStatus,
  // setAuthentication,
} from "../../Redux/slice/userSlice";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGoogleAuthEnableDisableMutation } from "../../Redux/services/SettingServices/SettingServicesApiSlice";
import "./Setting.scss";
import { useNavigate } from "react-router-dom";
import { setToast } from "../../Redux/slice/toastSlice";
import { encryption } from "../../common/encryption/encryption";

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

const GoogleStepOne = ({
  isOpenStepOne,
  googleSecretKeyData,
  closeCardModal,
  action,
}) => {
  const dispatch = useDispatch();
  const [hideShowDivOne, setHideShowDivOne] = useState(false);
  const [hideShowDivTwo, setHideShowDivTwo] = useState(true);
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  const [googleAuthEnableDisable, { isLoading }] =
    useGoogleAuthEnableDisableMutation();

  const { handleSubmit, control, trigger, setValue, formState: { errors } } = useForm({
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
    setPassword("");
    setToken("");
    closeCardModal();
    resetModal();
  };
  const handleCopyClick = () => {
    // Asynchronously call copyTextToClipboard
    copyTextToClipboard(googleSecretKeyData?.google_secret_key)
      .then(() => {
        // If successful, update the isCopied state value
      })
      .catch((err) => {
      });
  };

  const copyTextToClipboard = async (text) => {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  };

  const onSubmit = async (data) => {
    let validation = await trigger();
    if (validation) {
      data.action = 1;
      data.token = data?.token?.toString();
      data.googleSecretKey = googleSecretKeyData.google_secret_key;

      const enc = await encryption(JSON.stringify(data));
      const securedData = { dataString: enc };

      googleAuthEnableDisable(securedData).then((res) => {
        if (res.error) {
          if (res?.error?.status == "FETCH_ERROR") {
            dispatch(setToast({ message: "Network failed", status: false }));
          } else {
            if (res?.error?.data?.data?.message) {

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
          }
        } else {
          localStorage.setItem("google_2fa", "disabled");
          dispatch(setToast({ message: res.data.data.message, status: true }));
          dispatch(set2FaStatus(true));
          setTimeout(() => {
            dispatch(setToast({ message: null, status: false }));
          }, 2000);
          setPassword("");
          setToken("");
          closeCardModal();
        }
      });
    }
  };

  useEffect(() => {
  }, []);

  return (
    <>
      <ToastContainer />
      <div>
        <Spin
          spinning={isLoading}
          className="spininner"
          tip="Loading..."
          size="large"
        >
          <Modal
            title="Enable Google Authentication"
            open={isOpenStepOne}
            onOk={handleOk}
            okButtonProps={{
              style: {
                display: "none",
              },
            }}
            style={{
              top: 20,
            }}
            okText="Ok"
            onCancel={handleCancel}
            maskClosable={false}
          >
            <form>
              {!hideShowDivOne ? (
                <div className={`stepOne ${hideShowDivOne ? " hide" : ""}`}>
                  <div className="QRImageSec">
                    <img src={googleSecretKeyData?.qr_code} width={"200"} />
                    {}
                  </div>
                  <div className="spantext">
                    Scan the QR code in the Google Authentication App, if you
                    are unable to scan the QR Code please enter this code
                    manually into the app
                  </div>
                  <Input
                    type={"text"}
                    className="form-control"
                    value={googleSecretKeyData?.google_secret_key}
                    disabled
                  />
                  <div className="btnDiv">
                    <Button
                      className="steponeformbtn btn btn-primary"
                      onClick={() => {
                        handleCopyClick();
                        toast.success("Text copied.");
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              ) : (
                <></>
              )}
              <div
                id="stepTwo"
                className={`stepTwo ${hideShowDivTwo ? " hide" : ""}`}
              >
                <div className="inputStyle">
                  <label>Login password</label>
                  <Input
                    placeholder="Please enter password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setValue("password", e.target.value);
                      setPassword(e.target.value);
                      trigger("password");
                      if (errors?.password?.message) {
                        errors.password.message = "";
                      }
                    }}
                  ></Input>
                  <p className="error">{errors.password?.message}</p>
                </div>
                <div className="inputStyle">
                  <label>Google authentication code</label>
                  <Input
                    placeholder="Enter authentication code"
                    value={token}
                    onChange={(e) => {
                      setValue("token", e.target.value);
                      setToken(e.target.value);
                      trigger("token");
                      if (errors?.token?.message) {
                        errors.token.message = "";
                      }
                    }}
                  ></Input>
                  <p className="error">{errors.token?.message}</p>
                </div>
                <div className="steptwobtn btnDiv">
                  <button
                    type="submit"
                    onClick={handleSubmit(onSubmit)}
                    className="enable ant-btn ant-btn-default"
                  >
                    Enable
                  </button>
                </div>
              </div>
            </form>
          </Modal>
        </Spin>
      </div>
    </>
  );
};

export default GoogleStepOne;
