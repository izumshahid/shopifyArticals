import React, { useState, useContext, useEffect } from "react";
import { Modal } from "@shopify/polaris";
import { MyContext } from "../MyContext";
import { Col, Row } from "antd";

const ModalComponent = () => {
  const {
    showAddFieldModal,
    setShowAddFieldModal,
    setFieldType,
    setFieldHeading,
    allFieldHeading,
    setAllFieldHeading,
    setCreateNewField,
    allDNDItems,
  } = useContext(MyContext);

  const onClose = () => {
    setShowAddFieldModal((showAddFieldModal) => !showAddFieldModal);
    setFieldHeading("");
  };

  //setting the field type selected from radio buttons
  const handleSelect = (newValue) => {
    setCreateNewField(true);
    setFieldType(newValue);
    const heading = newValue + "_" + new Date().getTime();

    setFieldHeading(heading);
    setAllFieldHeading([...allFieldHeading, heading]);
    setShowAddFieldModal((showAddFieldModal) => !showAddFieldModal);
  };

  //if collection is added to the allDNDItems then he cant add another one
  const checkCollectionExists = () => {
    const collections = allDNDItems.filter(
      (item) => item.type === "collection"
    );

    if (collections.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    setFieldType("");
  });

  return (
    <Modal
      large
      open={showAddFieldModal}
      onClose={onClose}
      title={<strong> Add a new field</strong>}
      footer={null}
    >
      <Modal.Section>
        <Row className="mb-3 d-none">
          <Col md={12}>
            <div
              className="fieldTypeOpt"
              onClick={() => {
                handleSelect("question");
              }}
            >
              <h5 className="m-0">Question</h5>
              <p className="text-muted m-0">
                This will add a simple input field and a rich editor.
              </p>
            </div>
          </Col>
          <Col md={12}>
            <div
              className="fieldTypeOpt"
              onClick={() => {
                handleSelect("answer");
              }}
            >
              <h5 className="m-0">Answer</h5>
              <p className="text-muted m-0">
                This will add a simple input field and a rich editor.
              </p>
            </div>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={12}>
            <div
              className="fieldTypeOpt"
              onClick={() => {
                handleSelect("quote");
              }}
            >
              <h5 className="m-0">Quote</h5>
              <p className="text-muted m-0">This will add an editor.</p>
            </div>
          </Col>
          <Col md={12}>
            <div
              className="fieldTypeOpt"
              onClick={() => {
                handleSelect("text");
              }}
            >
              <h5 className="m-0">Text</h5>
              <p className="text-muted m-0">
                This will add a editor and a checkBox.
              </p>
            </div>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={12}>
            <div
              className="fieldTypeOpt"
              onClick={() => {
                handleSelect("image");
              }}
            >
              <h5 className="m-0">Image</h5>
              <p className="text-muted m-0">
                This will add a one image uploader.
              </p>
            </div>
          </Col>
          {checkCollectionExists() ? null : (
            <Col md={12}>
              <div
                className="fieldTypeOpt"
                onClick={() => {
                  handleSelect("collection");
                }}
              >
                <h5 className="m-0">Collection</h5>
                <p className="text-muted m-0">
                  This will add a dropdown to select a shopify collection.
                </p>
              </div>
            </Col>
          )}
        </Row>

        <Row>
          <Col md={12}>
            <div
              className="fieldTypeOpt d-none"
              onClick={() => {
                handleSelect("images");
              }}
            >
              <h5 className="m-0">Images</h5>
              <p className="text-muted m-0">
                This will add a two image uploaders.
              </p>
            </div>
          </Col>
        </Row>
      </Modal.Section>
    </Modal>
  );
};

export default ModalComponent;

