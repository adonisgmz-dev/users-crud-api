const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const roles = require("../constants/roles.constants")

// Obtener todos
async function getAllUsers({ skip, limit, role, active, username }) {
    // creamos un objeto donde iremos agragando filtros y prisma usara este objeto 
    const where = {};
    // Si viene role, active desde la URL
    if (role) {
        where.role = role;
    };
    if (active) {
        // Convertimos active de string a boolean
        where.active = active === "true"; 
    }
    if (username) {
        where.username = {
            contains : username,
        }
    }
    const users = await prisma.user.findMany({
        skip,
        take: limit,
        where, // usar el objeto para filtrar resultados
    });
    // Contar el total de usuario en la base de datos
    const totalUsers = await prisma.user.count({
        where, //Total de usuarios usando los filtros
    });

    return {
        users,
        totalUsers,
    }
}

// Buscar por ID
async function getUserById(id) {
    return await prisma.user.findUnique({
        where: {
            id :id
        }
    })
}

// Crear usuario
async function createUser(userData) {
    const hashedPassword = bcrypt.hashSync(userData.password, 10);

    return await prisma.user.create({
        data: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            secondLastName: userData.secondLastName,
            username: userData.username,
            email: userData.email,
            password: hashedPassword,
            role: roles.USER,
            active: true,
            loginAttempts: 0,
            blockedUntil: null,
        }    
    });
}
// Actualizar usuario
async function updateUser(id, data) {
    const updateData = {};

    if (data.username) updateData.username = data.username;
    if (data.email) updateData.email = data.email;
    if (data.password) updateData.password = bcrypt.hashSync(data.password,10);

    return await prisma.user.update({
        where : { id },
        data : updateData,
    });
}

// Eliminar usuario
async function deleteUser(id) {
    await prisma.user.delete({
        where : {id}
    })
    return true;
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};