const express = require("express");
const router = express.Router();

const {
    getUsers,
    createUserController,
    getUserByIdController,
    updateUserController,
    deleteUserController,
    getUsersController
} = require("../controllers/users.controller");

// Obtener todos los usuarios
router.get("/users", getUsersController);
// Crear un usuario nuevi
router.post("/users", createUserController);
// Obtener usuario por ID
router.get("/users/:id", getUserByIdController);
// Actualizar usuario
router.put("/users/:id", updateUserController);
// Eliminar usuario
router.delete("/users/:id", deleteUserController);


module.exports = router;