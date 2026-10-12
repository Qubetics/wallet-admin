import React, { useEffect, useState } from "react";
import { Modal, Select } from "antd";

const AssetData = ({
  assetsModalOpen,
  handleAssetsCancel,
  assetTokenData,
  ContractAddress,
  setContractAddress,
}) => {
  const [AssetOptions, setAssetOptions] = useState([]);

  useEffect(() => {
    (async () => {
      if (assetTokenData?.length > 0) {
        const assetData = [{ value: "", label: "Select any token" }];
        {
          assetTokenData?.length > 0 &&
            assetTokenData?.map((value) => {
              assetData.push({ value: value.asset, label: value.asset_name });
            });
        }
        setAssetOptions(assetData);
      }
    })();
  }, [assetTokenData]);
  const handleOk = () => {
  };
  return (
    <div>
      <Modal
        title="Select Tokens"
        open={assetsModalOpen}
        onOk={handleOk}
        onCancel={handleAssetsCancel}
        okText={false}
        closable={true}
        centered={true}
        footer={false}
        maskClosable={false}
      >
        <Select
          defaultValue={ContractAddress}
          className="selectReactCmn"
          onChange={(value) => {
            setContractAddress(value);
          }}
          options={AssetOptions}
        />
      </Modal>
    </div>
  );
};

export default AssetData;
