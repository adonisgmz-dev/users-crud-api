const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken.middleware");
const checkPermission = require("../middlewares/permission.middleware");
const checkOwnershipOrRole = require("../middlewares/ownership.middleware");
const roles = require("../constants/roles.constants");
const { permissions } = require("../constants/permissions.constants");
const validateSchema = require("../middlewares/validateSchema.middleware");
const { createUserSchema, updateUserSchema } = require("../schemas/users.schema");


const {
    getUsersController,
    createUserController,
    getUserByIdController,
    updateUserController,
    deleteUserController,
} = require("../controllers/users.controller");

// Obtener todos los usuarios
router.get("/users",verifyToken,checkPermission(permissions.read_users),getUsersController);
// Crear un usuario nuevo
router.post("/users",verifyToken,checkPermission(permissions.create_user), validateSchema(createUserSchema),createUserController);
// Obtener usuario por ID
router.get("/users/:id", verifyToken,checkOwnershipOrRole(roles.ADMIN), getUserByIdController);
// Actualizar usuario
router.put("/users/:id",verifyToken, checkOwnershipOrRole(roles.ADMIN), validateSchema(updateUserSchema),updateUserController);
// Eliminar usuario
router.delete("/users/:id",verifyToken,checkPermission(permissions.delete_user), deleteUserController);


module.exports = router;