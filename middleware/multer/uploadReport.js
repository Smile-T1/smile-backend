import multer from 'multer';

const storage = multer.memoryStorage();
//single file upload(report)

const uploadfile = multer({ storage: storage, limits: { fileSize: 1024 * 1024 * 5 } }).single('report');

export default uploadfile;
