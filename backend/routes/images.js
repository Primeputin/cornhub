const express = require('express');
const { getImages, getImage, createImage, deleteImage } = require('../controllers/imageController');
const { upload, uploadMultiple } = require('../multerConfig');

const router = express.Router();

router.get("/", getImages);

router.get("/:id", getImage);

router.post("/", upload, createImage);

router.delete("/:id", deleteImage);


module.exports = router;