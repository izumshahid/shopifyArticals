import React, { useState, useContext, useEffect } from "react";
import { Modal } from "@shopify/polaris";
import { MyContext } from "../MyContext";
import { Col, Row } from "antd";

const ModalComponent = () => {
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
    fieldCount,
    setFieldCount,
  } = useContext(MyContext);

  const onClose = () => {
    setShowAddFieldModal((showAddFieldModal) => !showAddFieldModal);
    setFieldHeading("");
  };

  //setting the field type selected from radio buttons
  const handleSelect = (newValue) => {
    const countObj = { ...fieldCount };
    setCreateNewField(true);
    setFieldType(newValue);
    const heading = newValue + "_" + countObj[newValue];
    countObj[newValue] = countObj[newValue] + 1;
    setFieldCount({ ...countObj });
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
        <Row className="mb-3">
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
          <Col md={12}>
            <div
              className="fieldTypeOpt"
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

        <Row>
          {checkCollectionExists() ? null : (
            <Col md={12}>
              <div
                className="fieldTypeOpt"
                onClick={() => {
                  handleSelect("collection");
                }}
              >
                <h5 className="m-0">Shopify collection</h5>
                <p className="text-muted m-0">
                  This will add a dropdown to select a shopify collection.
                </p>
              </div>
            </Col>
          )}
        </Row>
      </Modal.Section>
    </Modal>
  );
};

export default ModalComponent;
