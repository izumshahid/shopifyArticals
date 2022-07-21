import React, { useContext, useState } from "react";
import { Button, Modal, Input } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { MyContext } from "../MyContext";

const EditPermissionModal = ({ setEditPermission }) => {
  const [error, setError] = useState("");
  const [secret, setSecret] = useState("");
  const [visible, setVisible] = useState(true);

  const { setShowGrid } = useContext(MyContext);

  const handleOk = async () => {
    ///93d081ad-8bcc-4339-ace5-20e211f8146c
    if (secret === "asd") {
      setShowGrid(false);
      setEditPermission(false);
    } else {
      setError("Incorrect key");
    }
  };

  const handleCancel = () => {
    setVisible(false);
    setEditPermission(false);
  };

  const handleChange = (e) => {
    setSecret(e.target.value);
  };

  return (
    <Modal
      visible={visible}
      title="Edit Permission"
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button disabled={!secret.length} key="submit" onClick={handleOk}>
          Submit
        </Button>,
      ]}
    >
      <p>You are about to edit this article.</p>
      <p>Please submit the secret key shared to perform editing.</p>

      <Input.Password
        placeholder="input secret key"
        className="w-75 form-control"
        onChange={handleChange}
        value={secret}
        iconRender={(visible) =>
          visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
        }
      />
      <p className="text-danger m-0">{error}</p>
    </Modal>
  );
};

export default EditPermissionModal;
