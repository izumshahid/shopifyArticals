import React, { useState, createContext } from "react";

export const MyContext = createContext();
export const MyProvider = ({ children }) => {
  const [allDNDItems, setAllDNDItems] = useState([]); // contains all the articals coming from shopify
  const [showAddFieldModal, setShowAddFieldModal] = useState(false); // show hide create field modal
  const [allFieldHeading, setAllFieldHeading] = useState([]); // all field headings created to check if same is not being created
  const [fieldHeading, setFieldHeading] = useState(""); //current field heading
  const [fieldType, setFieldType] = useState(""); //current field type
  const [createNewField, setCreateNewField] = useState(false); //when clicked "add" then create new field based on this state
  const [articalSelected, setArticalSelected] = useState(""); // selected shopify artical from dropdown
  const [allShopifyArticals, setallShopifyArticals] = useState([]); // contains all the articals coming from shopify
  const [articalIdSaveInDb, setArticalIdSaveInDb] = useState([]); // constains all articals whih are linked to custom obj
  const [linkedArticles, setLinkedArticles] = useState([]); //this will populate dropdown with articals which are linked and present in db
  const [selectedLinkedArticles, setSelectedLinkedArticles] = useState("-1"); //jo linked articals han konsa select hoa ha ya vo store kara raha ha
  const [shopifyCollections, setShopifyCollections] = useState([]); //containg all the shopify collections
  const [isGettingData, setIsGettingData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shopifyAritcals, setShopifyAritcals] = useState({
    data: [],
    hasNext: false,
    hasPrevious: false,
  });
  const [showGrid, setShowGrid] = useState(true); //this is to toggle btwn grid and DND view
  return (
    <MyContext.Provider
      value={{
        allDNDItems,
        setAllDNDItems,
        showAddFieldModal,
        setShowAddFieldModal,
        allFieldHeading,
        setAllFieldHeading,
        fieldHeading,
        setFieldHeading,
        fieldType,
        setFieldType,
        createNewField,
        setCreateNewField,
        articalSelected,
        setArticalSelected,
        allShopifyArticals,
        setallShopifyArticals,
        articalIdSaveInDb,
        setArticalIdSaveInDb,
        linkedArticles,
        setLinkedArticles,
        selectedLinkedArticles,
        setSelectedLinkedArticles,
        shopifyCollections,
        setShopifyCollections,
        isGettingData,
        setIsGettingData,
        isLoading,
        setIsLoading,
        shopifyAritcals,
        setShopifyAritcals,
        showGrid,
        setShowGrid,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};
