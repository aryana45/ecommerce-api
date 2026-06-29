import { v2 as cloudinary } from 'cloudinary';
import config from '../config/index.js';

cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryapiSecret,
});
export default cloudinary;
