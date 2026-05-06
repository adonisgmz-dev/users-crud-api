const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} = require("../services/users.service");

// Controller para obtener usuarios
function getUsersController(req, res) {
    const users = getAllUsers();
    res.status(200).json(users);
};

//Controller crear Usuario
function createUserController(req, res) {
    const { username, email, password } = req.body;
    const newUser = createUser({ username, email, password });
    return res.status(201).json({ message: "Usuario creado correctamente", user: newUser });
};

// Controller Buscar por ID
function getUserByIdController(req, res) {
    const id = req.params.id;
    const user = getUserById(id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    return res.status(200).json(user)
}
// Controller actualizar usuario
function updateUserController(req, res) {
    const id = req.params.id;
    const { username, email, password } = req.body;
    const updatedUser = updateUser(id, { username, email, password });
    if (!updatedUser) return res.status(404).json({ error: "Usuario no encontrado" });
    return res.status(200).json({ message: "Usuario actualizado", user: updatedUser });
}

// Controller eliminar usuario
function deleteUserController(req, res) {
    const id = req.params.id;
    const deleted = deleteUser(id);
    if (!deleted) return res.status(404).json({ error: "No se encontró el usuario" });
    return res.status(200).json({ message: "Usuario eliminado correctamente" });
}

module.exports = {
    getUsersController,
    createUserController,
    getUserByIdController,
    updateUserController,
    deleteUserController,
}