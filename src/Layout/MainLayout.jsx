import React, { useState } from "react";
import { Layout } from "antd";
import Sidebar from "./Sider/Sidebar";
import Header from "./Header/Header";
import { Outlet } from "react-router-dom";
import Footer from "./Footer/Footer";
const { Content } = Layout;

function MainLayout(props) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Layout style={{ height: "100%" }}>
      <Sidebar collapsedState={collapsed} />
      <Layout>
        <Header
          toggleSidebar={() => setCollapsed(!collapsed)}
          collapsed={collapsed}
        />
        <Content className="site-layout-background">
          <Outlet />
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
}

export default MainLayout;
