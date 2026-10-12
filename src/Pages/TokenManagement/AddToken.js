import React from 'react';
import { Modal } from "antd";
import AddTokenForm from "./AddTokenForm";

const AddToken = ({ modal2Open, handleAddTokenCancel }) => {
  return (
    <div>
      <Modal
        title="Add tokens"
        //   children: "Submit",
        cancelButtonProps={{
          children: "cancel",
        }}
        style={{
          top: 20,
        }}
        open={modal2Open}
        onCancel={() => handleAddTokenCancel(false, "Cancel")}
        okText={false}
        closable={true}
        centered={true}
        footer={false}
        maskClosable={false}
      >
        <AddTokenForm handleAddTokenCancel={handleAddTokenCancel} />
      </Modal>
    </div>
  );
};

export default AddToken;