/*
import React, { useCallback, useState, useContext } from "react";
import { Modal, RadioButton, TextField } from "@shopify/polaris";
import { MyContext } from "../MyContext";
import { Col, Row } from "antd";

const ModalComponent = () => {
  const [showError, setShowError] = useState({
    show: false,
    message: "",
  }); // to show hide error message
  const {
    showAddFieldModal,
    setShowAddFieldModal,
    fieldType,
    setFieldType,
    fieldHeading,
    setFieldHeading,
    allFieldHeading,
    setAllFieldHeading,
    setCreateNewField,
    allDNDItems,
  } = useContext(MyContext);

  const onClose = () => {
    setShowAddFieldModal((showAddFieldModal) => !showAddFieldModal);
    setFieldType("input");
    setFieldHeading("");
    setShowError({
      show: false,
      message: "",
    });
  };
  const handleHeading = (newValue) => setFieldHeading(newValue);

  const addField = () => {
    setShowError({
      show: false,
      message: "",
    });
    const heading = String(fieldHeading.toLocaleLowerCase())
      .trim()
      .replace(/ /g, "_");

    if (fieldHeading === "") {
      setShowError({
        show: true,
        message: "Heading is required",
      });
      return;
    } else if (allFieldHeading.includes(heading)) {
      setShowError({
        show: true,
        message: "Heading already exists",
      });
      return;
    }
    setCreateNewField(true);
    setFieldType(fieldType);
    setFieldHeading(heading);
    setAllFieldHeading([...allFieldHeading, heading]);
    setShowAddFieldModal((showAddFieldModal) => !showAddFieldModal);
  };

  //setting the field type selected from radio buttons
  const handleChange = useCallback(
    (_checked, newValue) => setFieldType(newValue),
    []
  );

  //if collection is added to the allDNDItems then he cant add another one
  const checkCollectionExists = () => {
    const collections = allDNDItems.filter(
      (item) => item.type === "collection"
    );

    if (collections.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <Modal
      large
      open={showAddFieldModal}
      onClose={onClose}
      title={<strong> Add a new field</strong>}
      primaryAction={{
        content: "Add",
        onAction: addField,
      }}
    >
      <Modal.Section>
        <h5 className="mb-3 text-decoration-underline">Select a field type</h5>
        <Row className="mb-3">
          <Col md={12}>
            <RadioButton
              label={
                <p className="m-0">
                  <strong>Question</strong>
                </p>
              }
              helpText="This will add a simple input field and a rich editor."
              id="question"
              checked={fieldType === "question"}
              onChange={handleChange}
            />
          </Col>
          <Col md={12}>
            <RadioButton
              label={
                <p className="m-0">
                  <strong>Answer</strong>
                </p>
              }
              helpText="This will add a simple input field and a rich editor."
              id="answer"
              checked={fieldType === "answer"}
              onChange={handleChange}
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={12}>
            <RadioButton
              label={
                <p className="m-0">
                  <strong>Quote</strong>
                </p>
              }
              helpText="This will add an editor."
              id="quote"
              checked={fieldType === "quote"}
              onChange={handleChange}
            />
          </Col>
          <Col md={12}>
            <RadioButton
              label={
                <p className="m-0">
                  <strong>Text</strong>
                </p>
              }
              helpText="This will add a editor and a checkBox."
              id="text"
              checked={fieldType === "text"}
              onChange={handleChange}
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={12}>
            <RadioButton
              label={
                <p className="m-0">
                  <strong>Image</strong>
                </p>
              }
              helpText="This will add a one image uploader."
              id="image"
              checked={fieldType === "image"}
              onChange={handleChange}
            />
          </Col>
          <Col md={12}>
            <RadioButton
              label={
                <p className="m-0">
                  <strong>Images</strong>
                </p>
              }
              helpText="This will add a two image uploaders."
              id="images"
              checked={fieldType === "images"}
              onChange={handleChange}
            />
          </Col>
        </Row>

        <Row>
          {checkCollectionExists() ? null : (
            <Col md={12}>
              <RadioButton
                label={
                  <p className="m-0">
                    <strong>Shopify collection</strong>
                  </p>
                }
                helpText="This will add a dropdown to select a shopify collection."
                id="collection"
                checked={fieldType === "collection"}
                onChange={handleChange}
              />
            </Col>
          )}
        </Row>
        <hr />
        <Row>
          <Col md={24}>
            <TextField
              label={
                <h5 className="d-inline-block text-decoration-underline">
                  Heading
                </h5>
              }
              value={fieldHeading}
              placeholder="Main Headings"
              requiredIndicator={true}
              onChange={handleHeading}
              error={
                showError.show ? (
                  <p
                    className="m-0"
                    style={{
                      fonSize: "12px",
                    }}
                  >
                    {showError.message}
                  </p>
                ) : (
                  ""
                )
              }
              autoComplete="off"
            />
          </Col>
        </Row>
      </Modal.Section>
    </Modal>
  );
};

export default ModalComponent;

*/
