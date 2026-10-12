import React, { useState } from 'react';
import { Button, Spin } from 'antd';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import "./TokenManagment.scss";
import { useDispatch } from 'react-redux';
import {
  useAddTokenImageMutation,
} from "../../Redux/services/TokenManagement/TokenManagementApiSlice";
import { setToast } from "../../Redux/slice/toastSlice";

const schema = yup.object().shape({
  files: yup
    .mixed()
    .required("You need to provide an Image File")
    .test("fileSize", "File Size is too large", (value) => {
      if (!value) return true; // Skip validation if no file
      return value?.size <= 5242880;
    })
    .test("fileType", "Unsupported File Format", (value) => {
      if (!value) return true; // Skip validation if no file
      return ["image/jpeg", "image/png", "image/svg+xml"].includes(value?.type);
    }),
});

const UploadTokenForm = ({ handleEditTokenCancel, TokenId, onSuccess }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [addTokenImage, {}] = useAddTokenImageMutation();
  const dispatch = useDispatch();

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    clearErrors,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      files: null
    }
  });

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setSelectedFile(null);
      setValue("files", null);
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/svg+xml",
    ];
    const maxSize = 1 * 1024 * 1024; // 1MB in bytes

    if (allowedTypes.includes(file.type) && file.size <= maxSize) {
      setSelectedFile(file);
      setValue("files", file);
      clearErrors("files");
    } else {
      e.target.value = null; // Reset the file input field
      setSelectedFile(null);
      setValue("files", null);
      dispatch(
        setToast({
          message: "Invalid file. Only JPEG, PNG, and SVG files up to 1MB are allowed.",
          status: false
        })
      );
    }
  };

  const onFormSubmit = async (data) => {
    if (!selectedFile) {
      dispatch(setToast({ message: "Please select an image file", status: false }));
      return;
    }

    try {
      setConfirmLoading(true);

      const formdata = new FormData();
      formdata.append("image", selectedFile);
      formdata.append("id", TokenId);
      
      const imageUploadRes = await addTokenImage(formdata);
      if (imageUploadRes?.data?.status === true) {
        setConfirmLoading(false);
        dispatch(setToast({ message: "Image uploaded successfully", status: true }));
        
        // Trigger parent refresh
        if (onSuccess) {
          onSuccess();
        }
        
        // Close the modal immediately
        handleEditTokenCancel(false, "");
      }      
    } catch (er) {
      dispatch(setToast({ message: "something went wrong", status: false }));
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <div className="main_page_outer">
      <ToastContainer />
      <div>
        <Spin
          spinning={confirmLoading}
          className="spininner"
          tip="Loading..."
          size="large"
          style={{
            position: "fixed",
            left: "50%",
            transform: "translate(-50%)",
          }}
        >
          <form onSubmit={handleSubmit(onFormSubmit)}>
            <div>
              <p className="show-imp">
                Upload Token Image: <br />
              </p>
              <div className="inputLabel">
                <Controller
                  name="files"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="file"
                      onChange={(e) => {
                        field.onChange(e.target.files[0]);
                        handleFileSelect(e);
                      }}
                      accept="image/jpeg,image/png,image/svg+xml"
                    />
                  )}
                />
                {errors?.files?.message && (
                  <div className="errorElement">
                    <p style={{ color: "red" }}>{errors?.files?.message}</p>
                  </div>
                )}
              </div>
              <span>( SVG, PNG, JPEG, Max File Size: 1MB)</span>
            </div>

            <div className="submit_modal">
              <Button
                className=""
                htmlType="submit"
                type="primary"
                disabled={confirmLoading || !selectedFile}
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

export default UploadTokenForm;
