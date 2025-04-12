import { S3Client } from "@aws-sdk/client-s3";
import { env } from "../env.js";

export const s3Client = new S3Client({
  endpoint: env.S3_ENDPOINT,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY_ID,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY,
  },
  region: env.S3_REGION,
});

