import aws from "aws-sdk";
import dotenv from "dotenv";
import crypto from "crypto";
import { promisify } from "util";

dotenv.config();

const region = "us-east-2";
const bucketName = "track-one";
const accessKey = process.env.AWS_ACCESS_KEY_ID;
const secretKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new aws.S3({
  region,
  accessKeyId: accessKey,
  secretAccessKey: secretKey,
});

export function generateUrl() {
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
