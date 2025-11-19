import express from "express";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import mime from "mime-types";
import env from "@workspace/shared/env";

const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_S3_REGION,
} = env;

const app = express();

export const s3 = new S3Client({
  region: AWS_S3_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

app.get("/*splat", async (req, res) => {
  try {
    const host = req.hostname;
    const id = host.split(".")[0];
    let filePath = req.path;
    const bucket = "buildrr-dev";

    if (filePath === "/index.html") {
      return res.redirect(301, "/");
    }

    const key = `production/${id}${filePath}`;

    try {
      const obj = await s3.send(
        new GetObjectCommand({ Bucket: bucket, Key: key })
      );

      const body = await obj.Body?.transformToByteArray();
      const type = mime.lookup(filePath) || "application/octet-stream";
      res.set("Content-Type", type);
      res.send(body);
      
    } catch (fileErr) {
      if (!filePath.includes(".")) {
        const indexKey = `production/${id}/index.html`;
        const indexObj = await s3.send(
          new GetObjectCommand({ Bucket: bucket, Key: indexKey })
        );
        const indexBody = await indexObj.Body?.transformToByteArray();
        res.set("Content-Type", "text/html");
        res.send(indexBody);
      } else {
        throw fileErr;
      }
    }
  } catch (err) {
    console.error(err);
    res.status(404).send("File not found");
  }
});


app.listen(5001, () => {
  console.log("app is listening on port 5001");
});
