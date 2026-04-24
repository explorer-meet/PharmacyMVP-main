const path = require('path');
const crypto = require('crypto');
const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const S3_BUCKET = process.env.AWS_S3_BUCKET;
const S3_REGION = process.env.AWS_REGION;
const S3_PRESIGNED_URL_EXPIRES = Number(process.env.AWS_S3_PRESIGNED_URL_EXPIRES || 900);
const MAX_PRESIGNED_URL_EXPIRES = 3600;
const MIN_PRESIGNED_URL_EXPIRES = 60;

const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/octet-stream',
]);

let cachedClient = null;

const isS3Ready = () => Boolean(S3_BUCKET && S3_REGION);

const getS3Client = () => {
  if (!isS3Ready()) {
    throw new Error('S3 is not configured. Set AWS_S3_BUCKET and AWS_REGION.');
  }

  if (cachedClient) {
    return cachedClient;
  }

  cachedClient = new S3Client({ region: S3_REGION });
  return cachedClient;
};

const sanitizeFileName = (originalName = 'file') => {
  const ext = path.extname(originalName || '').toLowerCase().slice(0, 10);
  const baseName = path.basename(originalName || 'file', ext)
    .replace(/[^a-zA-Z0-9-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80) || 'file';

  return `${baseName}${ext}`;
};

const buildObjectKey = (folder = 'prescriptions', originalName = 'file') => {
  const safeFolder = String(folder)
    .replace(/(^\/|\/$)/g, '')
    .replace(/[^a-zA-Z0-9/_-]+/g, '')
    .slice(0, 60) || 'prescriptions';
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const randomPart = crypto.randomBytes(8).toString('hex');
  const safeName = sanitizeFileName(originalName);

  return `${safeFolder}/${stamp}-${randomPart}-${safeName}`;
};

const buildPublicUrl = (key) => {
  const normalizedKey = String(key || '').split('/').map(encodeURIComponent).join('/');
  return `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${normalizedKey}`;
};

const uploadBufferToS3 = async ({ buffer, contentType, originalName, folder }) => {
  if (!buffer || !Buffer.isBuffer(buffer)) {
    throw new Error('Invalid file buffer for S3 upload');
  }

  const key = buildObjectKey(folder, originalName);
  const client = getS3Client();

  await client.send(
    new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: ALLOWED_MIME_TYPES.has(contentType) ? contentType : 'application/octet-stream',
      ServerSideEncryption: 'AES256',
    })
  );

  return {
    key,
    url: buildPublicUrl(key),
  };
};

const deleteFileFromS3 = async (key) => {
  if (!key || !isS3Ready()) {
    return;
  }

  const client = getS3Client();
  await client.send(
    new DeleteObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
    })
  );
};

const getSignedS3Url = async (key, expiresIn = S3_PRESIGNED_URL_EXPIRES) => {
  if (!key) {
    return '';
  }

  if (!isS3Ready()) {
    return '';
  }

  const safeExpiresIn = Math.min(
    MAX_PRESIGNED_URL_EXPIRES,
    Math.max(MIN_PRESIGNED_URL_EXPIRES, Number(expiresIn) || S3_PRESIGNED_URL_EXPIRES)
  );

  const client = getS3Client();
  return getSignedUrl(
    client,
    new GetObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
    }),
    { expiresIn: safeExpiresIn }
  );
};

module.exports = {
  isS3Ready,
  uploadBufferToS3,
  deleteFileFromS3,
  getSignedS3Url,
};
