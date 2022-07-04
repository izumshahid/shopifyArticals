import { useContext, useState } from "react";
import { Page, Toast, Frame } from "@shopify/polaris";
import DND from "./DND";
import Modal from "./ModalComponent";
import { MyContext } from "../MyContext";
import { Spinner, StyledButton } from "./styled-components";
import { useEffect } from "react";
import axios from "axios";
import { Col, Row, Select } from "antd";
const { Option } = Select;
import { shopifyFrontApolloClient } from "../../apolloClients";
import { GET_ARTICALS, GET_COLLECTIONS } from "../../GQL/Queries";

export function HomePage() {
  const {
    setShowToast,
    showToast,
    setShowAddFieldModal,
    allFieldHeading,
    setAllFieldHeading,
    articalSelected,
    setArticalSelected,
    allShopifyArticals,
    setallShopifyArticals,
    allDNDItems,
    setAllDNDItems,
    setArticalIdSaveInDb,
    linkedArticles,
    setLinkedArticles,
    selectedLinkedArticles,
    setSelectedLinkedArticles,
    setShopifyCollections,
    isGettingData,
    setIsGettingData,
    isLoading,
    setIsLoading,
  } = useContext(MyContext);

  const onSave = async () => {
    var data = JSON.stringify({
      articalId: articalSelected,
      allDNDItems,
    });

    var config = {
      method: "post",
      url: "/api/articalData",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    setIsLoading(true);
    try {
      const res = await axios(config);
      setIsLoading(false);
      setShowToast({
        ...showToast,
        error: false,
        visible: true,
        message: "Saved Successfully",
      });
      setAllDNDItems([]);
      setAllFieldHeading([]);
      setArticalSelected("");
      setArticalIdSaveInDb([]);
      getAllAritcalIdsFromDb();
    } catch (err) {
      if (String(err?.response?.data).includes("PayloadTooLargeError")) {
        setShowToast({
          ...showToast,
          error: true,
          visible: true,
          message: "Too large payload",
        });
      } else {
        setShowToast({
          ...showToast,
          error: true,
          visible: true,
          message: "Failed to save",
        });
      }

      setIsLoading(false);
    }
  };

  const onUpdate = async () => {
    var data = JSON.stringify({
      articalId: selectedLinkedArticles,
      allDNDItems,
    });

    var config = {
      method: "put",
      url: "/api/articalData",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    setIsLoading(true);
    try {
      const res = await axios(config);
      setIsLoading(false);
      setShowToast({
        ...showToast,
        error: false,
        visible: true,
        message: "Updated Successfully",
      });
      setAllDNDItems([]);
      setAllFieldHeading([]);
      setSelectedLinkedArticles("-1");
      setArticalIdSaveInDb([]);
      getAllAritcalIdsFromDb();
    } catch (err) {
      if (String(err?.response?.data).includes("PayloadTooLargeError")) {
        setShowToast({
          ...showToast,
          error: true,
          visible: true,
          message: "Too large payload",
        });
      } else {
        setShowToast({
          ...showToast,
          error: true,
          visible: true,
          message: "Failed to update",
        });
      }
      setIsLoading(false);
    }
  };

  //get artical id form shopify and show only those whch are not already linked
  const getShopifyArticals = async ({ articalIds }) => {
    const { data: { articles: { edges = [] } = {} } = {} } =
      await shopifyFrontApolloClient.query({
        query: GET_ARTICALS,
      });
    let articalIdsFromShopify = edges.map((edge) => {
      return {
        id: edge.node.id,
        title: edge.node.title,
      };
    });
    let articalIdsToSave = articalIdsFromShopify.filter(
      (articalId) => !articalIds.includes(articalId.id)
    );
    let articalIdsToSaveAlso = articalIdsFromShopify.filter((articalId) =>
      articalIds.includes(articalId.id)
    );
    setallShopifyArticals(articalIdsToSave);
    setLinkedArticles(articalIdsToSaveAlso);
  };

  //get artical id from db which are linked to a custom obj
  const getAllAritcalIdsFromDb = async () => {
    var config = {
      method: "get",
      url: "/api/savedArticalIds",
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      let res = await axios(config);
      setArticalIdSaveInDb(res.data);
      getShopifyArticals({ articalIds: res.data.articalIds });
    } catch (err) {
      setShowToast({
        ...showToast,
        error: true,
        visible: true,
        message: "Failed to get saved artical ids",
      });
      console.log(err);
    }
  };

  //get custom data from db for this artical
  const getLinkedArticalDataFromDb = async (articalId) => {
    setIsGettingData(true);
    var data = JSON.stringify({
      articalId,
    });

    var config = {
      method: "post",
      url: "/api/getArticalData",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    try {
      const { data: { articalData = {} } = {} } = await axios(config);

      const { custom_data } = articalData;

      //get all id value from custom data
      let allHeadings = custom_data.map((customData) => {
        return customData.id;
      });
      setAllFieldHeading(allHeadings);
      setAllDNDItems(custom_data);
      setIsGettingData(false);
    } catch (err) {
      setShowToast({
        ...showToast,
        error: true,
        visible: true,
        message: "Failed to get artical data",
      });
      console.log(err);
      setIsGettingData(false);
    }
  };

  const getShopifyCollections = async () => {
    const { data: { collections: { edges = [] } = {} } = {} } =
      await shopifyFrontApolloClient.query({
        query: GET_COLLECTIONS,
      });
    let collections = edges.map(({ node: { id, title } = {} }) => {
      return {
        id,
        title,
      };
    });
    setShopifyCollections(collections);
  };

  useEffect(() => {
    getAllAritcalIdsFromDb();
    getShopifyCollections();
  }, []);

  return (
    <Frame>
      <Page fullWidth>
        <Row className="d-flex">
          <Col span={24}>
            {selectedLinkedArticles !== "-1" ? (
              <StyledButton
                onClick={onUpdate}
                disabled={isLoading || isGettingData}
                backgroundColor={
                  isLoading || isGettingData ? "lightGray" : null
                }
                hoverBackgroundColor={
                  isLoading || isGettingData ? "lightGray" : null
                }
                cursor={isLoading || isGettingData ? "not-allowed" : "pointer"}
              >
                {isLoading ? (
                  <Spinner>
                    <span className="sr-only">Loading...</span>
                  </Spinner>
                ) : (
                  <strong>Update</strong>
                )}
              </StyledButton>
            ) : (
              <StyledButton
                onClick={onSave}
                disabled={
                  isLoading || !allFieldHeading.length || !articalSelected
                }
                backgroundColor={
                  isLoading || !allFieldHeading.length || !articalSelected
                    ? "lightGray"
                    : null
                }
                hoverBackgroundColor={
                  isLoading || !allFieldHeading.length || !articalSelected
                    ? "lightGray"
                    : null
                }
                cursor={
                  isLoading || !allFieldHeading.length || !articalSelected
                    ? "not-allowed"
                    : "pointer"
                }
              >
                {isLoading ? (
                  <Spinner>
                    <span className="sr-only">Loading...</span>
                  </Spinner>
                ) : (
                  <strong>Save</strong>
                )}
              </StyledButton>
            )}

            <StyledButton
              disabled={isLoading || isGettingData}
              backgroundColor={isLoading || isGettingData ? "lightGray" : null}
              hoverBackgroundColor={
                isLoading || isGettingData ? "lightGray" : null
              }
              cursor={isLoading || isGettingData ? "not-allowed" : "pointer"}
              onClick={() => {
                setShowAddFieldModal(true);
              }}
            >
              <strong>Add field</strong>
            </StyledButton>

            <StyledButton
              disabled={!allDNDItems.length || isLoading}
              backgroundColor={
                !allDNDItems.length || isLoading ? "lightGray" : null
              }
              hoverBackgroundColor={
                !allDNDItems.length || isLoading ? "lightGray" : null
              }
              cursor={
                !allDNDItems.length || isLoading ? "not-allowed" : "pointer"
              }
              onClick={() => {
                setAllDNDItems([]);
                setAllFieldHeading([]);
                setArticalSelected("");
                setSelectedLinkedArticles("-1");
              }}
            >
              <strong>Clear all</strong>
            </StyledButton>
          </Col>
        </Row>
        <Row className="mb-3">
          {allShopifyArticals.length ? (
            <Col span={4}>
              <label className="d-block mb-2">
                <strong>Select shopify article</strong>
              </label>
              <Select
                disabled={!allShopifyArticals.length}
                showSearch
                style={{
                  width: 200,
                }}
                value={articalSelected || "Search to Select"}
                className="articleSelect"
                placeholder="Search to Select"
                optionFilterProp="children"
                onChange={(value) => {
                  setArticalSelected(value);
                  setSelectedLinkedArticles("-1");
                }}
                filterOption={(input, option) =>
                  option.children.includes(String(input).toLocaleLowerCase())
                }
                filterSort={(optionA, optionB) =>
                  optionA.children
                    .toLowerCase()
                    .localeCompare(optionB.children.toLowerCase())
                }
              >
                {allShopifyArticals?.map(({ id, title }) => (
                  <Option key={id} value={id}>
                    {String(title).toLocaleLowerCase()}
                  </Option>
                ))}
              </Select>
            </Col>
          ) : null}
          {linkedArticles.length ? (
            <Col span={4}>
              <label className="d-block mb-2">
                <strong>Linked articles</strong>
              </label>
              <Select
                disabled={!linkedArticles.length}
                showSearch
                style={{
                  width: 200,
                }}
                value={selectedLinkedArticles || "Search to Select"}
                className="articleSelect"
                placeholder="Search to Select"
                optionFilterProp="children"
                onChange={(value) => {
                  setSelectedLinkedArticles(value);

                  if (value === "-1") {
                    setAllFieldHeading([]);
                    setAllDNDItems([]);
                  } else {
                    getLinkedArticalDataFromDb(value);
                  }
                }}
                filterOption={(input, option) =>
                  option.children.includes(String(input).toLocaleLowerCase())
                }
              >
                <Select.Option key={"-1"} value={"-1"}>
                  None
                </Select.Option>
                {linkedArticles?.map(({ id, title }) => (
                  <Option key={id} value={id}>
                    {String(title).toLocaleLowerCase()}
                  </Option>
                ))}
              </Select>
            </Col>
          ) : null}
        </Row>
        <Modal />

        {isGettingData ? (
          <div className="d-flex text-center align-items-center mt-5 flex-column">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <div className="d-block w-100">
              <p>Fetching data</p>
            </div>
          </div>
        ) : (
          <DND />
        )}

        {showToast.visible && (
          <Toast
            error={showToast.error}
            content={showToast.message}
            onDismiss={() =>
              setShowToast({
                ...showToast,
                visible: false,
              })
            }
            duration={3000}
          />
        )}
      </Page>
    </Frame>
  );
}
