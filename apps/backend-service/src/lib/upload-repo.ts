import { getAllFiles } from "./get-files";
import mime from "mime"
import { uploadToS3 } from "./s3-upload";
import fs from 'fs';
import path from "path";

export async function uploadRepoToS3(localRepoPath: string, s3Prefix: string) {
  const allFiles = getAllFiles(localRepoPath);

  console.log(`ffound ${allFiles.length} files in ${localRepoPath}`);

  for (const filePath of allFiles) {
    const relativePath = path.relative(localRepoPath, filePath).replace(/\\/g, "/");
    const s3Key = `${s3Prefix}/${relativePath}`;
    const contentType = mime.getType(filePath) || "application/octet-stream";
    const fileBuffer = fs.readFileSync(filePath);

    console.log(`🚀 Uploading ${relativePath} → ${s3Key}`);
    await uploadToS3(s3Key, fileBuffer, contentType);
  }

  console.log("\nall files uploaded successfully!");
}
