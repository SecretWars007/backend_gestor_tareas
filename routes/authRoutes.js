const express = require("express");
const router = express.Router();
const { register, login, me } = require("../controller/authController");

// Crear un usuario
router.post("/", register);
// login de usuario
router.post("/login", login);
// get informacion de usuario autenticado
router.get("/me", me);
module.exports = router;
