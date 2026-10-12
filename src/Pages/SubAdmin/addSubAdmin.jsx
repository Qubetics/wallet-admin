import React from 'react';
import {
  Modal
} from "antd";
import AddSubAdminForm from './addSubdminForm';

const AddSubAdmin = ({ modalAddSubAdminOpen, handleAddSubAdminCancel }) => {
  return (
    <div>
      <Modal
        title="Add"
        //   children: "Submit",
        cancelButtonProps={{
          children: "cancel",
        }}
        style={{
          top: 20,
        }}
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