import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import env from "@workspace/shared/env";

const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_S3_REGION,
  AWS_S3_BUCKET_NAME,
} = env;

export const s3 = new S3Client({
  region: AWS_S3_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

export async function uploadToS3(
  key: string,
  file: Buffer | Uint8Array | string,
  contentType: string,
) {
  if (!AWS_S3_BUCKET_NAME || !AWS_S3_REGION) {
    throw new Error("Missing S3 environment variables");
  }

  try {
    const command = new PutObjectCommand({
      Bucket: AWS_S3_BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: contentType,
    });

    await s3.send(command);

    return `https://${AWS_S3_BUCKET_NAME}.s3.${AWS_S3_REGION}.amazonaws.com/${key}`;
  } catch (error) {
    console.error("failed to upload file to S3:", error);
    throw new Error("S3 upload failed");
  }
}
