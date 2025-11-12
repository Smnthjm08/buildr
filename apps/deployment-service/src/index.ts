import { createClient } from "redis";
import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import { pipeline } from "stream";
import { promisify } from "util";

const streamPipeline = promisify(pipeline);

const subscriber = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});
subscriber.on("error", console.error);
await subscriber.connect();

export const s3 = new S3Client({
  region: process.env.AWS_S3_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

async function downloadCodeFromS3(deploymentId: string) {
  const bucket = process.env.AWS_S3_BUCKET_NAME! || "buildrr-dev";
  const outputDir = path.join(__dirname, `output/${deploymentId}`);

  fs.mkdirSync(outputDir, { recursive: true });

  console.log(`📦 Downloading deployment ${deploymentId} from S3...`);

  const listCommand = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: `${deploymentId}/`,
  });

  const listedObjects = await s3.send(listCommand);

  if (!listedObjects.Contents?.length) {
    console.warn(`no files found for ${deploymentId}`);
    return null;
  }

  for (const file of listedObjects.Contents) {
    const key = file.Key!;
    const fileName = key.replace(`${deploymentId}/`, "");
    const localPath = path.join(outputDir, fileName);

    fs.mkdirSync(path.dirname(localPath), { recursive: true });

    const data = await s3.send(
      new GetObjectCommand({ Bucket: bucket, Key: key })
    );
    if (data.Body) {
      await streamPipeline(
        data.Body as NodeJS.ReadableStream,
        fs.createWriteStream(localPath)
      );
      console.log(`downloaded: ${fileName}`);
    }
  }

  console.log(`deployment ${deploymentId} downloaded to ${outputDir}`);
  return outputDir;
}

async function startDeploymentServer() {
  console.log("deployment worker listening for jobs...");

  while (true) {
    const response = await subscriber.brPop("deployment-id", 0);
    const deploymentId = response?.element;

    if (!deploymentId) continue;

    console.log(`received deployment ID: ${deploymentId}`);

    try {
      const localPath = await downloadCodeFromS3(deploymentId);
      console.log(`download complete for ${deploymentId}: ${localPath}`);
    } catch (err) {
      console.error(`failed to download ${deploymentId}:`, err);
    }
  }
}

startDeploymentServer();
