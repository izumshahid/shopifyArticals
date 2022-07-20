import { AppProvider as PolarisProvider } from "@shopify/polaris";
import translations from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./assets/style.css";
import "antd/dist/antd.css";

import { HomePage } from "./components/HomePage";
import { MyProvider } from "./MyContext";
import { Layout } from "antd";
import SideBar from "./components/DND/SideBar";
import ArtiaclPreview from "./components/ArtiaclPreview";
const { Content, Sider } = Layout;

export default function App() {
  return (
    <PolarisProvider i18n={translations}>
      <MyProvider>
        <Layout>
          <Layout>
            <Sider className="DNDSideBar">
              <SideBar />
            </Sider>
            <Content
              style={{
                background: "#fff",
              }}
            >
              <HomePage />
            </Content>
            <Sider className="previewBar">
              <ArtiaclPreview />
            </Sider>
          </Layout>
        </Layout>
      </MyProvider>
    </PolarisProvider>
  );
}
