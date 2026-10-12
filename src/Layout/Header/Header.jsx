import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import "./Header.scss";
import ModalComponent from "../../Components/Modal/ModalComponent";
import { useLocation, useNavigate } from "react-router-dom";
import LogoutIcon from "../../Images/logoutIcon.svg";
import { logout } from "../../Redux/slice/userSlice";
import { setToast } from "../../Redux/slice/toastSlice";
import { clearStorage } from "../../common/constant/constant";

function Header({ toggleSidebar, collapsed }) {
  const dispatch = useDispatch();
  const getLocation = useLocation();
  const user = useSelector((state) => state?.userState?.user);
  const menus = useSelector((state) => state?.userState?.menus);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const path = getLocation.pathname.replace("/", "");

    /** if user not super admin */
    if (user && user?.role_id !== "0") {
      let filter_permission_data = user?.permissions_data?.filter(
        (data) => data?.menu_list_data?.slug == path
      );
      if (filter_permission_data?.length > 0) {
        sessionStorage.setItem(
          "permission_type",
          filter_permission_data[0]?.permission_type
        );
        sessionStorage.setItem(
          "activeKey",
          filter_permission_data[0].menu_list_id
        );
      }
    } else {
      sessionStorage.setItem("permission_type", "2");
      let filter_active_page_data = menus?.filter(
        (data) => data.slug.toLowerCase() == path
      );

      if (filter_active_page_data?.length > 0) {
        sessionStorage.setItem("activeKey", filter_active_page_data[0].id);
      }
    }

    let path_arr = path.split("-");

    let page_tile = "";
    if (path_arr?.length > 0) {
      for (let i = 0; i < path_arr?.length; i++) {
        page_tile =
          page_tile !== ""
            ? page_tile +
            " " +
            path_arr[i]?.charAt(0).toUpperCase() +
            path_arr[i]?.slice(1)
            : page_tile +
            path_arr[i]?.charAt(0).toUpperCase() +
            path_arr[i]?.slice(1);
      }
    }

    sessionStorage.setItem("page_title", page_tile);
  }, []);

  const onLogout = () => {
    dispatch(logout({ navigate: navigate }));
    dispatch(setToast({ message: "Logout successfully", status: true }));
    clearStorage();
    setTimeout(() => {
      dispatch(setToast({ message: null, status: false }));
    }, 5000);
  };
  return (
    <div className="header">
      {}

      <div className="header__left">
        <div className="outLined">
          <span onClick={() => toggleSidebar()}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </span>
        </div>
        <h2 style={{ margin: 0 }}>
          {sessionStorage.getItem("page_title")
            ? sessionStorage.getItem("page_title")
            : "Dashboard"}
        </h2>
        {}
        {}
      </div>
      <div className="header__right">
        <button
          onClick={() => setModalOpen(true)}
          className="header__right__logout"
        >
          <img className="whitefilter" src={LogoutIcon} alt="" /> Logout
        </button>
        <ModalComponent
          isModalOpen={modalOpen}
          handleCancel={() => setModalOpen(false)}
          heading="Are you sure you want to logout ?"
          maskClosable={false}
        >
          <div className="header__modal">
            <h4 style={{color: "#fff"}}>Are you sure you want to logout ?</h4>
            <div className="header__modal__buttons">
              <button
                className="btn ant-btn-primary"
                onClick={() => onLogout()}
              >
                Yes
              </button>
              <button
                className="btn ant-btn-primary"
                onClick={() => setModalOpen(false)}
              >
                No
              </button>
            </div>
          </div>
        </ModalComponent>
      </div>
    </div>
  );
}

export default Header;
