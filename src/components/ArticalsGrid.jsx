import React, { useContext, useRef, useState } from "react";
import { useEffect } from "react";
import { shopifyFrontApolloClient } from "../../apolloClients";
import { GET_ARTICALS_BACKWORD, GET_ARTICALS_FARWORD } from "../../GQL/Queries";
import { MyContext } from "../MyContext";
import axios from "axios";

// ANTD
import { Button, Input, Select, Space, Table } from "antd";
import { notificationError } from "../../utils/helper";
import ModalWarning from "./ModalWarning";
import { StyledButton } from "./styled-components";
import {
  DisconnectOutlined,
  EditOutlined,
  LeftOutlined,
  LinkOutlined,
  RightOutlined,
  SearchOutlined,
} from "@ant-design/icons";

const ArticalsGrid = () => {
  const {
    shopifyAritcals,
    setShopifyAritcals,
    articalIdSaveInDb,
    setArticalIdSaveInDb,
    setShowGrid,
    setArticalSelected,
    setAllDNDItems,
    setIsGettingData,
    setAllFieldHeading,
    isLoading,
    setIsLoading,
  } = useContext(MyContext);
  const [removeLink, setRemoveLink] = useState({
    id: "",
    title: "",
    showModal: false,
    error: "",
    secretKey: "",
  });
  const [page, setPage] = useState(0);

  const searchInput = useRef(null);

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
      <div
        style={{
          padding: 8,
        }}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            className="d-flex align-items-center rounded"
          >
            Search
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) => text,
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: `image`,
      render: (_, record) => {
        return (
          <div className="avatar " style={{ width: "70px", height: "50px" }}>
            <a href={record.articalStoreUrl} target="_blank">
              <img
                className="w-100 rounded h-100 "
                src={
                  record?.image ||
                  "https://mivatek.global/wp-content/uploads/2021/07/placeholder.png"
                }
                alt={record?.image?.alt}
              />
            </a>
          </div>
        );
      },
    },
    {
      title: "Author",
      dataIndex: "author",
      key: `author`,
      ...getColumnSearchProps("author"),
    },
    {
      title: "Name",
      dataIndex: "title",
      key: "title",
      ...getColumnSearchProps("title"),
    },
    // {
    //   title: "Updated at",
    //   dataIndex: "updated_at",
    //   key: "updated_at",
    //   render: (_, record) => {
    //     return (
    //       <div>
    //         {/* //show updated with time */}
    //         {new Date(record?.updated_at).toLocaleString(
    //           window.navigator.userLanguage || window.navigator.language,
    //           {
    //             month: "short",
    //             day: "numeric",
    //             year: "2-digit",
    //             hour: "numeric",
    //             minute: "numeric",
    //           }
    //         )}
    //       </div>
    //     );
    //   },
    // },
    {
      title: "Action",
      key: "action",
      width: "11%",
      render: (_, record) => (
        <div>
          <StyledButton
            marginBotton="0"
            marginRight="10px"
            className="btn"
            backgroundColor="#fff"
            hoverBackgroundColor={
              articalIdSaveInDb.includes(String(record.id))
                ? "#198754"
                : "#0d6efd"
            }
            hoverFontColor="#fff"
            inputColor={
              articalIdSaveInDb.includes(String(record.id))
                ? "#198754"
                : "#0d6efd"
            }
            border={
              articalIdSaveInDb.includes(String(record.id))
                ? "1px solid #198754"
                : "1px solid #0d6efd"
            }
            width="fit-content"
            padding="3px 5px"
            title={
              articalIdSaveInDb.includes(String(record.id))
                ? "Edit the linked object"
                : "Link a custom object to this article"
            }
            onClick={() => {
              articalIdSaveInDb.includes(String(record.id))
                ? handleEdit(record)
                : handleAdd(record);
            }}
          >
            {articalIdSaveInDb.includes(String(record.id)) ? (
              <EditOutlined />
            ) : (
              <LinkOutlined />
            )}
          </StyledButton>
          {articalIdSaveInDb.includes(String(record.id)) ? (
            <StyledButton
              marginBotton="0"
              marginRight="0"
              className="btn"
              backgroundColor="#fff"
              hoverBackgroundColor="#ffc107"
              hoverFontColor="#fff"
              inputColor="#ffc107"
              border="1px solid #ffc107"
              width="fit-content"
              padding="3px 5px"
              title="Remove link object to this artical"
              onClick={() => {
                setRemoveLink({
                  id: record.id,
                  title: record.title,
                  showModal: true,
                });
              }}
            >
              <DisconnectOutlined />
            </StyledButton>
          ) : null}
        </div>
      ),
    },
  ];

  const getShopifyArticalsBackwordDirection = async (
    cursorValue = null,
    perPageRec = 5
  ) => {
    setIsLoading(true);
    const { data: { articles: { edges = [], pageInfo = {} } = {} } = {} } =
      await shopifyFrontApolloClient.query({
        query: GET_ARTICALS_BACKWORD,
        variables: {
          cursor: cursorValue,
          perPage: perPageRec,
        },
      });

    setIsLoading(false);
    let articalIdsFromShopify = edges.map((edge) => {
      return {
        author: edge.node.authorV2.name,
        id: edge.node.id,
        title: edge.node.title,
        cursor: edge.cursor,
        image: edge.node?.image?.src || undefined,
      };
    });

    setShopifyAritcals({
      ...shopifyAritcals,
      data: articalIdsFromShopify,
      firstNodeCursor: edges[0].cursor,
      lastNodeCursor: edges[edges.length - 1].cursor,
      hasNext: pageInfo.hasNextPage,
      hasPrevious: pageInfo.hasPreviousPage,
    });
    setPage(page - 1);
  };

  //get articals form shopify in farword direction
  const getShopifyArticalsFarwordDirection = async (
    cursorValue = null,
    perPageRec = 5
  ) => {
    setIsLoading(true);
    const { data: { articles: { edges = [], pageInfo = {} } = {} } = {} } =
      await shopifyFrontApolloClient.query({
        query: GET_ARTICALS_FARWORD,
        variables: {
          cursor: cursorValue,
          perPage: perPageRec,
        },
      });

    setIsLoading(false);
    let articalIdsFromShopify = edges.map((edge) => {
      return {
        author: edge.node.authorV2.name,
        id: edge.node.id,
        title: edge.node.title,
        cursor: edge.cursor,
        image: edge.node?.image?.src || undefined,
        articalStoreUrl: edge.node?.onlineStoreUrl,
      };
    });

    setShopifyAritcals({
      ...shopifyAritcals,
      data: articalIdsFromShopify,
      firstNodeCursor: edges[0].cursor,
      lastNodeCursor: edges[edges.length - 1].cursor,
      hasNext: pageInfo.hasNextPage,
      hasPrevious: pageInfo.hasPreviousPage,
    });
    setPage(page + 1);
    // var config = {
    //   method: "get",
    //   url: "/api/getArticals",
    // };

    // try {
    //   setIsLoading(true);
    //   const { data: { articles = [] } = {} } = await axios(config);
    //   setIsLoading(false);
    //   setShopifyAritcals({
    //     ...shopifyAritcals,
    //     data: articles,
    //     //   hasNext: pageInfo.hasNextPage,
    //     //   hasPrevious: pageInfo.hasPreviousPage,
    //   });
    // } catch (error) {
    //   const { response: { data: { message } = {} } = {} } = error;
    //   notificationError({
    //     message: "Error",
    //     description: message,
    //   });
    //   setIsLoading(false);
    // }
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
      getShopifyArticalsFarwordDirection();
    } catch (err) {
      setIsLoading(false);
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
    setIsLoading(true);
    getAllAritcalIdsFromDb();
    setPage(0);
  }, []);

  return (
    <div className="container">
      <h3 className="w-50 m-auto text-center mb-5">
        <span>Articles</span>
      </h3>
      <Table
        className="articalsTable"
        loading={isLoading}
        size="small"
        columns={columns}
        dataSource={shopifyAritcals.data}
        pagination={false}
        // pagination={{
        //   showSizeChanger: false,
        //   current: shopifyAritcals.page,
        //   pageSize: 5,
        //   nextIcon: (
        //     <RightOutlined
        //       style={shopifyAritcals.hasNext ? {} : { display: "none " }}
        //       onClick={() => {
        //         shopifyAritcals.hasNext &&
        //           getShopifyArticalsFarwordDirection(
        //             shopifyAritcals.lastNodeCursor
        //           );

        //         // console.log(shopifyAritcals);
        //       }}
        //     />
        //   ),
        //   prevIcon: (
        //     <LeftOutlined
        //       style={shopifyAritcals.hasPrevious ? {} : { display: "none " }}
        //       onClick={() => {
        //         shopifyAritcals.hasPrevious &&
        //           getShopifyArticalsBackwordDirection(
        //             shopifyAritcals.firstNodeCursor
        //           );
        //       }}
        //     />
        //   ),
        // }}
      />
      <div
        className={
          shopifyAritcals.data.length
            ? "mt-2 d-flex justify-content-end align-items-center"
            : "d-none"
        }
      >
        <Button
          type="primary"
          className={
            shopifyAritcals.hasPrevious
              ? "rounded d-flex align-item.center"
              : "d-none"
          }
          onClick={() => {
            shopifyAritcals.hasPrevious &&
              getShopifyArticalsBackwordDirection(
                shopifyAritcals.firstNodeCursor
              );
          }}
        >
          <LeftOutlined
            style={{
              lineHeight: "normal",
            }}
          />
        </Button>
        <p
          style={{
            margin: "0 5px",
            border: "1px solid #e3e3e3",
            padding: "4px 15px",
            borderRadius: "4px",
          }}
        >
          {page}
        </p>
        <Button
          type="primary"
          className={
            shopifyAritcals.hasNext
              ? "rounded d-flex align-item.center"
              : "d-none"
          }
          onClick={() => {
            shopifyAritcals.hasNext &&
              getShopifyArticalsFarwordDirection(
                shopifyAritcals.lastNodeCursor
              );
          }}
        >
          <RightOutlined
            style={{
              lineHeight: "normal",
            }}
          />
        </Button>
      </div>

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
