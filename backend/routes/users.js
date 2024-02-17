const express = require('express');
const { getUsers, getUser, createUser, checkUser, deleteUser, updateUser } = require('../controllers/userController');

const router = express.Router();

router.get("/", getUsers);

router.get("/:id", getUser);

router.post("/", createUser);

router.post("/check/", checkUser);

router.delete("/:id", deleteUser);

router.patch("/:id", updateUser);


module.exports = router;