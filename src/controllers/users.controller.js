const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} = require("../services/users.service");
const {sanitizeUser} = require("../utils/sanitizeUser")

// Controller para obtener usuarios
async function getUsersController(req, res) {
    const users = await getAllUsers();
    const allUsers = users.map(user => sanitizeUser(user));
    res.status(200).json(allUsers);
};

//Controller crear Usuario
async function createUserController(req, res) {
    const {firstName, lastName, secondLastName, username, email, password } = req.body;
    const newUser = await createUser({
            firstName,
            lastName,
            secondLastName,
            username,
            email,
            password,
    });
    return res.status(201).json({ message: "Usuario creado correctamente", user: sanitizeUser(newUser) });
};

// Controller Buscar por ID
async function getUserByIdController(req, res) {
    const id = req.params.id;
    const user = await getUserById(id);
    if (!user) {
        const error = new Error("Usuario no encontrado");
        error.status = 404;
        throw error;
    };
    return res.status(200).json(sanitizeUser(user))
}
// Controller actualizar usuario
async function updateUserController(req, res) {
    const id = req.params.id;
    const { username, email, password } = req.body;
    const updatedUser = await updateUser(id, { username, email, password });
    if (!updatedUser) {
        const error = new Error("Usuario no encontrado");
        error.status = 404;
        throw error;
    };
    return res.status(200).json({ message: "Usuario actualizado", user: sanitizeUser(updatedUser) });
}

// Controller eliminar usuario
async function deleteUserController(req, res) {
    const id = req.params.id;
    const deleted = await deleteUser(id);
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