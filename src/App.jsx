import { AppProvider as PolarisProvider } from "@shopify/polaris";
import translations from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./assets/style.css";
import "antd/dist/antd.css";

//BrowserRouter, Routes, Route,
import { Link } from "react-router-dom";

import { HomePage } from "./components/HomePage";
import { MyProvider } from "./MyContext";
import { Layout } from "antd";
import SideBar from "./components/DND/SideBar";
const { Header, Content, Footer, Sider } = Layout;

export default function App() {
  return (
    <PolarisProvider i18n={translations}>
      <MyProvider>
        <Layout>
          <Layout>
            <Sider
              style={{
                background: "#b9bebb3d",
              }}
            >
              <SideBar />
            </Sider>
            <Content
              style={{
                background: "#fff",
              }}
            >
              <HomePage />
            </Content>
          </Layout>
          {/* <Footer>Footer</Footer> */}
        </Layout>
      </MyProvider>
    </PolarisProvider>
  );
}
