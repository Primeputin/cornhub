const multer = require('multer');
const path = require('path');

// Set up Multer storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // null means no error
      cb(null, 'uploads/'); // Destination directory where uploaded files will be stored
    },
    filename: function (req, file, cb) {
      // File naming
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // path.extname will get the file extensione fo the file name
    }
  });
  
// Create Multer instance
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 } // 5MB file size limit
}).single('image');

// Create Multer instance for multiple file upload
const uploadMultiple = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 } // 5MB file size limit
}).array('images', 5); // Up to 5 files can be uploaded in a single request

module.exports = {upload, uploadMultiple }