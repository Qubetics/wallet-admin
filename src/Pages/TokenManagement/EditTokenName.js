import React, { useState, useEffect } from "react";
import { Input, Button, Spin } from "antd";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./TokenManagment.scss";
import { useDispatch, useSelector } from "react-redux";
import { useEditTokenNameMutation } from "../../Redux/services/TokenManagement/TokenManagementApiSlice";

import { setToast } from "../../Redux/slice/toastSlice";

const schema = yup
  .object({
    TokenName: yup.mixed().required("Please enter the token name"),
  })
  .required();

const EditTokenNameForm = ({
  handleEditTokenCancel,
  TokenId,
  editTokenName,
  uploaded,
}) => {
  const IpData = useSelector((state) => state?.userState?.ipData);

  // const [confirmLoading, setConfirmLoading] = useState(false);
  const [StateCoinName, setStateCoinName] = useState("");
  const [editTokenNames, { isLoading }] = useEditTokenNameMutation();
  const dispatch = useDispatch();
  const {
    handleSubmit,
    control,
    setValue,
    touched,
    trigger,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    (() => {
      setStateCoinName(editTokenName);
      // if (editTokenName) {
      //     setValue([
      //         { TokenName: editTokenName }
      //     ]);
      // }
    })();
  }, []);
  useEffect(() => {
    // you can do async server request and fill up form
    // setTimeout(() => {
    reset({
      TokenName: editTokenName,
    });
    // }, 2000);
  }, [reset]);

  const onFormSubmit = async (data) => {
    try {
      let SubmittedData = {
        coin_id: TokenId,
        coin_name: data.TokenName,
        ip_address: IpData?.ip,
      };

      await editTokenNames(SubmittedData).then((res) => {
        // alert("after token submit");

        if (res?.data?.data?.status) {
          // setConfirmLoading(false);
          toast.success(`${res?.data?.data?.message}`);

          setTimeout(() => {
            handleEditTokenCancel(false, "edit_token_name");
            // uploaded();
          }, 1500);
        } else if (res?.data) {
          toast.success(`${res?.data?.message}`);
          setTimeout(() => {
            handleEditTokenCancel(false, "");
            // uploaded();
          }, 1500);
        } else {
          if (!res?.error?.data?.status && res?.error?.data?.message) {
            dispatch(
              setToast({
                message: `${res?.error?.data?.message}`,
                status: false,
              })
            );
          } else {
            dispatch(
              setToast({ message: `Something went wrong`, status: false })
            );
          }
          // setConfirmLoading(false);
          // toast.error(`${res?.message}`);
          // dispatch(setToast({ message: `${res?.message}`, status: false }));
        }
      });
    } catch (er) {
      // toast.error("something went wrong");
      dispatch(setToast({ message: "something went wrong", status: false }));
    }
  };

  return (
    <div className="main_page_outer">
      <ToastContainer />
      <div>
        <Spin
          spinning={isLoading}
          className="spininner"
          tip="Loading..."
          size="large"
        >
          <form
            onSubmit={handleSubmit(onFormSubmit)}
            // confirmLoading={confirmLoading}
          >
            {
              <div>
                <p className="show-imp">
                  Change Token Name: <br />
                </p>
                <div className="inputLabel">
                  <label> Enter Token Name:</label>
                  <Controller
                    name="TokenName"
                    control={control}
                    render={({ field: { value } }) => (
                      <Input
                        placeholder={StateCoinName}
                        // readOnly={true}
                        onChange={(e) => {
                          // alert('tes');
                          setValue("TokenName", e.target.value);
                          setStateCoinName(e.target.value);
                          trigger("TokenName");
                          //   if (errors?.link?.message) {
                          //     errors.link.message = "";
                          //   }
                        }}
                        maxLength={50}
                        value={StateCoinName}
                      />
                    )}
                  />
                  {errors?.TokenName?.message && (
                    <div className="errorElement">
                      <p style={{ color: "red" }}>
                        {errors?.TokenName?.message}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            }
            <div className="submit_modal">
              <Button
                className=""
                htmlType="submit"
                type="primary"
                disabled={isLoading}
              >
                Submit
              </Button>
            </div>
          </form>
        </Spin>
      </div>
    </div>
  );
};
export default EditTokenNameForm;
