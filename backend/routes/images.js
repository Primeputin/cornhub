const express = require('express');
const { getImages, getImage, getActualImage, createImage, createImages, deleteImage } = require('../controllers/imageController');
const { upload } = require('../multerConfig');

const router = express.Router();

router.get("/", getImages);

router.get("/:id", getImage);

router.get("/actual/:filename", getActualImage);

router.post("/", upload.single("image"), createImage);

router.post("/multiple", upload.array("images", 5), createImages);

router.delete("/:id", deleteImage);


module.exports = router;