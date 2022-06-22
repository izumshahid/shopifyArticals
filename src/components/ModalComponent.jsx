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
