const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken.middleware");
const checkPermission = require("../middlewares/permission.middleware");
const checkOwnershipOrRole = require("../middlewares/ownership.middleware");

const {
    getUsersController,
    createUserController,
    getUserByIdController,
    updateUserController,
    deleteUserController,
} = require("../controllers/users.controller");

// Obtener todos los usuarios
router.get("/users",verifyToken,checkPermission("read_users"),getUsersController);
// Crear un usuario nuevo
router.post("/users",verifyToken,checkPermission("create_user"), createUserController);
// Obtener usuario por ID
router.get("/users/:id", verifyToken,checkOwnershipOrRole("admin"), getUserByIdController);
// Actualizar usuario
router.put("/users/:id",verifyToken, checkOwnershipOrRole("admin"), updateUserController);
// Eliminar usuario
router.delete("/users/:id",verifyToken,checkPermission("delete_user"), deleteUserController);


module.exports = router;