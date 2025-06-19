import React, { useState } from 'react'
import {
  Modal
} from "antd";
import AddSubAdminForm from './addSubdminForm';

const AddSubAdmin = ({ modalAddSubAdminOpen, handleAddSubAdminCancel }) => {
  // const [modal2Open, setModal2Open] = useState(false);
  return (
    <div>
      <Modal
        title="Add"
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
        open={modalAddSubAdminOpen}
        // onOk={false}
        onCancel={() => handleAddSubAdminCancel(false, 0)}
        // onCancel={false}
        okText={false}
        closable={true}
        centered={true}
        footer={false}
        maskClosable={false}
      >

        <AddSubAdminForm handleAddSubAdminCancel={handleAddSubAdminCancel} />

      </Modal>
    </div>
  )
}

export default AddSubAdmin