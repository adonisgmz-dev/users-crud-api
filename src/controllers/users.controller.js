const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} = require("../services/users.service");

// Controller para obtener usuarios
function getUsers(req, res) {
    const users = getAllUsers();
    res.status(200).json(users);
};

//Controller crear Usuario
function createUserController(req, res) {
    const { username, email, password } = req.body;
    // Validaciones
    if (!username || !email || !password) return res.status(400).json({ error: "Faltan campos obligatorios" });
    if (username.length < 3) return res.status(400).json({ error: "El username tiene que tener minimo 3 caracteres." }); 
    if (!email.includes("@")) return res.status(400).json({ error: "El email debe incluir @" });
    if (password.length < 6) return res.status(422).json({ error: "La contraseña debe tener minimo 6 caracteres" });

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
    // Comprobar que venga un campo
    if (!username && !email && !password) return res.status(400).json({ error: "Minimo un campo para poder actualizar" });
    // Validar
    if (username) {
        if (username.length < 3) return res.status(400).json({ error: "El username tiene que tener minimo 3 caracteres." }); 
    };
    if (email) {
        if (!email.includes("@")) return res.status(400).json({ error: "El email debe incluir @" });   
    }
    if (password) {
        if (password.length < 6) return res.status(422).json({ error: "La contraseña debe tener minimo 6 caracteres" });
    };

    const updatedUser = updateUser(id, { username, email, password });
    // Comprobar si existe
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
    getUsers,
    createUserController,
    getUserByIdController,
    updateUserController,
    deleteUserController,
}