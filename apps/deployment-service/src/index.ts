import { createClient } from "redis";
import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import { pipeline } from "stream";
import { promisify } from "util";
import { buildProject } from "./build-project";
import mime from "mime-types";

import env from "@workspace/shared/env";

const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_S3_REGION,
  AWS_S3_BUCKET_NAME,
} = env;

const streamPipeline = promisify(pipeline);

const subscriber = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});
subscriber.on("error", console.error);
await subscriber.connect();

export const s3 = new S3Client({
  region: AWS_S3_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

async function downloadCodeFromS3(deploymentId: string) {
  const bucket = AWS_S3_BUCKET_NAME;
  const outputDir = path.join(__dirname, `../output/${deploymentId}`);

  fs.mkdirSync(outputDir, { recursive: true });

  console.log(`Downloading deployment ${deploymentId} from S3...`);

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
      new GetObjectCommand({ Bucket: bucket, Key: key }),
    );
    if (data.Body) {
      await streamPipeline(
        data.Body as NodeJS.ReadableStream,
        fs.createWriteStream(localPath),
      );
      console.log(`downloaded: ${fileName}`);
    }
  }

  console.log(`deployment ${deploymentId} downloaded to ${outputDir}`);
  return outputDir;
}

function getAllFiles(dir: string, fileList: string[] = []) {
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, fileList);
    } else {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

async function uploadBuildToS3(deploymentId: string) {
  const bucket = AWS_S3_BUCKET_NAME;

  const localDist = path.join(__dirname, `../output/${deploymentId}/dist`); // FIXED
  const s3Prefix = `production/${deploymentId}`;

  if (!fs.existsSync(localDist)) {
    throw new Error("dist folder not found at " + localDist);
  }

  const files = getAllFiles(localDist);

  for (const file of files) {
    const relative = path.relative(localDist, file).replace(/\\/g, "/");
    const key = `${s3Prefix}/${relative}`;

    const body = fs.readFileSync(file);
    const contentType = mime.lookup(file) || "application/octet-stream";

    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      }),
    );

    console.log("Uploaded:", key);
  }
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
      console.log("localpath", localPath);
      await buildProject(deploymentId);

      console.log("Build finished — uploading to S3...");

      await uploadBuildToS3(deploymentId);

      console.log(`Deployment uploaded to production/${deploymentId}/`);
    } catch (err) {
      console.error(`failed to download ${deploymentId}:`, err);
    }
  }
}

startDeploymentServer();
