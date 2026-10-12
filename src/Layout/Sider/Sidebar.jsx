import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid, Layout, Menu } from "antd";
import {
  SettingOutlined,
  AppstoreAddOutlined,
  HistoryOutlined,
  SwapOutlined,
  DashboardOutlined,
  ContainerOutlined,
  UsergroupAddOutlined,
  BarChartOutlined,
  ExceptionOutlined,
} from "@ant-design/icons";
import Qubetics from "../../Images/qubetics.png";
import "./Sidebar.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { setKey } from "../../Redux/slice/sidebarSlice";
function Sidebar({ collapsedState }) {

  const [selectedKey, setSelectedKey] = useState(
    sessionStorage.getItem("activeKey")
  );
  const { Sider } = Layout;
  const dispatch = useDispatch();
  const { useBreakpoint } = Grid;
  const { lg } = useBreakpoint();
  const [menuItems, setMenuItems] = useState(false);
  const navigate = useNavigate();
  const menus = useSelector((state) => state?.userState?.menus);
  const user = useSelector((state) => state?.userState?.user);
  const location = useLocation();
  const swapElement = (value, route, name) => {
    return (
      <p
        onClick={() => {
          dispatch(
            setKey({
              key: route,
              value: value.name,
            })
          );
          sessionStorage.setItem("activeKey", route);
          sessionStorage.setItem("page_title", name);
          navigate(route);
        }}
        className={`subSidebar`}
      >
        {name}
      </p>
    );
  };

  useEffect(() => { }, [menuItems]);

  const findIcon = (e) => {
    if (e == "dashboard") return <DashboardOutlined />;
    if (e == "chain-swap") return <SwapOutlined />;
    if (e == "transaction-details") return <HistoryOutlined />;
    if (e == "token-management") return <AppstoreAddOutlined />;
    if (e == "settings") return <SettingOutlined />;
    if (e == "commission") return <BarChartOutlined />;
    if (e == "push-notification") return <ContainerOutlined />;
    if (e == "banner-management") return <ExceptionOutlined />;
    if (e == "sub-admin-management") return <UsergroupAddOutlined />;
    if (e == "revenue") return <BarChartOutlined />;
    if (e == "app_maintenance" || e == "app-maintenance")
      return <ExceptionOutlined />;
  };

  useEffect(() => {
    (async () => {
      const hasMenuSource =
        user?.role_id == "0"
          ? menus?.length > 0
          : user?.permissions_data?.length > 0;
      if (hasMenuSource) {
        const menuItems = [];
        let menux = [...menus];

        if (user.role_id == "0") {
          menux?.length > 0 &&
            menux?.map((value, index) => {
              let item = {};
              //         "swap"
              //         "SWFTC"
              //         "blockchainswap"
                item = {
                  key: value.id.toString(),
                  label: value.name,
                  icon: findIcon(value?.slug), //icons[index],
                  onClick: () => {
                    dispatch(
                      setKey({ key: value.id.toString(), value: value.name })
                    );
                    sessionStorage.setItem("activeKey", value.id.toString());
                    sessionStorage.setItem("page_title", value.name);
                    navigate(`/${value.slug}`);
                  },
                };

              return menuItems.push(item);
            });
        } else if (user.role_id != "0") {
          let user_permission_data = user?.permissions_data;
          user_permission_data?.length > 0 &&
            user_permission_data?.map((value, index) => {
              let item = {};
              //       value?.menu_list_data?.name,
              //       "revenue",
              //       [
              //             value?.menu_list_data?.name,
              //             "swap",
              //             "On chain Swap"
              //           "swap"
              //             value?.menu_list_data?.name,
              //             "SWFTC",
              //             "Cross chain Swap"
              //           "SWFTC"
              //             value?.menu_list_data?.name,
              //             "spritz",
              //             "Banking"
              //           "spritz"
              //             value?.menu_list_data?.name,
              //             "blockchainswap",
              //             "On/Off Ramp"
              //           "blockchainswap"
                item = {
                  key: value?.menu_list_data?.id.toString(),
                  label: value?.menu_list_data?.name === 'Commission' ? 'Revenue' : value?.menu_list_data?.name,
                  icon: findIcon(value?.menu_list_data?.slug), //icons[index],
                  onClick: () => {
                    dispatch(
                      setKey({
                        key: value?.menu_list_data?.id.toString(),
                        value: value?.menu_list_data?.name,
                      })
                    );
                    sessionStorage.setItem(
                      "activeKey",
                      value?.menu_list_data?.id.toString()
                    );
                    sessionStorage.setItem(
                      "page_title",
                      value?.menu_list_data?.name
                    );
                    navigate(`/${value?.menu_list_data?.slug}`);
                  },
                };
              return menuItems.push(item);
            });
        }

        setMenuItems(menuItems);
      }
    })();
  }, [menus, user?.role_id, user?.permissions_data]);

  function getItem(label, key, icon, children, type, className) {
    return {
      key,
      icon,
      children,
      label,
      type,
      className,
    };
  }

  const checkPermission = () => {
    if (user?.permissions_data) {
      let path = location?.pathname.split("/")[1];
      let isExist =
        Array.isArray(user?.permissions_data) &&
        user?.permissions_data.filter((dt) => {
          return (
            dt?.menu_list_data?.slug == path 
          );
        });
      if (isExist.length == 0) {

        let redirectPath =
          Array.isArray(user?.permissions_data) &&
          user?.permissions_data[0]?.menu_list_data?.slug;
        if (redirectPath) {
          sessionStorage.setItem(
            "activeKey",
            user?.permissions_data[0].menu_list_data?.id?.toString()
          );
          sessionStorage.setItem(
            "page_title",
            user?.permissions_data[0].menu_list_data?.name
          );
          setSelectedKey(
            user?.permissions_data[0].menu_list_data?.id?.toString()
          );
          navigate(redirectPath);
        }
      } else {
        //     path == "swap" ||
        //     path == "SWFTC" ||
        //     path == "spritz" ||

        //       key: path,
        //       value: name,
          let keys = isExist[0].menu_list_data?.id?.toString();
          let vals = isExist[0].menu_list_data?.name;
          dispatch(
            setKey({
              key: keys,
              value: vals,
            })
          );
          sessionStorage.setItem("activeKey", keys);
          sessionStorage.setItem("page_title", vals);
          setSelectedKey(keys);
      }
    }
  };

  useEffect(() => {
    checkPermission();
  }, [location?.pathname, selectedKey]);

  return (
    <Sider
      className="sidebarSec"
      width={250}
      trigger={null}
      collapsible
      collapsed={lg ? collapsedState : true}
    >
      <div className="logo">
        {user.role_id == "0" &&
          (collapsedState === true ? (
            <Link
              to={"/dashboard"}
              onClick={(e) => {
                e.preventDefault();
                dispatch(setKey({ key: "1", value: "Dashboard" }));
                sessionStorage.setItem("activeKey", "1");
                sessionStorage.setItem("page_title", "Dashboard");
                navigate("/dashboard");
              }}
            >
            </Link>
          ) : (
            <Link
              to={"/dashboard"}
              onClick={(e) => {
                e.preventDefault();
                dispatch(setKey({ key: "1", value: "Dashboard" }));
                sessionStorage.setItem("activeKey", "1");
                sessionStorage.setItem("page_title", "Dashboard");
                navigate("/dashboard");
              }}
            >
            </Link>
          ))}
        {user.role_id !== "0" &&
          user?.permissions_data?.length > 0 &&
          (collapsedState === true ? (
            <Link
              to={`/${user?.permissions_data[0].menu_list_data?.slug}`}
              onClick={(e) => {
                e.preventDefault();
                dispatch(
                  setKey({
                    key: user?.permissions_data[0].menu_list_data?.id?.toString(),
                    value: user?.permissions_data[0].menu_list_data?.name,
                  })
                );
                sessionStorage.setItem(
                  "activeKey",
                  user?.permissions_data[0].menu_list_data?.id?.toString()
                );
                sessionStorage.setItem(
                  "page_title",
                  user?.permissions_data[0].menu_list_data?.name
                );
                navigate(`/${user?.permissions_data[0]?.menu_list_data?.slug}`);
              }}
            >
            </Link>
          ) : (
            <Link
              to={`/${user?.permissions_data[0].menu_list_data?.slug}`}
              onClick={(e) => {
                e.preventDefault();
                dispatch(
                  setKey({
                    key: user?.permissions_data[0]?.menu_list_data?.id?.toString(),
                    value: user?.permissions_data[0].menu_list_data?.name,
                  })
                );

                sessionStorage.setItem(
                  "activeKey",
                  user?.permissions_data[0].menu_list_data?.id?.toString()
                );
                sessionStorage.setItem(
                  "page_title",
                  user?.permissions_data[0].menu_list_data?.name
                );
                navigate(`/${user?.permissions_data[0]?.menu_list_data?.slug}`);
              }}
            >
              <img src={Qubetics} alt="img" style={{marginTop:"12px", marginBottom:"11px"}} />
            </Link>
          ))}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[`${selectedKey}`]}
        items={menuItems}
      />
    </Sider>
  );
}

export default Sidebar;
