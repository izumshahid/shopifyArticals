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
          <Header
            style={{
              background: "lightblue",
            }}
          >
            <ul className="nav nav-tabs" id="navId">
              <li className="nav-item mx-2">
                <div
                  style={{
                    maxWidth: "100px",
                    height: "60px",
                  }}
                >
                  <img
                    style={{
                      width: "100%",
                      height: "100%",
                      objectfit: "fill",
                    }}
                    src="https://picsum.photos/200/300?random=1"
                  />
                </div>
              </li>
              {/* <li className="nav-item">
                <a href="#tab1Id" className="nav-link">
                  Create
                </a>
              </li>
              <li className="nav-item">
                <a href="#tab5Id" className="nav-link">
                  Update
                </a>
              </li> */}
            </ul>
          </Header>
          <Layout>
            <Sider
              style={{
                background: "lightblue",
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
