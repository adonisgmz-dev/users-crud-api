const users = require("../data/users.db");

// Obtener todos
function getAllUsers() {
    return users;
}

// Buscar por ID
function getUserById(id) {
    const userId = Number(id);
    return users.find(u => u.id === userId);
}

// Crear usuario
function createUser(userData) {
    const newUser = {
        id: users.length ? users[users.length - 1].id + 1 : 1,
        ...userData
    };

    users.push(newUser);
    return newUser;
}

// Actualizar usuario
function updateUser(id, data) {
    const userId = Number(id);
    const user = users.find(u => u.id === userId);

    if (!user) return null;

    if (data.username) user.username = data.username;
    if (data.email) user.email = data.email;
    if (data.password) user.password = data.password;

    return user;
}

// Eliminar usuario
function deleteUser(id) {
    const userId = Number(id);
    const index = users.findIndex(u => u.id === userId);

    if (index === -1) return false;

    users.splice(index, 1);
    return true;
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};