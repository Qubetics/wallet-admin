import React, { useState, useEffect } from "react";
import { InputNumber, Button, Spin, Input } from "antd";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./TokenManagment.scss";
import { useDispatch } from "react-redux";
import { useEditTokenRankMutation } from "../../Redux/services/TokenManagement/TokenManagementApiSlice";

import { setToast } from "../../Redux/slice/toastSlice";

const schema = yup
  .object({
    TokenRank: yup.string().required("Please enter the token rank"),
  })
  .required();

const EditTokenRankForm = ({
  handleEditTokenCancel,
  TokenId,
  editTokenRank,
}) => {
  // const [confirmLoading, setConfirmLoading] = useState(false);
  const [tokenRank, setTokenRank] = useState(0);
  const [EditTokenRank, { isLoading }] = useEditTokenRankMutation();
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

  useEffect(() => {}, [setValue]);

  useEffect(() => {
    (() => {
      setTokenRank(editTokenRank);
    })();
  }, []);
  useEffect(() => {
    // you can do async server request and fill up form
    // setTimeout(() => {
    reset({
      TokenRank: editTokenRank,
    });
    // }, 2000);
  }, [reset]);

  const onFormSubmit = async (data) => {
    try {
      let SubmittedData = {
        coin_id: TokenId,
        rank: data.TokenRank,
      };

      await EditTokenRank(SubmittedData).then((res) => {
        // alert("after token submit");
        if (res?.data?.data?.status) {
          // setConfirmLoading(false);
          toast.success(`${res?.data?.data?.message}`);
          setTimeout(() => {
            handleEditTokenCancel(false, "edit_token_rank");
          }, 1500);
        } else if (res?.data) {
          toast.success(`${res?.data?.message}`);
          setTimeout(() => {
            handleEditTokenCancel(false, "edit_token_rank");
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
        }
      });
    } catch (er) {
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
                  Change Token Rank: <br />
                </p>
                <div className="inputLabel">
                  <label> Enter Token Rank:</label>
                  <Controller
                    name="TokenRank"
                    control={control}
                    render={({ field: { value } }) => (
                      <Input
                        type="text"
                        name="TokenRank"
                        value={tokenRank}
                        // defaultValue={tokenRank}
                        onChange={(e) => {
                          if (
                            /^[0-9]{1,5}$/.test(e.target.value) ||
                            e.target.value == ""
                          ) {
                            setValue("TokenRank", e.target.value);
                            setTokenRank(e.target.value);
                            trigger("TokenRank");
                          }
                          //   if (errors?.link?.message) {
                          //     errors.link.message = "";
                          //   }
                        }}
                      />
                    )}
                  />
                  {errors?.TokenRank?.message && (
                    <div className="errorElement">
                      <p style={{ color: "red" }}>
                        {errors?.TokenRank?.message}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            }
            <div className="submit_modal">
              {/* EditTokenRank */}
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
export default EditTokenRankForm;
