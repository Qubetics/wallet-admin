import React, { useEffect } from "react";
import { Spin } from "antd";
import { Input } from "antd";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useLoginAuthMutation } from "../../Redux/services/loginApi";
import "./Login.scss";

const schema = yup
  .object({
    email: yup.string().required("Required").email("Invalid email"),
    password: yup.string().required("Required"),
    // .min(8, "Password is too short - should be 8 chars minimum.")
    // .matches(
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
    //   "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    // ),
  })
  .required();

function Login() {
  const [loginAuth, { isLoading }] = useLoginAuthMutation();
  useEffect(() => {}, [isLoading]);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    loginAuth(data).then((res) => {});
  };

  return (
    <div className="main_page_outer loginCard">
      <Spin
        spinning={isLoading}
        className="spininner"
        tip="Loading..."
        size="large"
      >
        <div className="loginContainer">
          <div className="loginSec__logHead">
            {/* <img src={Logo} alt="" /> */}
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
                    <Input
                      placeholder="Email"
                      onChange={(e) => setValue("email", e.target.value)}
                      value={value}
                    />
                  )}
                />
                <p className="error">{errors.email?.message}</p>
              </div>
              <div className="inputLabel">
                <Controller
                  name="password"
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      placeholder="Password"
                      type="password"
                      // iconRender={(visible) =>
                      //   visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                      // }
                      onChange={(e) => setValue("password", e.target.value)}
                      value={value}
                    />
                  )}
                />
                <p className="error">{errors.password?.message}</p>
              </div>
            </div>
            <div className="loginSec__loginBtn">
              <button className="btn ant-btn-default" type="submit">
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
