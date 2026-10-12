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
import { Input, Modal } from "antd";
import { useVerify2faMutation } from "../../Redux/services/SettingServices/SettingServicesApiSlice";

// Constants for update types
const UPDATE_TYPES = {
  COMMISSION_PERCENTAGE: 1,
  WALLET_ADDRESS: 2,
};

const CommissionSettings = () => {
  // API hooks
  const { data, isLoading, isError, refetch } = useGetCommisionDetialsQuery();
  const [updateCommissionDetails] = useUpdateCommisionDetialsMutation();
  const [verify2FA, { isLoading: tokenLoading }] = useVerify2faMutation();
  const [isUpdatingWallet, setIsUpdatingWallet] = useState(false);
  const [isUpdatingCommission, setIsUpdatingCommission] = useState(false);

  // Redux hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const is2FAEnabled = useSelector(
    (state) => state?.userState?.user?.google2fa_status
  );
  const twoFaStatus = localStorage.getItem("google_2fa");

  // Component state
  const [walletAddress, setWalletAddress] = useState("");
  const [commissionPercentage, setCommissionPercentage] = useState("");
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [authCode, setAuthCode] = useState("");
  const [pendingUpdateType, setPendingUpdateType] = useState(null);

  // Initialize form data when API data is loaded
  useEffect(() => {
    if (data?.data) {
      setWalletAddress(data.data.walletAddress || "");
      setCommissionPercentage(data.data.percentage || "");
    }
  }, [data]);

  /**
   * Displays error or success toast messages
   * @param {string} message - The message to display
   * @param {boolean} isSuccess - Whether this is a success message
   */
  const showToast = (message, isSuccess = false) => {
    dispatch(setToast({ message, status: isSuccess }));
  };

  /**
   * Validates commission percentage input
   * @param {string} percentage - The percentage value to validate
   * @returns {boolean} - Whether the percentage is valid
   */
  const isValidCommissionPercentage = (percentage) => {
    if (percentage === "") {
      showToast("Commission percentage cannot be empty");
      return false;
    }

    const percentValue = parseFloat(percentage);
    if (isNaN(percentValue) || percentValue < 0 || percentValue > 100) {
      showToast("Commission percentage must be between 0 and 100");
      return false;
    }

    return true;
  };

  /**
   * Validates wallet address input
   * @param {string} address - The wallet address to validate
   * @returns {boolean} - Whether the address is valid
   */
  const isValidWalletAddress = (address) => {
    if (address === "") {
      showToast("Wallet address cannot be empty");
      return false;
    }
    return true;
  };

  /**
   * Handles API errors, including unauthorized access
   * @param {Object} error - The error object from the API response
   */
  const handleApiError = (error, defaultMessage) => {
    if (error?.error?.status === 401 || error?.data?.code === 401) {
      handleUnauthorizedError(
        { error: { status: 401 } },
        dispatch,
        navigate,
        setToast
      );
      return;
    }

    const errorMessage =
      error?.error?.data?.message || error?.data?.message || defaultMessage;
    showToast(errorMessage);
    refetch();
  };

  /**
   * Generic function to update commission settings
   * @param {number} type - The type of update (1 for percentage, 2 for address)
   * @param {string} value - The value to update
   * @param {string} successMessage - Message to show on success
   * @param {string} errorMessage - Message to show on error
   */
  const updateCommissionSetting = async (
    type,
    value,
    successMessage,
    errorMessage
  ) => {
    try {
      const formData = { type, value };
      const encryptedData = await encryption(JSON.stringify(formData));
      const securedData = { dataString: encryptedData };

      const response = await updateCommissionDetails(securedData);

      // Handle unauthorized error
      if (handleUnauthorizedError(response, dispatch, navigate, setToast)) {
        return;
      }

      if (response.data?.status) {
        showToast(successMessage, true);
        refetch();
      } else {
        const apiErrorMessage = response?.error?.data?.message || errorMessage;
        showToast(apiErrorMessage);
        refetch();
      }
    } catch (error) {
      handleApiError(error, errorMessage);
    }
  };

  /**
   * Handles wallet address update
   */
  const handleWalletAddressUpdate = async () => {
    if (!isValidWalletAddress(walletAddress)) return;

    await updateCommissionSetting(
      UPDATE_TYPES.WALLET_ADDRESS,
      walletAddress,
      "Wallet address updated successfully",
      "Failed to update wallet address",
      setIsUpdatingWallet
    );
  };

  /**
   * Handles commission percentage update
   */
  const handleCommissionPercentageUpdate = async () => {
    if (!isValidCommissionPercentage(commissionPercentage)) return;

    await updateCommissionSetting(
      UPDATE_TYPES.COMMISSION_PERCENTAGE,
      commissionPercentage,
      "Commission percentage updated successfully",
      "Failed to update commission percentage",
      setIsUpdatingCommission
    );
  };

  /**
   * Handles form submission - shows 2FA modal or directly updates based on 2FA status
   * @param {Event} e - Form submit event
   * @param {string} updateType - Type of update being performed
   */
  const handleFormSubmit = (e, updateType) => {
    e.preventDefault();

    if (is2FAEnabled) {
      setPendingUpdateType(updateType);
      setIs2FAModalOpen(true);
    } else {
      // If 2FA is not enabled, directly perform the update
      if (updateType === "wallet") {
        handleWalletAddressUpdate();
      } else if (updateType === "commission") {
        handleCommissionPercentageUpdate();
      }
    }
  };

  /**
   * Handles 2FA verification and executes pending update
   */
  const handle2FASubmission = async () => {
    if (!authCode.trim()) {
      showToast("Please enter the authentication code");
      return;
    }

    try {
      const response = await verify2FA({ token: authCode }).unwrap();

      if (response?.message === "SUCCESS") {
        setIs2FAModalOpen(false);
        setAuthCode("");

        // Execute the pending update based on type
        if (pendingUpdateType === "wallet") {
          await handleWalletAddressUpdate();
        } else if (pendingUpdateType === "commission") {
          await handleCommissionPercentageUpdate();
        }

        setPendingUpdateType(null);
      }
    } catch (error) {
      const errorMessage = error?.data?.message || "Authentication failed";
      showToast(errorMessage);
    }
  };

  /**
   * Handles commission percentage input change to allow only valid decimal numbers
   * @param {Event} e - Input change event
   */
  const handleCommissionInputChange = (e) => {
    const value = e.target.value;
    // Allow empty value, numbers, and numbers with decimal points
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setCommissionPercentage(value);
    }
  };

  /**
   * Closes 2FA modal and resets related state
   */
  const close2FAModal = () => {
    setIs2FAModalOpen(false);
    setAuthCode("");
    setPendingUpdateType(null);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="commissionData">
        <div className="commission-setting-container">
          <p>Loading commission data...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (isError) {
    return (
      <div className="commissionData">
        <div className="commission-setting-container">
          <p>Error loading commission data. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="commissionData">
      <div className="commission-setting-container">
        <h2>1inch Revenue (On Chain Swap)</h2>

        {/* 2FA Authentication Modal */}
        <Modal
          title="Google Authentication"
          open={is2FAModalOpen}
          centered
          onOk={handle2FASubmission}
          okText="Submit"
          onCancel={close2FAModal}
          maskClosable={false}
          confirmLoading={tokenLoading}
        >
          <div className="row">
            <label style={{ marginBottom: 8 }}>
              Google authentication code
            </label>
            <Input
              value={authCode}
              placeholder="Enter 6-digit authentication code"
              onChange={(e) => setAuthCode(e.target.value)}
              maxLength={6}
            />
          </div>
        </Modal>

        <div className="commission-form">
          {/* Wallet Address Form */}
          <form
            onSubmit={(e) => handleFormSubmit(e, "wallet")}
            className="form-group"
          >
            <div className="label-wrapper">
              <label htmlFor="walletAddress">Wallet Address:</label>
              <span className="info-text">
                (Enter your ETH/BSC address where markup revenue will be
                transferred.)
              </span>
            </div>
            <div className="input-button-group">
              <input
                style={{ color: "black" }}
                type="text"
                id="walletAddress"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="Enter wallet address"
                required
              />
              {twoFaStatus == "enable" ? (
                <button
                  type="submit"
                  className="submit-btn"
                  style={{borderRadius:"30px" , width:"110px"}}
                  disabled={true}
                  title="Please enable Two-Factor Authentication (2FA) to access revenue features."
                >
                  {isUpdatingWallet ? "Updating..." : "Submit"}
                </button>
              ) : (
                <button
                  type="submit"
                  className="submit-btn"
                  style={{borderRadius:"30px" , width:"110px"}}
                >
                  {isUpdatingWallet ? "Updating..." : "Submit"}
                </button>
              )}
            </div>
          </form>

          {/* Commission Percentage Form */}
          <form
            onSubmit={(e) => handleFormSubmit(e, "commission")}
            className="form-group"
          >
            <div className="label-wrapper">
              <label htmlFor="commissionPercentage">Commission (%):</label>
              <span className="info-text">
                (Revenue percentage admin earns per transaction on ETH/BSC chain
                via 1inch.)
              </span>
            </div>
            <div className="input-button-group">
              <input
                style={{ color: "black" }}
                type="text"
                id="commissionPercentage"
                value={commissionPercentage}
                onChange={handleCommissionInputChange}
                placeholder="Enter commission percentage (0-100)"
                required
              />
              {twoFaStatus == "enable" ? (
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={true}
                  style={{borderRadius:"30px" , width:"110px"}}
                  title="Please enable 2FA first to access this functionality"
                >
                  {isUpdatingCommission ? "Updating..." : "Submit"}
                </button>
              ) : (
                <button
                  type="submit"
                  className="submit-btn"
                  style={{borderRadius:"30px" , width:"110px"}}
                >
                  {isUpdatingCommission ? "Updating..." : "Submit"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CommissionSettings;
