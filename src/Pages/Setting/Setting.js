import React, { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, Row, Button, Switch, Modal } from "antd";
// import { useLazyGetGoogleAuthSecretKeyQuery } from "../../Redux/services/settingApi";
import "./Setting.scss";
import ChangePasswordModal from "./ChangePasswordModal";
import GoogleStepOne from "./GoogleStepOne";
import GoogleStepTwo from "./GoogleStepTwo";
// import {
//   useGetGoogleAuthSecretKeyQuery,
//   useGoogle_2fa_verifyMutation,
// } from "../../Redux/services/SettingServices/SettingServicesApiSlice";
import { setToast } from "../../Redux/slice/toastSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ExclamationCircleFilled } from "@ant-design/icons";
import {
  useEnableDisableMaintananceMutation,
  useLazyAppMaintenanceQuery,
} from "../../Redux/services/SettingServices/SettingServicesApiSlice";

const { confirm } = Modal;

function Setting() {
  // const permission_type = sessionStorage.getItem("permission_type");

  const {
    userState: { twoFactorAuth, google2fa_status },
  } = useSelector((state) => state);
  console.log("twoFactorAuth", twoFactorAuth);
  console.log("google2fa_status", google2fa_status);
  const twoFaStatus = localStorage.getItem("google_2fa");
  console.log("twoFaStatus", twoFaStatus);
  const dispatch = useDispatch();
  //   const [getGoogleAuthSecretKey, result] = useLazyGetGoogleAuthSecretKeyQuery();
  const [appMaintenance, { data, isLoading }] = useLazyAppMaintenanceQuery();
  const [enableDisableMaintanance, { isLoading: loading }] =
    useEnableDisableMaintananceMutation();
  // const userData = useSelector((state) => state?.userState?.user);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenStepOne, setIsOpenStepOne] = useState(false);
  const [googleSecretKeyData, setGoogleSecretKeyData] = useState("");
  const [isOpenStepTwo, setIsOpenStepTwo] = useState(false);
  const [action, setAction] = useState(false);
  const [_, setCallGoogleStepone] = useState(false);
  const [__, setCallGoogleSteptwo] = useState(false);
  const JWTToken = localStorage.getItem("jwt_token");
  console.log("googleSecretKeyData",googleSecretKeyData)
  useEffect(() => {
    appPermission();
  }, []);

  const appPermission = async () => {
    appMaintenance();
  };

  function validatePassword(password) {
    const errors = [];

    if (password.length < 8) {
      dispatch(
        setToast({
          message: "Password should have a minimum length of 8 characters",
        })
      );
      errors.push("Password should have a minimum length of 8 characters");
    }

    if (!/[A-Z]/.test(password)) {
      dispatch(
        setToast({
          message: "Password should contain at least one uppercase letter",
        })
      );
      errors.push("Password should contain at least one uppercase letter");
    }

    if (!/[a-z]/.test(password)) {
      dispatch(
        setToast({
          message: "Password should contain at least one lowercase letter",
        })
      );
      errors.push("Password should contain at least one lowercase letter");
    }

    if (!/[0-9]/.test(password)) {
      dispatch(
        setToast({ message: "Password should contain at least one number" })
      );
      errors.push("Password should contain at least one number");
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      dispatch(
        setToast({
          message: "Password should contain at least one special character",
        })
      );
      errors.push("Password should contain at least one special character");
    }

    return errors;
  }

  const addUpdateCard = async (data, action) => {
    setIsOpen(true);
  };
  const closeCardModal = () => {
    setIsOpen(false);
    setAction(false);
  };

  const openGoogleStepone = async (data, action) => {
    // alert('onestep')
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/auth/googleAuthSecretkey`,
        {
          headers: {
            Authorization: JWTToken,
          },
        }
      );
      console.log('data.data.data >>>', data);
      setGoogleSecretKeyData(data.data);
      setCallGoogleStepone(true);
      setIsOpenStepOne(true);
    } catch (error) {
      console.log(error, "error");
    }

    

    // getGoogleAuthSecretKey().then((res) => {
    //   debugger;
    //   if (res.data.status) {
    //     setGoogleSecretKeyData(res?.data?.data);
    //     setIsOpenStepOne(true);
    //   }
    // });
  };
  const getGoogleAuthSecretKey = async () => {
    // alert('onestep')
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/auth/googleAuthSecretkey`,
        {
          headers: {
            Authorization: JWTToken,
          },
        }
      );
      console.log('data.data.data >>>', data?.data);
      setGoogleSecretKeyData(data?.data);
    } catch (error) {
      console.log(error, "error");
    }
  };
  const navigate = useNavigate();

  const closeStepOneModal = () => {
    setIsOpenStepOne(false);
    setAction(false);
  };
  const closeStepTwoModal = () => {
    setIsOpenStepTwo(false);
    setAction(false);
  };
  const openGoogleStepTwo = async (data, action) => {
    // alert('2step')
    setCallGoogleSteptwo(true);
    setIsOpenStepTwo(true);
    // setCallGoogleStepone(true)

    // setIsOpenStepOne(true);

    // await getGoogleAuthSecretKey().then((res) => {
    //   if (res.data.status) {
    //     setGoogleSecretKeyData(res?.data?.data);
    //     setIsOpenStepTwo(true);
    //   }
    // });
  };
  let cardModal = useMemo(
    () => (
      <ChangePasswordModal isOpen={isOpen} closeCardModal={closeCardModal} />
    ),
    [isOpen]
  );

  const showConfirm = (item) => {
    let field = item?.type;
    if (item?.type == "buy_sell") {
      field = "buy/sell";
    } else {
      field = field.split("_").join(" ");
    }
    confirm({
      title: `Do you want to ${item?.is_maintenance ? "disable" : "enable"
        } Maintenance for ${field}?`,
      icon: <ExclamationCircleFilled />,
      centered: true,
      onOk() {
        let payload = {
          id: item?.id,
          status: +!item?.is_maintenance,
        };
        enableDisableMaintanance(payload).then((res, err) => {
          if (res?.data?.data?.status) {
            appPermission();
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
          }
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  return (
    <div className="dashboardSec">
      <GoogleStepOne
        isOpenStepOne={isOpenStepOne}
        closeCardModal={closeStepOneModal}
        googleSecretKeyData={googleSecretKeyData}
      />
      <GoogleStepTwo
        isOpenStepTwo={isOpenStepTwo}
        closeCardModal={closeStepTwoModal}
        googleSecretKeyData={googleSecretKeyData}
      />

      <div className="dashboardSec__dashBoardHeading settingOnly">
        <label>Change Password</label>
        {cardModal}
        <Button
          disabled={action}
          onClick={(e) => {
            e.preventDefault();
            setAction(true);
            addUpdateCard({}, "edit");
          }}
        >
          Change Password
        </Button>
      </div>
      <div className="dashboardSec__dashBoardHeading settingOnly">
        <label>Google Authentication</label>
        {cardModal}
        <Button
          disabled={action}
          onClick={(e) => {
            e.preventDefault();
            setAction(true);
            if (twoFaStatus === "disabled") {
              openGoogleStepone({}, "edit");
            } else {
              getGoogleAuthSecretKey();
              openGoogleStepTwo({}, "edit");
            }
          }}
        >
          {twoFaStatus === "disabled"  ? "Enable" : "Disable"}
        </Button>
      </div>

      {/* <div className="dashboardSec__dashBoardHeading maintanance">
        <label className="maintanance_lbl">Application maintenance</label>
        <br />
        <div className="parent">
          {Array.isArray(data?.data?.data) &&
            data?.data?.data.map((itm, idx) => (
              <div className="maintatance" key={idx}>
                <span>
                  {itm?.type == "buy_sell"
                    ? "Buy/Sell"
                    : itm?.type.split("_").join(" ")}
                </span>
                <Switch
                  checked={itm?.is_maintenance}
                  onChange={(e) => {
                    showConfirm(itm);
                  }}
                />
              </div>
            ))}
        </div>
        {/* <Button
          disabled={action}
          onClick={(e) => {
            e.preventDefault();
            setAction(true);
            if (!twoFactorAuth) {
              openGoogleStepone({}, "edit");
            } else {
              openGoogleStepTwo({}, "edit");
            }
          }}
        >
          {!twoFactorAuth ? "Enable" : "Disable"}
        </Button> */}
      {/* </div> */}
    </div>
  );
}

export default Setting;
