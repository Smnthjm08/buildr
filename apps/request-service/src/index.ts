import express from "express";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import mime from "mime-types";

const app = express();

export const s3 = new S3Client({
  region: process.env.AWS_S3_REGION || "ap-south-1",
  endpoint: `https://s3.ap-south-1.amazonaws.com`,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID! || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY! || "",
  },
});

app.get("/*path", async (req, res) => {
  try {
    const host = req.hostname;
    console.log("host", host);
    const id = host.split(".")[0];
    let filePath = req.path;

    if (filePath === "/" || !filePath.includes(".")) {
      filePath = "/index.html";
    }

    const key = `production/${id}${filePath}`;

    console.log("S3 fetch:", key);

    const obj = await s3.send(
      new GetObjectCommand({
        Bucket: "buildrr-dev",
        Key: key,
      }),
    );

    const body = await obj.Body?.transformToByteArray();

    const type = mime.lookup(filePath) || "application/octet-stream";
    res.set("Content-Type", type);

    res.send(body);
  } catch (err) {
    console.error(err);
    res.status(404).send("File not found");
  }
});

app.listen(5001, () => {
  console.log("app is listening on port 5001");
});
