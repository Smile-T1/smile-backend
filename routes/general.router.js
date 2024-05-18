import express from 'express';
import generalController from '../controllers/general.controller.js';
import authCheck from '../middleware/auth/is-auth.js';
import checkDentist from '../middleware/auth/is-dentist.js';

const router = express.Router();

router.get('/info', authCheck, generalController.getnfo);

router.get('/settings', authCheck, generalController.getSettingsHandler);
export default router;
