import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config({
  path: fileURLToPath(new URL('../.env', import.meta.url)),
});

const requiredCloudinaryEnv = [
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
];

export const isCloudinaryConfigured = () => (
  requiredCloudinaryEnv.every((key) => Boolean(process.env[key]))
);

if (!isCloudinaryConfigured()) {
  throw new Error(
    'Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in server/.env'
  );
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;