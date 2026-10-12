import React, { useState, useMemo, useEffect } from "react";
import { useSelector } from 'react-redux';
import { Button } from 'antd';
import "./Setting.scss";
import ChangePasswordModal from "./ChangePasswordModal";
import GoogleStepOne from "./GoogleStepOne";
import GoogleStepTwo from "./GoogleStepTwo";
import axios from "axios";
import {
  useEnableDisableMaintananceMutation,
  useLazyAppMaintenanceQuery,
} from "../../Redux/services/SettingServices/SettingServicesApiSlice";

function Setting() {

  const {
    userState: { twoFactorAuth, google2fa_status },
  } = useSelector((state) => state);
  const twoFaStatus = localStorage.getItem("google_2fa");
  const [appMaintenance, { data, isLoading }] = useLazyAppMaintenanceQuery();
  const [, { isLoading: loading }] =
    useEnableDisableMaintananceMutation();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenStepOne, setIsOpenStepOne] = useState(false);
  const [googleSecretKeyData, setGoogleSecretKeyData] = useState("");
  const [isOpenStepTwo, setIsOpenStepTwo] = useState(false);
  const [action, setAction] = useState(false);
  const [, setCallGoogleStepone] = useState(false);
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

    </div>
  );
}

export default Setting;
