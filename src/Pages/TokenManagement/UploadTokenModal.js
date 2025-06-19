import React, { useState } from "react";
import { Modal } from "antd";
import EditTokenForm from "./UploadTokenForm";
import EditTokenName from "./EditTokenName";
import EditTokenRank from "./EditTokenRank";

const UploadTokenModal = ({
  modal2Open,
  handleEditTokenCancel,
  TokenId,
  editTokenName,
  editTokenTitle,
  editAction,
  editTokenRank,
  handleSuccess,
}) => {
  // const [modal2Open, setModal2Open] = useState(false);
console.log("TokenId",TokenId)
  return (
    <div>
      <Modal
        className="modeldesign"
        title={editTokenTitle}
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
        onCancel={() => handleEditTokenCancel(false, "")}
        // onCancel={false}
        okText={false}
        closable={true}
        centered={true}
        footer={false}
        maskClosable={false}
      >
        {editAction == "edit_token_image" && (
          <EditTokenForm
            handleEditTokenCancel={handleEditTokenCancel}
            TokenId={TokenId}
            onSuccess={handleSuccess}
          />
        )}
        {editAction == "edit_token_name" && (
          <EditTokenName
            handleEditTokenCancel={handleEditTokenCancel}
            TokenId={TokenId}
            editTokenName={editTokenName}
            // uploaded={uploaded}
          />
        )}
        {editAction == "edit_token_rank" && (
          <EditTokenRank
            handleEditTokenCancel={handleEditTokenCancel}
            TokenId={TokenId}
            editTokenRank={editTokenRank}
          />
        )}
      </Modal>
    </div>
  );
};

export default UploadTokenModal;
