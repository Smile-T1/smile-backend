/* eslint-disable camelcase */
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import asyncHandler from 'express-async-handler';

cloudinary.config({
  cloud_name: process.env.APP_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.APP_CLOUDINARY_API_KEY,
  api_secret: process.env.APP_CLOUDINARY_API_SECRET,
});
const uploadSingleCloudinary = asyncHandler(async (req, res, next) => {
  try {
    const image = req.file;
    if (!image) {
      throw new Error('No image file provided');
    }
    const b64 = Buffer.from(image.buffer).toString('base64');
    const dataURI = 'data:' + image.mimetype + ';base64,' + b64;
    const result = await cloudinary.uploader.upload(dataURI, {
      resource_type: 'auto',
    });
    res.locals.image = result.secure_url;
    next();
  } catch (error) {
    res.status(500).json({
      msg: 'Internal error at uploading single media',
    });
  }
});
