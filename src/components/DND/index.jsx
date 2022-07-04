import React, { useContext, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { BlurDiv, StyledDiv, StyledInput } from "../styled-components";
import Collapsible from "react-collapsible";
import Bounce from "react-reveal/Bounce";
import { MyContext } from "../../MyContext";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Checkbox, Col, Row, Select } from "antd";
import FileUploader from "../AntDFileUploader";

const Index = () => {
  const {
    allDNDItems,
    setAllDNDItems,
    createNewField,
    setCreateNewField,
    fieldType,
    setFieldType,
    fieldHeading,
    setFieldHeading,
    allFieldHeading,
    setAllFieldHeading,
    shopifyCollections,
    isLoading,
  } = useContext(MyContext);

  const deleteField = (idx) => {
    //removing from the item list to remove it from the DOM
    const newItems = [...allDNDItems];
    newItems.splice(idx, 1);
    setAllDNDItems(newItems);

    //when deleteting a field, remove it from allFieldHeading so same key can be added again
    const newAllFieldHeading = [...allFieldHeading];
    newAllFieldHeading.splice(idx, 1);
    setAllFieldHeading(newAllFieldHeading);
  };

  const onDragEnd = (obj) => {
    if (!obj.destination) {
      return;
    }

    const localItems = [...allDNDItems];
    localItems.splice(obj.source.index, 1);
    localItems.splice(obj.destination.index, 0, allDNDItems[obj.source.index]);
    setAllDNDItems(localItems);
  };

  useEffect(() => {
    if (createNewField) {
      switch (fieldType) {
        case "question":
          setAllDNDItems([
            ...allDNDItems,
            {
              id: fieldHeading,
              type: fieldType,
              inputContent: ``,
              textareaContent: ``,
            },
          ]);
          break;

        case "answer":
          setAllDNDItems([
            ...allDNDItems,
            {
              id: fieldHeading,
              type: fieldType,
              inputContent: ``,
              textareaContent: ``,
            },
          ]);
          break;

        case "quote":
          setAllDNDItems([
            ...allDNDItems,
            {
              id: fieldHeading,
              type: fieldType,
              content: ``,
            },
          ]);
          break;

        case "text":
          setAllDNDItems([
            ...allDNDItems,
            {
              id: fieldHeading,
              type: fieldType,
              content: ``,
              checked: false,
            },
          ]);
          break;

        case "image":
          setAllDNDItems([
            ...allDNDItems,
            {
              id: fieldHeading,
              type: fieldType,
              content: [],
              altText: "",
              columns: 1,
              aspectRatio: "32:9",
            },
          ]);
          break;

        case "images":
          setAllDNDItems([
            ...allDNDItems,
            {
              id: fieldHeading,
              type: fieldType,
              content: [],
              altTextFirst: "",
              altTextSecond: "",
            },
          ]);
          break;

        case "collection":
          setAllDNDItems([
            ...allDNDItems,
            {
              id: fieldHeading,
              type: fieldType,
              content: "",
              collectionHeading: "",
            },
          ]);
          break;

        default:
          break;
      }

      setFieldHeading("");
      setFieldType("question");
      setCreateNewField(false);
    }
  }, [createNewField]);

  //quill editor's settings
  const modules = {
    toolbar: [["bold", "italic", "underline"], ["link"]],
  };
  const formats = ["bold", "italic", "underline", "link"];
  //quill editor's settings

  return (
    //

    <div className={allDNDItems.length ? "" : "d-none"}>
      <BlurDiv height="100%" className={isLoading ? "" : "d-none"}>
        <div className="d-flex text-center align-items-center mt-5 flex-column">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <div className="d-block w-100">
            <p>Applying changes</p>
          </div>
        </div>
      </BlurDiv>
      <div>
        <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                style={{
                  backgroundColor: snapshot.isDraggingOver
                    ? "#b9bebb3d"
                    : "#b9bebb3d",
                  padding: "8px",
                  height: "100%",
                  minHeight: "300px",
                }}
              >
                {allDNDItems.map((item, idx) => (
                  <Draggable key={item.id} draggableId={item.id} index={idx}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          userSelect: "none",
                          margin: "8px",
                          backgroundColor: snapshot.isDragging
                            ? "#ecf1ef"
                            : "#ecf1ef",
                          ...provided.draggableProps.style,
                        }}
                      >
                        <Bounce top>
                          <Collapsible
                            trigger={
                              <h6
                                style={{
                                  padding: "10px 0 10px 15px",
                                  margin: "0",
                                  backgroundColor: "lightgray",
                                }}
                              >
                                <div className="d-flex justify-content-between">
                                  <div className="d-flex">
                                    <div className="d-inline-block">
                                      <i className="fa fa-bars"></i>
                                    </div>
                                    <div className="d-flex mx-sm-3">
                                      <span
                                        className="d-inline-block text-truncate"
                                        style={{ maxWidth: "500px" }}
                                      >
                                        {item.id}
                                      </span>
                                    </div>
                                  </div>

                                  <div
                                    onClick={() => deleteField(idx)}
                                    className="d-flex align-items-center mx-sm-3"
                                  >
                                    <i className="fa fa-close"></i>
                                  </div>
                                </div>
                              </h6>
                            }
                          >
                            <StyledDiv key={idx}>
                              {item.type === "question" ? (
                                <>
                                  <StyledInput
                                    placeholder="Please enter ..."
                                    value={item.inputContent}
                                    onChange={(e) => {
                                      const newItems = [...allDNDItems];
                                      newItems[idx].inputContent =
                                        e.target.value;
                                      setAllDNDItems(newItems);
                                    }}
                                    type="text"
                                  />
                                  <ReactQuill
                                    modules={modules}
                                    formats={formats}
                                    value={item.textareaContent}
                                    style={{
                                      backgroundColor: "#fff",
                                      height: "200px",
                                    }}
                                    placeholder="Please enter ..."
                                    onChange={(e) => {
                                      const newItems = [...allDNDItems];
                                      newItems[idx].textareaContent = e;
                                      setAllDNDItems(newItems);
                                    }}
                                  />
                                </>
                              ) : item.type === "answer" ? (
                                <>
                                  <StyledInput
                                    placeholder="Please enter ..."
                                    value={item.inputContent}
                                    onChange={(e) => {
                                      const newItems = [...allDNDItems];
                                      newItems[idx].inputContent =
                                        e.target.value;
                                      setAllDNDItems(newItems);
                                    }}
                                    type="text"
                                  />
                                  <ReactQuill
                                    modules={modules}
                                    formats={formats}
                                    value={item.textareaContent}
                                    style={{
                                      backgroundColor: "#fff",
                                      height: "200px",
                                    }}
                                    placeholder="Please enter ..."
                                    onChange={(e) => {
                                      const newItems = [...allDNDItems];
                                      newItems[idx].textareaContent = e;
                                      setAllDNDItems(newItems);
                                    }}
                                  />
                                </>
                              ) : item.type === "quote" ? (
                                <ReactQuill
                                  modules={modules}
                                  formats={formats}
                                  value={item.content}
                                  style={{
                                    backgroundColor: "#fff",
                                    height: "200px",
                                  }}
                                  placeholder="Please enter ..."
                                  onChange={(e) => {
                                    const newItems = [...allDNDItems];
                                    newItems[idx].content = e;
                                    setAllDNDItems(newItems);
                                  }}
                                />
                              ) : item.type === "text" ? (
                                <>
                                  <div>
                                    <ReactQuill
                                      modules={modules}
                                      formats={formats}
                                      value={item.content}
                                      style={{
                                        backgroundColor: "#fff",
                                        height: "200px",
                                      }}
                                      placeholder="Please enter ..."
                                      onChange={(e) => {
                                        const newItems = [...allDNDItems];
                                        newItems[idx].content = e;
                                        setAllDNDItems(newItems);
                                      }}
                                    />
                                  </div>
                                  <div className="my-3 p-0">
                                    <Checkbox
                                      checked={item.checked}
                                      onChange={(e) => {
                                        const newItems = [...allDNDItems];
                                        newItems[idx].checked =
                                          e.target.checked;
                                        setAllDNDItems(newItems);
                                      }}
                                    >
                                      Capitalize first text
                                    </Checkbox>
                                  </div>
                                </>
                              ) : item.type === "image" ? (
                                <>
                                  <Row className="mb-2">
                                    <Col md={6}>
                                      <Select
                                        className="d-block"
                                        value={item.columns}
                                        placeholder="Columns"
                                        onChange={(value) => {
                                          const newItems = [...allDNDItems];
                                          newItems[idx].columns = value;
                                          setAllDNDItems(newItems);
                                        }}
                                      >
                                        {Array.from(Array(12).keys()).map(
                                          (i, idx) => (
                                            <Select.Option
                                              key={i + 1}
                                              value={i + 1}
                                            >
                                              {i + 1} column
                                              {idx === 0 ? "" : "s"}
                                            </Select.Option>
                                          )
                                        )}
                                      </Select>
                                    </Col>
                                    <Col className="mx-2" md={6}>
                                      <Select
                                        className="d-block"
                                        value={item.aspectRatio}
                                        placeholder="Aspet ratio"
                                        onChange={(value) => {
                                          const newItems = [...allDNDItems];
                                          newItems[idx].aspectRatio = value;
                                          setAllDNDItems(newItems);
                                        }}
                                      >
                                        <Select.Option value="32:9">
                                          32:9
                                        </Select.Option>
                                        <Select.Option value="21:9">
                                          21:9
                                        </Select.Option>
                                        <Select.Option value="16:9">
                                          16:9
                                        </Select.Option>
                                        <Select.Option value="16:10">
                                          16:10
                                        </Select.Option>
                                        <Select.Option value="4:3">
                                          4:3
                                        </Select.Option>
                                      </Select>
                                    </Col>

                                    <Col md={6}>
                                      <StyledInput
                                        placeholder="Text for image"
                                        height="32px"
                                        value={item.altText}
                                        className="form-control mb-0"
                                        onChange={(e) => {
                                          const newItems = [...allDNDItems];
                                          newItems[idx].altText =
                                            e.target.value;
                                          setAllDNDItems(newItems);
                                        }}
                                        type="text"
                                      />
                                    </Col>
                                  </Row>
                                  <FileUploader index={idx} />
                                </>
                              ) : item.type === "images" ? (
                                <>
                                  <Row>
                                    <Col md={6}>
                                      <StyledInput
                                        placeholder="Text for first image"
                                        value={item.altTextFirst}
                                        height="32px"
                                        className="form-control"
                                        onChange={(e) => {
                                          const newItems = [...allDNDItems];
                                          newItems[idx].altTextFirst =
                                            e.target.value;
                                          setAllDNDItems(newItems);
                                        }}
                                        type="text"
                                      />
                                    </Col>

                                    <Col md={6}>
                                      <StyledInput
                                        placeholder="Text for second image"
                                        value={item.altTextSecond}
                                        height="32px"
                                        className="form-control mx-2"
                                        onChange={(e) => {
                                          const newItems = [...allDNDItems];
                                          newItems[idx].altTextSecond =
                                            e.target.value;
                                          setAllDNDItems(newItems);
                                        }}
                                        type="text"
                                      />
                                    </Col>
                                  </Row>
                                  <FileUploader index={idx} count={2} />
                                </>
                              ) : item.type === "collection" ? (
                                <>
                                  <Row>
                                    <Col md={6}>
                                      <StyledInput
                                        placeholder="Collection heading"
                                        value={item.altTextSecond}
                                        height="32px"
                                        className="form-control"
                                        onChange={(e) => {
                                          const newItems = [...allDNDItems];
                                          newItems[idx].collectionHeading =
                                            e.target.value;
                                          setAllDNDItems(newItems);
                                        }}
                                        type="text"
                                      />
                                    </Col>
                                  </Row>

                                  <Select
                                    disabled={!shopifyCollections.length}
                                    showSearch
                                    style={{
                                      width: 200,
                                    }}
                                    value={item.content || "Search to Select"}
                                    className="articleSelect"
                                    placeholder="Search to Select"
                                    optionFilterProp="children"
                                    onChange={(value) => {
                                      const newItems = [...allDNDItems];
                                      newItems[idx].content = value;
                                      setAllDNDItems(newItems);
                                    }}
                                  >
                                    {shopifyCollections?.map(
                                      ({ id, title }) => (
                                        <Select.Option key={id} value={id}>
                                          {String(title).toLocaleLowerCase()}
                                        </Select.Option>
                                      )
                                    )}
                                  </Select>
                                </>
                              ) : null}
                            </StyledDiv>
                          </Collapsible>
                        </Bounce>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default Index;
