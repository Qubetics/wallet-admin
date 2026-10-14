import React from 'react';
import { useDispatch } from 'react-redux';
import { Input, Modal } from 'antd';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import { getIp } from "../../Redux/services/ipApi";
import * as yup from "yup";
import { useLoginAuthMutation } from "../../Redux/services/loginApi";
import { setToast } from "../../Redux/slice/toastSlice";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { setUser,set2FaStatus, setMenus } from "../../Redux/slice/userSlice";
import { useLazyMenuListQuery } from "../../Redux/services/SubAdmin/SubAdminApiSlice";

const schema = yup
  .object({
    token: yup.string().required("Token is required"),
  })
  .required();

const GoogleStepTwo = ({ isOpenStepTwo, closeCardModal, action ,loginCred }) => {
  const dispatch = useDispatch();

  const [menuList, { menuIsLoading }] = useLazyMenuListQuery();
  const [loginAuth, { isLoading }] = useLoginAuthMutation();

  const getMenuList = async () => {
    await menuList().then((res, err) => {
      if (res?.data?.data) {
        dispatch(setMenus(res?.data?.data));
      } else if (res?.error?.data) {
      }
    });
  };

  const { handleSubmit, trigger, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const resetModal = () => {
    if (errors?.token?.message) {
      errors.token.message = "";
    }
  };

  const handleCancel = () => {
    closeCardModal();
    resetModal();
  };


  const onSubmit = async (data) => {
    const newObj = {
      email: loginCred.email.trim(),
      password: loginCred.password.trim(),
      token: data.token.trim(),
    };

    await loginAuth(newObj).then((res) => {
      localStorage.setItem("email", data?.email);
      localStorage.setItem("password", data.password);
      if (res.error) {
        if (res?.error?.status == "FETCH_ERROR") {
          dispatch(setToast({ message: "Network failed", status: false }));
        } else {
          dispatch(
            setToast({ message: res.error.data.data.message, status: false })
          );
        }
      } else {
        if (
          (res?.data && res?.data?.data?.twofa_status == 0) ||
          res?.data?.data?.twofa_status == null
        ) {

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
          dispatch(getIp());
          getMenuList();
          setTimeout(() => {
            dispatch(setToast({ message: null, status: false }));
          }, 5000);
        } else if (res?.data?.data?.twofa_status === 1) {
          dispatch(set2FaStatus(true));
          localStorage.setItem("google_2fa", "enabled");
          localStorage.setItem("isRemeber", data.remember);
          sessionStorage.setItem("isActive", 1);
          sessionStorage.setItem("activeKey", "1");
          sessionStorage.setItem("page_title", "Dashboard");

          dispatch(setUser(res?.data?.data));
          dispatch(getIp());
        } else {
          dispatch(setToast({ message: "Invalid credentials", status: false }));
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
