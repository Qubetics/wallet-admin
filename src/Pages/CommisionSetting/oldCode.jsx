import React, { useState, useEffect } from "react";
import "./commissionSetting.css";
import {
  useGetCommisionDetialsQuery,
  useUpdateCommisionDetialsMutation,
} from "../../Redux/services/CommisionSetting/CommisionSettingSlice";
import { encryption } from "../../common/encryption/encryption";
import { setToast } from "../../Redux/slice/toastSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleUnauthorizedError } from "../../common/constant/constant";
import { set2FaStatus } from "../../Redux/slice/userSlice";
import { useLoginAuthMutation } from "../../Redux/services/loginApi";
import * as yup from "yup";
import { Input, Modal, Upload, Button, Select } from "antd";
import { useVerify2faMutation } from "../../Redux/services/SettingServices/SettingServicesApiSlice";
import { toast } from "react-toastify";

const schema = yup.object({
  token: yup
    .string()
    .required("Token is required")
    .matches(/^\d+$/, "Only numeric values are allowed")
    .length(6, "Token must be exactly 6 digits"),
});
const CommissionSetting = () => {
  const { data, isLoading, isError, refetch } = useGetCommisionDetialsQuery();
  const [updateCommisionDetials] = useUpdateCommisionDetialsMutation();
  console.log("data", data);
  const [contractAddress, setContractAddress] = useState("");
  console.log("🚀 ~ CommissionSetting ~ contractAddress:", contractAddress)
  const [commissionPercentage, setCommissionPercentage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isOpenStepTwo, setShowTwoFAModal] = useState(false);
  const [authCode, setAuthCode] = useState("");
  const [verify2fa, { isLoading: tokenLoading }] = useVerify2faMutation();
  const [ type, setType] = useState("");

  console.log("isOpenStepTwo", isOpenStepTwo);

  const is2FAEnabled = useSelector(
    (state) => state?.userState?.user?.google2fa_status
  );
  console.log("is2FAEnabled==============", is2FAEnabled);
  // Update state when data is fetched
  useEffect(() => {
    if (data && data?.data) {
      setContractAddress(data?.data?.walletAddress || "");
      setCommissionPercentage(data?.data?.percentage || "");
    }
  }, [data]);

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    console.log("Address Submit:", contractAddress);

    if (contractAddress === "") {
      dispatch(setToast({ message: "Address cannot be empty", status: false }));
      return;
    }

    try {
      const formData = {
        type: 2,
        value: contractAddress,
      };
      const enc = await encryption(JSON.stringify(formData));
      const securedData = { dataString: enc };
      console.log("securedData", securedData);
      const response = await updateCommisionDetials(securedData);
      console.log("response------------------------", response);

      // Check for 401 error - pass the required parameters
      if (handleUnauthorizedError(response, dispatch, navigate, setToast)) {
        return;
      }

      if (response.data && response.data.status) {
        dispatch(
          setToast({ message: "Address updated successfully", status: true })
        );
        refetch();
      } else {
        dispatch(
          setToast({
            message:
              response?.error?.data?.message || "Failed to update address",
            status: false,
          })
        );
        refetch();
      }
    } catch (error) {
      console.log("error?.error?.status", error?.error?.status);

      // Check for 401 error in catch block - pass the required parameters
      if (error?.error?.status === 401 || error?.data?.code === 401) {
        handleUnauthorizedError(
          { error: { status: 401 } },
          dispatch,
          navigate,
          setToast
        );
        return;
      }

      dispatch(setToast({ message: "Error updating address", status: false }));
      refetch();
    }
  };

  const onSubmit2fFA = async () => {
    try {
      if (!authCode || authCode.trim() === "") {
        dispatch(
          setToast({
            message: "Please enter the authentication code",
            status: false,
          })
        );

        return;
      }
      const response = await verify2fa({
        token: authCode,
      }).unwrap();
      console.log("response", response?.message);
      if (response?.message === "SUCCESS") {
        setShowTwoFAModal(false);
        // if(type === "address") {
        //   await handleAddressSubmit();
        // } else if(type === "percentage") {
        // await handlePercentageSubmit();
        // }
        await handleAddressSubmit();
        await handlePercentageSubmit();
        setAuthCode("");
      }
    } catch (error) {
      dispatch(
        setToast({
          message: error?.data?.message || "something went wrong",
          status: false,
        })
      );
    }
  };

  const handlePercentageSubmit = async () => {
    console.log("Commission Percentage Submit:", commissionPercentage);

    if (commissionPercentage === "") {
      dispatch(
        setToast({
          message: "Commission percentage cannot be empty",
          status: false,
        })
      );
      return;
    }

    // Validate percentage is between 0 and 100
    const percentValue = parseFloat(commissionPercentage);
    if (isNaN(percentValue) || percentValue < 0 || percentValue > 100) {
      dispatch(
        setToast({
          message: "Commission percentage must be between 0 and 100",
          status: false,
        })
      );
      return;
    }
    try {
      const formData = {
        type: 1,
        value: commissionPercentage,
      };
      const enc = await encryption(JSON.stringify(formData));
      const securedData = { dataString: enc };
      console.log("securedData", securedData);
      const response = await updateCommisionDetials(securedData);
      console.log("response-==================", response);

      if (response.data && response.data.status) {
        console.log("response.data++++++++++++", response.data);
        // toast.success( "Commission percentage updated successfully");
        // setShowTwoFAModal(false);
        dispatch(
          setToast({
            message: "Commission percentage updated successfully",
            status: true,
          })
        );
        refetch();
      } else {
        dispatch(
          setToast({
            message:
              response?.error?.data?.message ||
              "Failed to update commission percentage",
            status: false,
          })
        );
        refetch();
      }
    } catch (error) {
      console.log("error", error);

      // Check for 401 error in catch block - pass the required parameters
      if (error?.error?.status === 401 || error?.data?.code === 401) {
        handleUnauthorizedError(
          { error: { status: 401 } },
          dispatch,
          navigate,
          setToast
        );
        return;
      }

      dispatch(
        setToast({
          message: "Error updating commission percentage",
          status: false,
        })
      );
      refetch();
    }
  };

  const onClickModelOk = (e) => {
    e.preventDefault();
    setShowTwoFAModal(true);
  };
  // Handle commission percentage input change to allow decimal values
  const handleCommissionChange = (e) => {
    const value = e.target.value;
    // Allow empty value, numbers, and numbers with decimal points
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setCommissionPercentage(value);
    }
  };
  //////////
  return (
    <div className="commissionData">
      <div className="commission-setting-container">
        <h2>Revenue</h2>
        {isLoading ? (
          <p>Loading commission data...</p>
        ) : isError ? (
          <p>Error loading commission data. Please try again.</p>
        ) : (
          <div className="commission-form">
            <form onSubmit={onClickModelOk} className="form-group">
              <Modal
                title="Google Authentication"
                open={isOpenStepTwo}
                centered
                onOk={onSubmit2fFA}
                okText="Submit"
                onCancel={() => setShowTwoFAModal(false)}
                maskClosable={false}
              >
                <form>
                  <div className="row">
                    <label style={{ marginBottom: 8 }}>
                      Google authentication code
                    </label>
                    <Input
                      value={authCode}
                      placeholder="Enter authentication code"
                      onChange={(e) => {
                        setAuthCode(e.target.value);
                      }}
                    />
                    {/* <p className="error">{errors.token?.message}</p> */}
                  </div>
                </form>
              </Modal>
              <div className="label-wrapper">
                <label htmlFor="contractAddress"> Wallet Address :</label>
                <span className="info-text">
                  (Enter your ETH/BSC address where markup revenue will be
                  transferred.)
                </span>
              </div>
              <div className="input-button-group">
                <input
                  style={{ color: "black" }}
                  type="text"
                  id="contractAddress"
                  value={contractAddress}
                  onChange={(e) => setContractAddress(e.target.value)}
                  placeholder="Enter address"
                  required
                />
                <button type="submit" className="submit-btn">
                  Submit
                </button>
              </div>
            </form>

            <form onSubmit={onClickModelOk} className="form-group">
              <Modal
                title="Google Authentication"
                open={isOpenStepTwo}
                centered
                onOk={onSubmit2fFA}
                okText="Submit"
                onCancel={() => setShowTwoFAModal(false)}
                maskClosable={false}
              >
                <form>
                  <div className="row">
                    <label style={{ marginBottom: 8 }}>
                      Google authentication code
                    </label>
                    <Input
                      value={authCode}
                      placeholder="Enter authentication code"
                      onChange={(e) => {
                        setAuthCode(e.target.value);
                      }}
                    />
                    {/* <p className="error">{errors.token?.message}</p> */}
                  </div>
                </form>
              </Modal>
              <div className="label-wrapper">
                <label htmlFor="commissionPercentage">Commission (%) :</label>
                <span className="info-text">
                  (This is the revenue percentage admin earns per transaction on
                  ETH/BSC chain via 1inch in the Qubetics wallet.)
                </span>
              </div>
              <div className="input-button-group">
                <input
                  style={{ color: "black" }}
                  type="text"
                  id="commissionPercentage"
                  value={commissionPercentage}
                  onChange={handleCommissionChange}
                  placeholder="Enter commission percentage"
                  required
                />
                <button type="submit" className="submit-btn">
                  Submit
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommissionSetting;
