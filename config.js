import dotenv from "dotenv";

// .env에 작성한 환경 변수를 현재 서버 세션의 환경에 등록해준다
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT),
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  region: process.env.region,
  bucketName: process.env.bucketName,
};
