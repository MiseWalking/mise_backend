import aws from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";
import { config } from "../../config.js";

const s3 = new aws.S3({
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
  region: config.region,
});

export const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: config.bucketName,
    key: (req, file, callback) => {
      callback(null, file.originalname);
    },
  }),
});
