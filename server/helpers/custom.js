import axios from "axios";
import { PutObjectCommand, S3 } from "@aws-sdk/client-s3";
import fs from "fs";

const s3Client = new S3({
  endpoint: process.env.SPACES_ENDPOINT,
  region: "sgp1",
  credentials: {
    accessKeyId: process.env.SPACE_KEY,
    secretAccessKey: process.env.SPACE_SECRET,
  },
});

// Uploads the specified file to the chosen path.
export const uploadToDOSpace = async ({
  isImage = true,
  file,
  folder,
  name = null,
  contentToUpload = null,
}) => {
  let UploadingfileContent;
  let UploadingfileName;

  if (isImage) {
    const { filename, path } = file;
    UploadingfileName = name || filename;
    UploadingfileContent = fs.readFileSync(path);
  } else {
    UploadingfileContent = contentToUpload;
  }

  const bucketParams = {
    Bucket: process.env.SPACE_BUCKET_NAME,
    Key: `${folder}/${String(UploadingfileName).split("_print_fresh_")[0]}`,
    Body: UploadingfileContent,
    ACL: "public-read",
  };

  try {
    const data = await s3Client.send(new PutObjectCommand(bucketParams));
    return data;
  } catch (err) {
    console.log("Error uploadToDOSpace : ", err);
  }
};
