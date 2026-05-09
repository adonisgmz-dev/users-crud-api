const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} = require("../services/users.service");
const {sanitizeUser} = require("../utils/sanitizeUser")

// Controller para obtener usuarios
function getUsersController(req, res) {
    const users = getAllUsers();
    const allUsers = users.map(user => sanitizeUser(user));
    res.status(200).json(allUsers);
};

//Controller crear Usuario
function createUserController(req, res) {
    const { username, email, password } = req.body;
    const newUser = createUser({ username, email, password });
    return res.status(201).json({ message: "Usuario creado correctamente", user: sanitizeUser(newUser) });
};

// Controller Buscar por ID
function getUserByIdController(req, res) {
    const id = req.params.id;
    const user = getUserById(id);
    if (!user) {
        const error = new Error("Usuario no encontrado");
        error.status = 404;
        throw error;
    };
    return res.status(200).json(sanitizeUser(user))
}
// Controller actualizar usuario
function updateUserController(req, res) {
    const id = req.params.id;
    const { username, email, password } = req.body;
    const updatedUser = updateUser(id, { username, email, password });
    if (!updatedUser) {
        const error = new Error("Usuario no encontrado");
        error.status = 404;
        throw error;
    };
    return res.status(200).json({ message: "Usuario actualizado", user: sanitizeUser(updatedUser) });
}

// Controller eliminar usuario
function deleteUserController(req, res) {
    const id = req.params.id;
    const deleted = deleteUser(id);
    if (!deleted) {
        const error = new Error("No se encontró el usuario");
        error.status = 404;
        throw error;
    };
    return res.status(200).json({ message: "Usuario eliminado correctamente" });
}

module.exports = {
    getUsersController,
    createUserController,
    getUserByIdController,
    updateUserController,
    deleteUserController,
}