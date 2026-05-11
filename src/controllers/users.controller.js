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
    // Obtener page y limit desde la URL
    const { page, limit, role, active , username } = req.query;
    // Converitr page, limit a numero y si no viene nada en la URL usar los valores por defecto
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 5;
    // Calcular cuantos registros deben saltar Prisma 
    const skip = (pageNumber - 1) * limitNumber;

    const { users, totalUsers } = await getAllUsers({
        skip,
        limit: limitNumber,
        role,
        active,
        username,
    });
    // Calcular total de paginas redondeando hacia arriba
    const totalPages = Math.ceil(totalUsers / limitNumber);
    // Sanitizamos para no devolver datos sensibles
    const allUsers = users.map(user => sanitizeUser(user));
    // Respuesta con metadata de paginacion
    res.status(200).json({
        page: pageNumber,
        limit: limitNumber,
        totalUsers,
        totalPages,
        users: allUsers,
    });
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