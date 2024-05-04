/* eslint-disable camelcase */
import { v2 as cloudinary } from 'cloudinary';
import asyncHandler from 'express-async-handler';

cloudinary.config({
  cloud_name: process.env.APP_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.APP_CLOUDINARY_API_KEY,
  api_secret: process.env.APP_CLOUDINARY_API_SECRET,
});
const uploadSingleCloudinary = asyncHandler(async (req, res, next) => {
  try {
    const report = req.file;
    let result;
    if (report) {
      const b64 = Buffer.from(report.buffer).toString('base64');
      const dataURI = 'data:' + report.mimetype + ';base64,' + b64;
      result = await cloudinary.uploader.upload(dataURI, {
        resource_type: 'auto',
      });
    }
    res.locals.report = result.secure_url;
    console.log(res.locals.report);
    console.log('nice');
    next();
  } catch (error) {
    res.status(500).json({
      msg: 'Internal error at uploading report',
    });
  }
});

export default uploadSingleCloudinary;
