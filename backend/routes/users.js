const express = require('express');
const { getUsers, getUser, createUser, checkUser, logout, checkSession, updateSession, deleteUser, updateUser } = require('../controllers/userController');

const router = express.Router();

router.get("/", getUsers);

router.get("/:id", getUser);

router.post("/", createUser);

router.delete("/:id", deleteUser);

router.patch("/:id", updateUser);

// sessions
router.post("/check/", checkUser);

router.get("/session/logout", logout);

router.get("/check_session/check", checkSession);

router.patch("/session/update", updateSession);


module.exports = router;