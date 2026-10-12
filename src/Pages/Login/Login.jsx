import React, { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { Checkbox, Spin } from "antd";
import { Input, Form } from "antd";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useLoginAuthMutation } from "../../Redux/services/loginApi";
import { getIp } from "../../Redux/services/ipApi";
import { setUser, set2FaStatus, setMenus } from "../../Redux/slice/userSlice";
import { setToast } from "../../Redux/slice/toastSlice";
import "./Login.scss";
import eye1 from "../../Images/hidden.png";
import eye2 from "../../Images/eye.png";
import GoogleStepTwo from "./GoogleStepTwo";
import { useLazyMenuListQuery } from "../../Redux/services/SubAdmin/SubAdminApiSlice";
import AppLogo from "../../Images/qubetics.png";

const schema = yup
  .object({
    email: yup.string().required("Required").email("Invalid email"),
    password: yup.string().required("Required"),
    remember: yup.bool().default(false),
  })
  .required();

function Login() {
  const dispatch = useDispatch();
  const [loginAuth, { isLoading }] = useLoginAuthMutation();
  const [googleSecretKeyData] = useState(false);
  const [loginButton, setLoginButton] = useState(false);
  const [isOpenStepTwo, setIsOpenStepTwo] = useState(false);
  const [menuList, { menuIsLoading }] = useLazyMenuListQuery();

  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    checkRemember();
  }, []);

  const checkRemember = () => {
    let isRemember = localStorage.getItem("isRemeber");
    let email = localStorage.getItem("email");
    // Passwords are never kept in the browser; drop any left over from older builds
    localStorage.removeItem("password");

    if (isRemember == "true") {
      setValue("email", email);
      setValue("remember", isRemember);
    }
  };

  const closeStepTwoModal = () => {
    setIsOpenStepTwo(false);
  };

  const getMenuList = async () => {
    await menuList().then((res, err) => {
      if (res?.data?.data) {
        const newArr = [];
        const menuItem = res?.data?.data?.map((item) => {
          if (item?.slug === "Commission") {
            item.slug = "revenue";
          }
          newArr.push(item);
        });

        dispatch(setMenus(newArr));
      } else if (res?.error?.data) {
      }
    });
  };

  const onSubmit = async (data) => {
    setLoginButton(true);
    const newObj = {
      email: data.email.trim(),
      password: data.password.trim(),
    };

    await loginAuth(newObj).then((res) => {
      localStorage.setItem("email", data?.email);
      if (res.error) {
        if (res?.error?.status == "FETCH_ERROR") {
          dispatch(setToast({ message: "Network failed", status: false }));
          setTimeout(() => {
            setLoginButton(false);
          }, 3000);
        } else {
          dispatch(
            setToast({ message: res?.error?.data?.message, status: false })
          );
          setTimeout(() => {
            setLoginButton(false);
          }, 3000);
        }
      } else {
        if (
          (res?.data && res?.data?.data?.google_2fa == 0) ||
          res?.data?.data?.google_2fa == null
        ) {
          setLoginButton(false);
          dispatch(set2FaStatus(false));
          dispatch(
            setToast({ message: "Logged in successfully", status: true })
          );
          localStorage.setItem("jwt_token", res?.data?.data?.token);
          localStorage.setItem("isRemeber", data.remember);
          sessionStorage.setItem("isActive", 1);
          sessionStorage.setItem("activeKey", "1");
          localStorage.setItem("google_2fa", "enable");
          sessionStorage.setItem("page_title", "Dashboard");
          dispatch(setUser(res?.data?.data));
          dispatch(getIp());
          getMenuList();
          setTimeout(() => {
            dispatch(setToast({ message: null, status: false }));
          }, 5000);
        } else if (res?.data?.data?.google_2fa == 1) {
          setLoginButton(false);
          dispatch(set2FaStatus(true));
          localStorage.setItem("google_2fa", "disabled");
          localStorage.setItem("isRemeber", data.remember);
          sessionStorage.setItem("isActive", 1);
          sessionStorage.setItem("activeKey", "1");
          sessionStorage.setItem("page_title", "Dashboard");

          dispatch(setUser(res?.data?.data));
          dispatch(getIp());
          setIsOpenStepTwo(true);
        } else {
          dispatch(setToast({ message: "Invalid credentials", status: false }));
          setTimeout(() => {
            setLoginButton(false);
          }, 3000);
        }
      }
    });
  };
  return (
    <div className="main_page_outer loginCard">
      <GoogleStepTwo
        isOpenStepTwo={isOpenStepTwo}
        closeCardModal={closeStepTwoModal}
        googleSecretKeyData={googleSecretKeyData}
        loginCred={{
          email: getValues("email"),
          password: getValues("password"),
        }}
      />
      <Spin
        spinning={isLoading}
        className="spininner"
        tip="Loading..."
        size="large"
      >
        <div className="loginContainer">
          <div className="loginSec__logHead">
            <img src={AppLogo} alt="" />
            <h2>Welcome Back!</h2>
            <p>Please enter your login details below.</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="loginSec__inputSec">
              <div className="inputLabel">
                <Controller
                  name="email"
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Form.Item
                      validateStatus={errors.email ? "error" : ""}
                      help={errors.email?.message}
                    >
                      <Input
                        placeholder="Email"
                        onChange={onChange}
                        onBlur={onBlur}
                        value={getValues("email")}
                      />
                    </Form.Item>
                  )}
                />
                {}
              </div>
              <div className="loginSec__inputSec">
                <div className="inputLabel">
                  <Controller
                    name="password"
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Form.Item
                        validateStatus={errors.password ? "error" : ""}
                        help={errors.password?.message}
                      >
                        <Input.Password
                          placeholder="Password"
                          iconRender={(visible) =>
                            visible ? (
                              <img src={eye2} style={{ width: "20px" }} />
                            ) : (
                              <img src={eye1} style={{ width: "20px" }} />
                            )
                          }
                          onChange={onChange}
                          onBlur={onBlur}
                          value={getValues("password")}
                        />
                      </Form.Item>
                    )}
                  />
                </div>
              </div>
              <div className=" check-box">
                <span>
                  <Controller
                    name="remember"
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Form.Item
                        validateStatus={errors.remember ? "error" : ""}
                        help={errors.remember?.message}
                      >
                        <Checkbox
                          onChange={onChange}
                          onBlur={onBlur}
                          checked={value}
                          value={getValues("remember")}
                          width="20px"
                          height="20px"
                        >
                          <span style={{ marginTop: 9 }}> Remember Me</span>
                        </Checkbox>
                      </Form.Item>
                    )}
                  />
                  {}
                </span>
              </div>
            </div>
            <div className="loginSec__loginBtn">
              <button type="submit" disabled={loginButton}>
                Log in
              </button>
            </div>
          </form>
        </div>
      </Spin>
    </div>
  );
}

export default Login;
