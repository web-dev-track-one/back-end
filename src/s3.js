import aws from "aws-sdk";
import crypto from "crypto";
import { promisify } from "util";
import express from "express";

const router = express.Router();

const region = "us-east-2";
const bucketName = "track-one";
const accessKey = process.env.AWS_ACCESS_KEY_ID;
const secretKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new aws.S3({
  region,
  accessKeyId: accessKey,
  secretAccessKey: secretKey,
});

function generateUrl() {
  const rawBytes = crypto.randomBytes(16);
  const token = rawBytes.toString("hex");

  const params = {
    Bucket: bucketName,
    Key: token,
    Expires: 60,
  };
  const uploadUrl = s3.getSignedUrl("putObject", params);
  const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${token}`;

  return { uploadUrl, fileUrl };
}

router.delete("/s3Url", async (req, res) => {
  const { imageUrl } = req.body;
  const params = {
    Key: imageUrl.split(`amazonaws.com/`)[1],
    Bucket: bucketName,
  };

  console.log("params key", params["Key"]);

  try {
    const response = await s3.deleteObject(params).promise();
    console.log("response", response);
    res.status(200).send({ message: "Image deleted successfully" });
  } catch (error) {
    console.log("Error deleting image", error);
    res.status(500).send({ error: "Failed to delete image" });
  }
});

export { router, generateUrl };
