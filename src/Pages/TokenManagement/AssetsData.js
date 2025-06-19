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
    // setIsModalOpen(false);
  };
  // const [modal2Open, setModal2Open] = useState(false);
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
            //fetchCoinDataAndShow(value, coinFamily)
            // if (value == "1") { setSchedule(true); }
            // else {
            //   setSchedule(false);
            // }
            // setValue('type', value); trigger("type");
          }}
          //onChange={handleChange}
          options={AssetOptions}
        />
      </Modal>
    </div>
  );
};

export default AssetData;
