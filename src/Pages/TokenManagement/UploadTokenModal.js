import React from 'react';
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
  return (
    <div>
      <Modal
        className="modeldesign"
        title={editTokenTitle}
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
