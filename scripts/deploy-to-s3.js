const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require('fs').promises;
const path = require('path');
const mime = require('mime-types');
require('dotenv').config();

// S3 Client configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const BUILD_DIR = path.join(__dirname, '../dist'); // or '../out' for Next.js

async function uploadFile(filePath, bucketPath) {
  const content = await fs.readFile(filePath);
  const contentType = mime.lookup(filePath) || 'application/octet-stream';

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: bucketPath,
    Body: content,
    ContentType: contentType,
    CacheControl: 'max-age=31536000', // 1 year cache for static assets
  });

  try {
    await s3Client.send(command);
    console.log(`✅ Uploaded: ${bucketPath}`);
  } catch (error) {
    console.error(`❌ Failed to upload ${bucketPath}:`, error);
  }
}

async function uploadDirectory(dirPath, baseDir = dirPath) {
  const files = await fs.readdir(dirPath);

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = await fs.stat(fullPath);

    if (stat.isDirectory()) {
      await uploadDirectory(fullPath, baseDir);
    } else {
      const relativePath = path.relative(baseDir, fullPath);
      const bucketPath = relativePath.split(path.sep).join('/');
      await uploadFile(fullPath, bucketPath);
    }
  }
}

async function deploy() {
  console.log('🚀 Starting deployment to S3...');
  
  try {
    await uploadDirectory(BUILD_DIR);
    console.log('✨ Deployment complete!');
  } catch (error) {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  }
}

deploy(); 