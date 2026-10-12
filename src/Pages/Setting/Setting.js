import React, { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Modal } from 'antd';
import "./Setting.scss";
import ChangePasswordModal from "./ChangePasswordModal";
import GoogleStepOne from "./GoogleStepOne";
import GoogleStepTwo from "./GoogleStepTwo";
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

  const {
    userState: { twoFactorAuth, google2fa_status },
  } = useSelector((state) => state);
  const twoFaStatus = localStorage.getItem("google_2fa");
  const dispatch = useDispatch();
  const [appMaintenance, { data, isLoading }] = useLazyAppMaintenanceQuery();
  const [enableDisableMaintanance, { isLoading: loading }] =
    useEnableDisableMaintananceMutation();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenStepOne, setIsOpenStepOne] = useState(false);
  const [googleSecretKeyData, setGoogleSecretKeyData] = useState("");
  const [isOpenStepTwo, setIsOpenStepTwo] = useState(false);
  const [action, setAction] = useState(false);
  const [_, setCallGoogleStepone] = useState(false);
  const [, setCallGoogleSteptwo] = useState(false);
  const JWTToken = localStorage.getItem("jwt_token");
  useEffect(() => {
    appPermission();
  }, []);

  const appPermission = async () => {
    appMaintenance();
  };

  const addUpdateCard = async (data, action) => {
    setIsOpen(true);
  };
  const closeCardModal = () => {
    setIsOpen(false);
    setAction(false);
  };

  const openGoogleStepone = async (data, action) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/auth/googleAuthSecretkey`,
        {
          headers: {
            Authorization: JWTToken,
          },
        }
      );
      setGoogleSecretKeyData(data.data);
      setCallGoogleStepone(true);
      setIsOpenStepOne(true);
    } catch (error) {
    }

    

  };
  const getGoogleAuthSecretKey = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/auth/googleAuthSecretkey`,
        {
          headers: {
            Authorization: JWTToken,
          },
        }
      );
      setGoogleSecretKeyData(data?.data);
    } catch (error) {
    }
  };

  const closeStepOneModal = () => {
    setIsOpenStepOne(false);
    setAction(false);
  };
  const closeStepTwoModal = () => {
    setIsOpenStepTwo(false);
    setAction(false);
  };
  const openGoogleStepTwo = async (data, action) => {
    setCallGoogleSteptwo(true);
    setIsOpenStepTwo(true);

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
        <Button
          disabled={action}
          onClick={(e) => {
            e.preventDefault();
            setAction(true);
            if (twoFaStatus === "disabled") {
              openGoogleStepTwo({}, "edit");
            } else {
              getGoogleAuthSecretKey();
              openGoogleStepone({}, "edit");
            }
          }}
        >
          {twoFaStatus === "disabled"  ? "Disable" : "Enable"}
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
