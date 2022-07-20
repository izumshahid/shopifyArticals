import React, { useEffect, useState } from "react";
import { Button, Modal, Input } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import axios from "axios";
import { notificationError, notificationSuccess } from "../../utils/helper";

const ModalWarning = ({
  removeLink,
  setRemoveLink,
  getAllAritcalIdsFromDb,
}) => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleOk = async () => {
    ///93d081ad-8bcc-4339-ace5-20e211f8146c
    if (removeLink.secretKey === "asd") {
      setLoading(true);

      var data = JSON.stringify({
        articalId: removeLink.id,
      });
      var config = {
        method: "delete",
        url: "/api/RemoveArticalData",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };
      try {
        const resp = await axios(config);

        setLoading(false);
        setVisible(false);
        setRemoveLink({
          showModal: false,
        });
        getAllAritcalIdsFromDb();
        notificationSuccess({
          message: "Success",
          description: "Artical Removed Successfully",
        });
      } catch (err) {
        notificationError({
          message: "Error",
          description: err.message,
        });
      }
    } else {
      setRemoveLink({
        ...removeLink,
        error: "Incorrect key",
      });
    }
  };

  const handleCancel = () => {
    setVisible(false);
    setRemoveLink({
      showModal: false,
    });
  };

  const handleChange = (e) => {
    setRemoveLink({
      ...removeLink,
      secretKey: e.target.value,
    });
  };

  useEffect(() => {
    setVisible(removeLink.showModal);
  }, [removeLink.showModal]);

  return (
    <Modal
      visible={visible}
      title={<h6 className="w-75 m-0 text-truncate">{removeLink.title}</h6>}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button
          disabled={loading || !removeLink?.secretKey?.length}
          key="submit"
          loading={loading}
          onClick={handleOk}
        >
          Remove
        </Button>,
      ]}
    >
      <p>Are you sure you want to remove the linked data for this article?</p>

      <Input.Password
        placeholder="input secret key"
        className="w-75 form-control"
        onChange={handleChange}
        value={removeLink.secretKey}
        iconRender={(visible) =>
          visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
        }
      />

      <p className="text-danger m-0">{removeLink.error}</p>
    </Modal>
  );
};

export default ModalWarning;
