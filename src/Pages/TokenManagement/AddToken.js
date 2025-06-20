import React, { useState } from "react";
import { Modal } from "antd";
import AddTokenForm from "./AddTokenForm";

const AddToken = ({ modal2Open, handleAddTokenCancel }) => {
  // const [modal2Open, setModal2Open] = useState(false);
  return (
    <div>
      <Modal
        title={<span style={{color:'#080707'}}>Add tokens</span>}
        // okButtonProps={{
        //   children: "Submit",
        // }}
        cancelButtonProps={{
          children: "cancel",
        }}
        style={{
          top: 20,
        }}
        // okText="Submit"
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
