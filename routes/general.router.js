import express from 'express';
import generalController from '../controllers/general.controller.js';
import authCheck from '../middleware/auth/is-auth.js';
import checkDentist from '../middleware/auth/is-dentist.js';
import adminCheck from '../middleware/auth/is-admin.js';
import upload from '../middleware/multer/uploadPhoto.js';
import uploadSingleCloudinary from '../middleware/cloudinary/uploadToCloudinary.js';
import validateResource from '../middleware/validateResource.js';
import { changePasswordSchema } from '../schemas/user.schema.js';

const router = express.Router();

router.get('/info', authCheck, adminCheck, generalController.getnfo);

router.get('/settings', authCheck, generalController.getSettingsHandler);

router.post('/changePassword', authCheck, generalController.changePasswordHandler);

router.patch(
  '/settings',
  authCheck,
  upload.single('profilePic'),
  uploadSingleCloudinary,
  generalController.editSettingsHandler,
);

export default router;
