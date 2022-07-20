import React, { useContext } from "react";
import "antd/dist/antd.css";
import { PlusOutlined } from "@ant-design/icons";
import { Modal, Upload } from "antd";
import { useState } from "react";
import { useEffect } from "react";
import { MyContext } from "../MyContext";
import { notificationError } from "../../utils/helper";

const ImageUploader = ({ index, count = 1 }) => {
  const { allDNDItems, setAllDNDItems } = useContext(MyContext);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([
    // {
    //   name: "xxx.png",
    //   status: "done",
    //   url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    //   thumbUrl:
    //     "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    // },
  ]);

  // conver tfile to btoa

  const handleCancel = () => setPreviewVisible(false);

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleChange = async ({ fileList: newFileList }) => {
    //check size for multiple ffiles
    let isGreater = false;

    //while uploading multiple files if any one file is greater than 3mb then show toast and not add it in the list
    newFileList.forEach((file) => {
      if (file.size > 1024 * 1024 * 3) {
        notificationError({
          message: "Error",
          description: "Please upload file less than 3mb",
        });

        isGreater = true;
      }
    });

    //if any file is greater than 3MB, don't upload or push to state
    if (isGreater) return;

    let localFileList = [...newFileList];
    localFileList.forEach(async function (file, index) {
      file.base64Str =
        file?.originFileObj && (await getBase64(file.originFileObj));
    });

    const newAllDNDItems = [...allDNDItems];
    newAllDNDItems[index].content = [...localFileList];

    setFileList([...newFileList]);
    setAllDNDItems([...newAllDNDItems]);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  useEffect(() => {
    allDNDItems[index].content.length &&
      setFileList(allDNDItems[index].content);
  }, []);

  return (
    <>
      <Upload
        accept=".png,.jpg,.jpeg"
        action={`${process.env.HOST}/api/uploadImage`}
        listType="picture-card"
        fileList={fileList}
        onRemove={() => console.log("")}
        onPreview={handlePreview}
        onChange={handleChange}
      >
        {fileList.length >= count ? null : uploadButton}
      </Upload>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img
          alt="example"
          style={{
            width: "100%",
          }}
          src={previewImage}
        />
      </Modal>
    </>
  );
};

export default ImageUploader;
