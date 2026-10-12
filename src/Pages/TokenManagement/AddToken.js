import React from 'react';
import { Modal } from "antd";
import AddTokenForm from "./AddTokenForm";

const AddToken = ({ modal2Open, handleAddTokenCancel }) => {
  return (
    <div>
      <Modal
        title={<span style={{color:'#080707'}}>Add tokens</span>}
        //   children: "Submit",
        cancelButtonProps={{
          children: "cancel",
        }}
        style={{
          top: 20,
        }}
        // cancelText={false}
        open={modal2Open}
        // onOk={false}
        onCancel={() => handleAddTokenCancel(false, "Cancel")}
        // onCancel={false}
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
