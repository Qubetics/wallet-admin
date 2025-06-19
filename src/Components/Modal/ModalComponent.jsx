import { Modal } from "antd";
import React from "react";
import "./Modal.scss";
function ModalComponent({ children, isModalOpen, handleCancel, heading }) {
  return (
    <Modal
      centered={true}
      className="modalStyle"
      footer={false}
      open={isModalOpen}
      onCancel={handleCancel}
      maskClosable = {false}
    >
      {children}
    </Modal>
  );
}

export default ModalComponent;
