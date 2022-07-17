import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { shopifyFrontApolloClient } from "../../apolloClients";
import { GET_ARTICALS } from "../../GQL/Queries";
import { MyContext } from "../MyContext";
import axios from "axios";

// ANTD
import { Skeleton } from "antd";
import { notificationError } from "../../utils/helper";
import ModalWarning from "./ModalWarning";

const ArticalsGrid = () => {
  const {
    shopifyAritcals,
    setShopifyAritcals,
    articalIdSaveInDb,
    setArticalIdSaveInDb,
    showGrid,
    setShowGrid,
    articalSelected,
    setArticalSelected,
    setAllDNDItems,
    setIsGettingData,
    setAllFieldHeading,
  } = useContext(MyContext);
  const [removeLink, setRemoveLink] = useState({
    id: "",
    title: "",
    showModal: false,
    error: "",
    secretKey: "",
  });

  //get articals form shopify
  const getShopifyArticals = async () => {
    const { data: { articles: { edges = [], pageInfo = {} } = {} } = {} } =
      await shopifyFrontApolloClient.query({
        query: GET_ARTICALS,
        variables: {
          cursor: null,
        },
      });

    let articalIdsFromShopify = edges.map((edge) => {
      return {
        author: edge.node.authorV2.name,
        id: edge.node.id,
        title: edge.node.title,
        cursor: edge.cursor,
      };
    });

    setShopifyAritcals({
      ...shopifyAritcals,
      data: articalIdsFromShopify,
      hasNext: pageInfo.hasNextPage,
      hasPrevious: pageInfo.hasPreviousPage,
    });
  };

  //   get custom data from db for this artical
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
      notificationError({
        message: "Error",
        description: err.message,
      });
      setIsGettingData(false);
    }
  };

  //get linked artical IDs from db, to show edit, remove button
  const getAllAritcalIdsFromDb = async () => {
    var config = {
      method: "get",
      url: "/api/savedArticalIds",
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      let { data: { articalIds = [] } = {} } = await axios(config);
      setArticalIdSaveInDb(articalIds);
      getShopifyArticals();
    } catch (err) {
      notificationError({
        message: "Error",
        description: err.message,
      });
    }
  };

  const handleAdd = (artical) => {
    setShowGrid(false);
    setArticalSelected(artical.id);
    setAllDNDItems([]);
  };

  const handleEdit = (artical) => {
    setShowGrid(false);
    setArticalSelected(artical.id);
    getLinkedArticalDataFromDb(artical.id);
  };

  useEffect(() => {
    getAllAritcalIdsFromDb();
    getShopifyArticals();
  }, []);

  return (
    <div className="container">
      <table className="table table-striped table-responsive">
        <thead className="thead-inverse">
          <tr>
            <th>Author</th>
            <th>Name</th>
            <th className="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {shopifyAritcals.data.length ? (
            shopifyAritcals.data.map((artical) => {
              return (
                <tr key={artical.id}>
                  <td>{artical.author}</td>
                  <td>{artical.title}</td>
                  <td className="text-center">
                    <button
                      style={{ borderRadius: "8px" }}
                      className="btn btn-outline-primary px-4 py-2 mx-md-2 my-1"
                      onClick={() => {
                        articalIdSaveInDb?.includes(artical.id)
                          ? handleEdit(artical)
                          : handleAdd(artical);
                      }}
                    >
                      {articalIdSaveInDb?.includes(artical.id) ? "Edit" : "Add"}
                    </button>
                    {articalIdSaveInDb?.includes(artical.id) ? (
                      <button
                        style={{ borderRadius: "8px" }}
                        className="btn btn-outline-warning  px-2 py-2 mx-md-2 my-1"
                        onClick={() => {
                          setRemoveLink({
                            id: artical.id,
                            title: artical.title,
                            showModal: true,
                          });
                        }}
                      >
                        Remove
                      </button>
                    ) : null}
                  </td>
                </tr>
              );
            })
          ) : (
            <>
              <tr>
                <td>
                  <Skeleton
                    active
                    loading
                    paragraph={{
                      rows: 0,
                    }}
                  />
                </td>
                <td>
                  <Skeleton
                    active
                    loading
                    paragraph={{
                      rows: 0,
                    }}
                  />
                </td>
                <td>
                  <Skeleton
                    active
                    loading
                    paragraph={{
                      rows: 0,
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <Skeleton
                    active
                    loading
                    paragraph={{
                      rows: 0,
                    }}
                  />
                </td>
                <td>
                  <Skeleton
                    active
                    loading
                    paragraph={{
                      rows: 0,
                    }}
                  />
                </td>
                <td>
                  <Skeleton
                    active
                    loading
                    paragraph={{
                      rows: 0,
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <Skeleton
                    active
                    loading
                    paragraph={{
                      rows: 0,
                    }}
                  />
                </td>
                <td>
                  <Skeleton
                    active
                    loading
                    paragraph={{
                      rows: 0,
                    }}
                  />
                </td>
                <td>
                  <Skeleton
                    active
                    loading
                    paragraph={{
                      rows: 0,
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <Skeleton
                    active
                    loading
                    paragraph={{
                      rows: 0,
                    }}
                  />
                </td>
                <td>
                  <Skeleton
                    active
                    loading
                    paragraph={{
                      rows: 0,
                    }}
                  />
                </td>
                <td>
                  <Skeleton
                    active
                    loading
                    paragraph={{
                      rows: 0,
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <Skeleton
                    active
                    loading
                    paragraph={{
                      rows: 0,
                    }}
                  />
                </td>
                <td>
                  <Skeleton
                    active
                    loading
                    paragraph={{
                      rows: 0,
                    }}
                  />
                </td>
                <td>
                  <Skeleton
                    active
                    loading
                    paragraph={{
                      rows: 0,
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <Skeleton
                    active
                    loading
                    paragraph={{
                      rows: 0,
                    }}
                  />
                </td>
                <td>
                  <Skeleton
                    active
                    loading
                    paragraph={{
                      rows: 0,
                    }}
                  />
                </td>
                <td>
                  <Skeleton
                    active
                    loading
                    paragraph={{
                      rows: 0,
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <Skeleton
                    active
                    loading
                    paragraph={{
                      rows: 0,
                    }}
                  />
                </td>
                <td>
                  <Skeleton
                    active
                    loading
                    paragraph={{
                      rows: 0,
                    }}
                  />
                </td>
                <td>
                  <Skeleton
                    active
                    loading
                    paragraph={{
                      rows: 0,
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <Skeleton
                    active
                    loading
                    paragraph={{
                      rows: 0,
                    }}
                  />
                </td>
                <td>
                  <Skeleton
                    active
                    loading
                    paragraph={{
                      rows: 0,
                    }}
                  />
                </td>
                <td>
                  <Skeleton
                    active
                    loading
                    paragraph={{
                      rows: 0,
                    }}
                  />
                </td>
              </tr>
            </>
          )}
        </tbody>
      </table>
      {removeLink.showModal ? (
        <ModalWarning
          removeLink={removeLink}
          setRemoveLink={setRemoveLink}
          getAllAritcalIdsFromDb={getAllAritcalIdsFromDb}
        />
      ) : null}
    </div>
  );
};

export default ArticalsGrid;
