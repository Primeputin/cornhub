const express = require('express');
const { getComments, getCommentsByUser, getComment, createComment, deleteComment, updateComment } = require('../controllers/commentController');

const router = express.Router();

router.get("/", getComments);

router.get("/user/:id", getCommentsByUser);

router.get("/:id", getComment);

router.post("/", createComment);

router.delete("/:id", deleteComment);

router.patch("/:id", updateComment);


module.exports = router;