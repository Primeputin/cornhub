const express = require('express');
const { getPosts, getPost, createPost, deletePost, updatePost } = require('../controllers/postController');

const router = express.Router();

router.get("/", getPosts);

router.get("/:id", getPost);

router.post("/", createPost);

router.delete("/:id", deletePost);

router.patch("/:id", updatePost);


module.exports = router;