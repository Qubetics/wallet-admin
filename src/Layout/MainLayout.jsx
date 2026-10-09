import React, { useState } from "react";
import { Layout } from "antd";
import Sidebar from "./Sider/Sidebar";
import Header from "./Header/Header";
import { Outlet, useLocation } from "react-router-dom";
import RouteErrorBoundary from "./RouteErrorBoundary";
import Footer from "./Footer/Footer";
const { Content } = Layout;

function MainLayout(props) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  return (
    <Layout style={{ height: "100%" }}>
      <Sidebar collapsedState={collapsed} />
      <Layout>
        <Header
          toggleSidebar={() => setCollapsed(!collapsed)}
          collapsed={collapsed}
        />
        <Content className="site-layout-background">
          <RouteErrorBoundary key={location.pathname}>
            <Outlet />
          </RouteErrorBoundary>
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
}

export default MainLayout;
