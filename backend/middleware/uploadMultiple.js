const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

const uploadMultiple = upload.fields([
  { name: 'foto', maxCount: 1 },
  { name: 'fotoRostro', maxCount: 1 }
]);

module.exports = uploadMultiple;
