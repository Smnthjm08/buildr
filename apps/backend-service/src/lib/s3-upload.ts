import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  region: process.env.AWS_S3_REGION || "ap-south-1",
  endpoint: `https://s3.ap-south-1.amazonaws.com`,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToS3(
  key: string,
  file: Buffer | Uint8Array | string,
  contentType: string,
) {
  if (!process.env.AWS_S3_BUCKET_NAME || !process.env.AWS_S3_REGION) {
    throw new Error("Missing S3 environment variables");
  }

  try {
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: contentType,
      // ACL: "public-read",
    });

    await s3.send(command);

    return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${key}`;
  } catch (error) {
    console.error("failed to upload file to S3:", error);
    throw new Error("S3 upload failed");
  }
}
