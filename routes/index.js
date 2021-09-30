const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype === 'image/svg') {
    cb(null, true);
  }
  else cb(null, false);
}

const upload = multer({
  storage,
  limits: {
    fileSize: 1000 * 1024 * 3
  },
  fileFilter
});

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Aware store api' });
});

router.post('/upload', upload.single('product-image'), function (req, res, next) {
  // req.file is the `avatar` file
  res.json('/images/' + req.file.filename);
  // req.body will hold the text fields, if there were any
});

module.exports = router;
