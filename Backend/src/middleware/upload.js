const multer = require('multer');
const path = require('path');

// Memory storage for processing before upload to cloudinary
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Images
  if (file.fieldname === 'images' || file.fieldname === 'image' || file.fieldname === 'avatar' || file.fieldname === 'logo' || file.fieldname === 'coverImage') {
    const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (jpeg, jpg, png, gif, webp, svg) are allowed'), false);
    }
  }
  // CSV/Excel for batch upload
  else if (file.fieldname === 'file') {
    const allowedTypes = /csv|xlsx|xls/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (extname) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV and Excel files are allowed'), false);
    }
  }
  else {
    cb(null, true);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit
    files: 10 // Max 10 files
  }
});

module.exports = upload;