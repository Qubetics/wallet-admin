import React, { useState } from "react";
import { Button, Modal } from "antd";
import AddTokenForm from "../TokenManagement/AddTokenForm";

const ModalforTransaction = () => {
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
    <div className="transition-modal mb30 ">
      <Button type="primary" onClick={showModal}>
        Open Modal
      </Button>
      <Modal
        title="Add Token"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <AddTokenForm />
      </Modal>
    </div>
  );
};

export default ModalforTransaction;
