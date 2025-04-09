import { PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "../env.js";
import { randomUUID } from "node:crypto";
import type { AuthCtx } from "../lib/types.js";
import { s3Client } from "../lib/s3-client.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const getUserImagePresignedUrl = async (
  authCtx: AuthCtx,
  fileName: string,
  contentType: string
) => {
  const key = `users/${authCtx.session.userId}/${randomUUID()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: env.S3_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const url = await getSignedUrl(s3Client, command, {
    expiresIn: 5 * 60, // 5 minutes
  });

  return {
    url,
    key,
    imageUrl: `${env.PUBLIC_IMAGE_DOMAIN}/${key}`,
  };
};
