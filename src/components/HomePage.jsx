import { useContext } from "react";
import { Page, Frame } from "@shopify/polaris";
import DND from "./DND";
import { MyContext } from "../MyContext";
import ArticalsGrid from "./ArticalsGrid";

export function HomePage() {
  const { showGrid } = useContext(MyContext);

  return (
    <Frame>
      <Page fullWidth>{showGrid ? <ArticalsGrid /> : <DND />}</Page>
    </Frame>
  );
}
