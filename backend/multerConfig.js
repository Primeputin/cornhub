const multer = require('multer');
const path = require('path');
const fs = require('fs');


const uploadDirectory = 'uploads';
// make the uploads folder if it doesn't exists
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory);
}

// Set up Multer storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // null means no error
      cb(null, uploadDirectory); // Destination directory where uploaded files will be stored
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
});

module.exports = { upload }