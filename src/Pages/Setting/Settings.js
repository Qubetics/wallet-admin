import React, { useState } from "react";
import "./Setting.scss";
import { Button, Modal, Switch, Input, Space } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

const onChange = (checked) => {
  console.log(`switch to ${checked}`);
};

const Setting = () => {
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="setting">
      <div className="bg-light mb30">
        <div>
          <p>Change Password</p>
          <Button className="btn-light_white" onClick={showModal}>
            Click Here
          </Button>
        </div>
      </div>
      <div className="bg-light">
        <div>
          <p>Google Authentication</p>
          <div className="height32 switchDesign">
            <Switch defaultChecked onChange={onChange} />
          </div>
        </div>
      </div>
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        className="settingModal"
        maskClosable = {false}
      >
        <Input.Password className="mb30" placeholder="Old password" />
        <Input.Password
          className="mb30"
          placeholder="NEW password"
          iconRender={(visible) =>
            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
          }
        />

        <Input.Password
          placeholder="Confirm password"
          visibilityToggle={{
            visible: passwordVisible,
            onVisibleChange: setPasswordVisible,
          }}
        />
      </Modal>
    </div>
  );
};

export default Setting;
