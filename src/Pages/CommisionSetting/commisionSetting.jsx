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

const CommissionSetting = () => {
  const { data, isLoading, isError, refetch } = useGetCommisionDetialsQuery();
  const [updateCommisionDetials] = useUpdateCommisionDetialsMutation();
  console.log("data", data);
  const [contractAddress, setContractAddress] = useState("");
  const [commissionPercentage, setCommissionPercentage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      console.log("response", response);

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

  const handlePercentageSubmit = async (e) => {
    e.preventDefault();
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
      console.log("response", response);

      // Check for 401 error - pass the required parameters
      if (handleUnauthorizedError(response, dispatch, navigate, setToast)) {
        return;
      }

      if (response.data && response.data.status) {
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

  // Handle commission percentage input change to allow decimal values
  const handleCommissionChange = (e) => {
    const value = e.target.value;
    // Allow empty value, numbers, and numbers with decimal points
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setCommissionPercentage(value);
    }
  };

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
            <form onSubmit={handleAddressSubmit} className="form-group">
              <div className="label-wrapper">
                <label htmlFor="contractAddress">Address</label>
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

            <form onSubmit={handlePercentageSubmit} className="form-group">
              <div className="label-wrapper">
                <label htmlFor="commissionPercentage">Commission (%)</label>
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
