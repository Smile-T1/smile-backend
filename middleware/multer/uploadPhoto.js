import multer from 'multer';
import appError from '../../utils/app-error.js';

const storage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  const valid = file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png';

  if (valid) {
    cb(null, true);
  } else {
    cb(new appError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage,
  fileFilter: multerFilter,
});

export default upload;
