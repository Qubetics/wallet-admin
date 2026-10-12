import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Input, Modal, Upload, Button, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// import { useGoogle2faVerifyMutation } from "../../Redux/services/loginApi";
// import { setAuthentication, setUser } from "../../Redux/slice/userSlice";
import { getIp } from "../../Redux/services/ipApi";
import * as yup from "yup";
import { useLoginAuthMutation } from "../../Redux/services/loginApi";
import { setToast } from "../../Redux/slice/toastSlice";
import useSelection from "antd/lib/table/hooks/useSelection";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { useGoogle_2fa_verifyMutation } from "../../Redux/services/SettingServices/SettingServicesApiSlice";
import { setUser,set2FaStatus, setMenus } from "../../Redux/slice/userSlice";
import { useVerify2faMutation } from "../../Redux/services/SettingServices/SettingServicesApiSlice";
import { useLazyMenuListQuery } from "../../Redux/services/SubAdmin/SubAdminApiSlice";

const schema = yup.object({
  token: yup
    .string()
    .required("Token is required")
    .matches(/^\d+$/, "Only numeric values are allowed")
    .length(6, "Token must be exactly 6 digits"),
});

const GoogleStepTwo = ({ isOpenStepTwo, closeCardModal, action ,loginCred }) => {
  const dispatch = useDispatch();
  const [hideShowDivOne, setHideShowDivOne] = useState(false);
  const [hideShowDivTwo, setHideShowDivTwo] = useState(true);
  const userData = useSelector((state) => state?.userState);
  const [apiError, setApiError] = useState("");
  const loginResponseData = useSelector(
    (state) => state?.userState?.loginResponseData
  );
  // const [google2faVerify, { isLoading }] = useGoogle_2fa_verifyMutation();

  // const [verify2fa, { isLoading }] = useVerify2faMutation();
  const [menuList, { menuIsLoading }] = useLazyMenuListQuery();
  const [loginAuth, { isLoading }] = useLoginAuthMutation();
  // const getTransactionsDataFn = async () => {
  //   alert('inverify api')
  //   await verify2fa({ "token":1
  //  }).then((res,err) => {
  //     //  if(res){

  //     //    dispatch( setTransactionData(res?.data?.data))
  //     //  }else{
  //     //    alert('err=====',err)
  //     //  }
  //    });
  //  };

  //  useEffect(() => {
  //    ( () => {
  //     getTransactionsDataFn();
  //    })();
  //  }, []);

  const getMenuList = async () => {
    await menuList().then((res, err) => {
      if (res?.data?.data) {
        dispatch(setMenus(res?.data?.data));
      } else if (res?.error?.data) {
        console.log("Error ", res?.error?.data?.message);
      }
    });
  };

  const {
    handleSubmit,
    control,
    trigger,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
console.log("setValue",setValue)
  const handleOk = () => {
    closeCardModal();
    resetModal();
    // this is use for ok button loading
  };

  const resetModal = () => {
    if (errors?.token?.message) {
      errors.token.message = "";
    }
  };

  const handleCancel = () => {
    closeCardModal();
    resetModal('');
  };



  const onSubmit = async (data) => {
    // setLoginButton(true);
    const newObj = {
      email: loginCred.email.trim(),
      password: loginCred.password.trim(),
      token: data.token.trim(),
    };

    // let enc = await encryption(JSON.stringify(data));
    // const securedData = { dataValue: enc };
    await loginAuth(newObj).then((res) => {
      localStorage.setItem("email", data?.email);
      if (res.error) {
        console.error("❌ API returned error:", res.error);
        if (res?.error?.status == "FETCH_ERROR") {
          dispatch(setToast({ message: "Network failed", status: false }));
          // setTimeout(() => {
          //   setLoginButton(false);
          // }, 3000);
        } else {
          // setTimeout(() => {
          dispatch(
            setToast({ message: res?.error?.data?.message, status: false })
          );
          // }, 1000);
          // setTimeout(() => {
          //   setLoginButton(false);
          // }, 3000);
          // setLoginButton(false);
        }
      } else {
         console.log("res?.data?.data?.data?.jwt_token---------------",res?.data?.data?.twofa_status);
        if (
          (res?.data && res?.data?.data?.twofa_status == 0) ||
          res?.data?.data?.twofa_status == null
        ) {
          console.log("res?.data?.data?.data?.jwt_token",res?.data?.data?.token)
          // setLoginButton(false);

          dispatch(set2FaStatus(false));
          dispatch(
            setToast({ message: "Logged in successfully", status: true })
          );

          localStorage.setItem("jwt_token", res?.data?.data?.token);
          localStorage.setItem("isRemeber", data.remember);
          sessionStorage.setItem("isActive", 1);
          sessionStorage.setItem("activeKey", "1");
          sessionStorage.setItem("page_title", "Dashboard");
          dispatch(setUser(res?.data?.data));
          // dispatch(setAuthentication(res?.data));
          dispatch(getIp());
          getMenuList();
          setTimeout(() => {
            dispatch(setToast({ message: null, status: false }));
          }, 5000);
        } else if (res?.data?.data?.twofa_status === 1) {
          console.log("heree we goo",res?.data?.data?.twofa_status)
          // setLoginButton(false);
          dispatch(set2FaStatus(true));
          localStorage.setItem("google_2fa", "enable");
          localStorage.setItem("isRemeber", data.remember);
          sessionStorage.setItem("isActive", 1);
          sessionStorage.setItem("activeKey", "1");
          sessionStorage.setItem("page_title", "Dashboard");

          // dispatch(setLoginResponseData(res?.data?.data));
          dispatch(setUser(res?.data?.data));
          dispatch(getIp());
          // getMenuList();
          // setIsOpenStepTwo(true);
        } else {
          dispatch(setToast({ message: "Invalid credentials", status: false }));
          // setTimeout(() => {
          //   setLoginButton(false);
          // }, 3000);
        }
      }
    });
    
  };

  return (
    <>
      <ToastContainer />
      <Modal
        title="Google Authentication"
        open={isOpenStepTwo}
        centered
        onOk={handleSubmit(onSubmit)}
        okText="Submit"
        onCancel={handleCancel}
        maskClosable={false}
      >
        <form>
          <div id="stepTwo" className={`stepTwo`}>
            <div className="row">
              <label style={{ display: "inline-block", marginBottom: 8 }}>
                Google authentication code
              </label>
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
          </div>
        </form>
      </Modal>
    </>
  );
};

export default GoogleStepTwo;
