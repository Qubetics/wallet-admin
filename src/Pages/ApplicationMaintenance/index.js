import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Switch, Modal } from "antd";
import "./ApplicationMaintenance.scss";
import { setToast } from "../../Redux/slice/toastSlice";
import { ExclamationCircleFilled } from "@ant-design/icons";
import {
  useEnableDisableMaintananceMutation,
  useLazyAppMaintenanceQuery,
} from "../../Redux/services/SettingServices/SettingServicesApiSlice";

const { confirm } = Modal;

function ApplicationMaintenance() {
  const permission_type = sessionStorage.getItem("permission_type");

  const {
    userState: { twoFactorAuth },
  } = useSelector((state) => state);

  const dispatch = useDispatch();
  const [appMaintenance, { data, isLoading }] = useLazyAppMaintenanceQuery();
  const [enableDisableMaintanance, { isLoading: loading }] =
    useEnableDisableMaintananceMutation();

  useEffect(() => {
    appPermission();
  }, []);

  const appPermission = async () => {
    appMaintenance();
  };

  const showConfirm = (item) => {
    let field = item?.type;
    if (item?.type == "buy_sell") {
      field = "buy/sell";
    } else {
      field = field.split("_").join(" ");
    }
    confirm({
      title: `Do you want to ${
        item?.is_maintenance ? "disable" : "enable"
      } Maintenance for ${field}?`,
      icon: <ExclamationCircleFilled />,
      centered: true,
      onOk() {
        let payload = {
          id: item?.id,
          status: +!item?.is_maintenance,
        };
        enableDisableMaintanance(payload).then((res, err) => {
          if (res?.data?.data?.status) {
            appPermission();
            dispatch(
              setToast({
                message: `${res?.data?.data?.message}`,
                status: true,
              })
            );
          } else {
            dispatch(
              setToast({
                message: `${res?.error?.data?.message}`,
                status: false,
              })
            );
          }
        });
      },
      onCancel() {
      },
    });
  };

  return (
    <div className="dashboardSec">
      <div className="dashboardSec__dashBoardHeading maintanance">
        <label className="maintanance_lbl">Application maintenance</label>
        <br />
        <div className="parent">
          {Array.isArray(data?.data?.data) &&
            data?.data?.data.map((itm, idx) => (
              <div className="maintatance" key={idx}>
                <span>
                  {itm?.type == "buy_sell"
                    ? "On/Off Ramp"
                    : itm?.type == "spritz"
                    ? "Banking"
                    : itm?.type.split("_").join(" ")}
                </span>
                <Switch
                  style={!itm?.is_maintenance ? {backgroundColor:'rgba(0, 0, 0, 0.1)'} : {}}
                  checked={itm?.is_maintenance}
                  disabled={permission_type == "2" ? false : true}
                  onChange={(e) => {
                    showConfirm(itm);
                  }}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default ApplicationMaintenance;
