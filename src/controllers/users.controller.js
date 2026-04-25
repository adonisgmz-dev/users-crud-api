const dataBaseUsuarios = require("../data/users.db");
const bcrypt = require("bcrypt");

// Controller para obtener usuarios
function getUsers(req, res) {
    res.status(200).json(dataBaseUsuarios);
};

// Controller para crear usuario
function createUser(req, res) {

    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: "Faltan uno o varios campos para crear un usuario" });
    }
    
    if (username.length < 3 ) {
        return res.status(400).json({ error: "Username corto. (3 caract. min)" });
    };
    // Revisar duplicados
    const duplicateUsername = dataBaseUsuarios.some(u => u.username === username );
    if (duplicateUsername) {
        return res.status(409).json({error:"Usuario ya en uso. Utiliza otro"})
    }

    if (!email.includes("@")) {
        return res.status(400).json({error:"El email no incluye @. Es obligatorio."})
    }
    const duplicateEmail = dataBaseUsuarios.some(e => e.email === email);
    if (duplicateEmail) {
        return res.status(409).json({error:"Email ya en uso. Utilice otro"})
    };

    if (password.length < 6) {
        return res.status(422).json({error:"Password invalida, minimo 6 caracteres"})
    };
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = { id: dataBaseUsuarios.length + 1, username, email, password:hashedPassword }
    dataBaseUsuarios.push(newUser);

    res.status(201).json({
        message: "Usuario creado",
        user: {
            id: newUser.id,
            username: newUser.username,
            email : newUser.email
        }
    });
};

// Controller para actualizar usuario
function updateUser(req, res) {
    const id = Number(req.params.id);
    const { username, email, password } = req.body;

    // Buscar usuario
    const user = dataBaseUsuarios.find(u => u.id === id);
    if (!user) {
        return res.status(404).json({ error: "Usuario no encontro" });
    };

    if (!username && !email && !password) {
        return res.status(400).json({ error: "No hay datos para actualizar" });
    };

    if (username) {
        if (username.length < 3) {
            return res.status(400).json({error:"Username corto. Minimo 3 caracteres"})
        };

        const duplicUsername = dataBaseUsuarios.some(u => u.username === username && u.id !== id);
        if (duplicUsername) {
            return res.status(409).json({error:"Usuario ya en uso. Elige otro"})
        };
    };

    if (email) {
        if (!email.includes("@")) {
            return res.status(400).json({ error: "Caracter obligatorio @" });
        };

        const duplicEmail = dataBaseUsuarios.some(e => e.email === email && e.id !== id);
        if (duplicEmail) {
            return res.status(409).json({error:"Email ya en uso. Prueba con otro"})
        };
    };
    let hashedPassword;
    if (password) {
        if (password.length < 6) {
            return res.status(422).json({error:"Password invalido. (6caract min.)"})
        }

        hashedPassword = bcrypt.hashSync(password, 10);
    };
    // Actualizar una vez haya pasado todas las comprobaciones
    if (username) {
        user.username = username;
    };
    if (email) {
        user.email = email;
    };
    if (password) {
        user.password = hashedPassword;
    };

    res.status(200).json({
        message: "Usuario actualizado correctamente",
        username: user.username,
        email:user.email
    });
};

// Controller para eliminar usuario
function deleteUser(req, res) {
    const id = Number(req.params.id);
    const index = dataBaseUsuarios.findIndex(i => i.id === id);

    if (index === -1) {
        return res.status(404).json({error:"No existe el usuario"})
    }

    dataBaseUsuarios.splice(index, 1);

    res.status(200).json({ message: "Usuario eliminado correctamente" });
};

// Exportar las funciones para usarlar en ROUTES
module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser
};
