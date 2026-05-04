const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dataBaseUsuarios = require("../data/users.db");
const SECRET = process.env.JWT_SECRET;

async function loginService(email, password) {
    if (!email || !password) {
        return { success: false, status: 400, error: "Email y password son obligatorios" }
    };
    // Buscar usuario
    const user = dataBaseUsuarios.find(e => e.email === email);
    if (!user) {
        return { success: false, status: 404, error: "Usuario no encontrado" }
    }
    // Mirar si esta blouqeado
    if (user.blockedUntil && user.blockedUntil > Date.now()) {
        return { success: false, status: 403, error: "Usuario bloqueado temporalmente", tiempoRestante: Math.ceil((user.blockedUntil - Date.now()) / 1000) }
    };
    // Desbloquear automaticamente
    if (user.blockedUntil && user.blockedUntil < Date.now()) {
        user.blockedUntil = null;
        user.active = true;
        user.loginAttempts = 0;
    };
    // Ver is la cuenta esta activa o bloqueda
    if (!user.active) {
        return { success: false, status: 403, error: "Cuenta bloqueada o inactiva" };
    }

    // Contraseña
    const maxIntentos = 6;
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        user.loginAttempts++;
        if (user.loginAttempts >= maxIntentos) {
            user.active = false;
            user.loginAttempts = 0;
            return { success: false, status: 403, error: "No tienes mas intentos. Tu cuenta a sido bloqueda por seguridad.Contactar con soporte" };
        };

        if (user.loginAttempts === 3) {
            user.blockedUntil = Date.now() + (60 * 1000);
            return { success: false, status: 403, error: "Tu cuenta a sido bloqueada temporalmente por un minuto", tiempoRestante: Math.ceil((user.blockedUntil - Date.now()) / 1000) };
        };

        if (user.loginAttempts > 3) {
            const intentosRest = maxIntentos - user.loginAttempts;
            return { success: false, status: 403, error: "Contraseña incorrecta", message: `Te quedan ${intentosRest} intentos antes que se bloquee permanentemente` };
        }
        return { success: false, status: 401, error: "Contraseña incorrecta", intentos: user.loginAttempts };
    }
    // Login exitoso
    user.loginAttempts = 0;
    user.blockedUntil = null;

    // Generar token
    const token = jwt.sign({ id: user.id, username: user.username, email: user.email, role: user.role },
        SECRET,
        { expiresIn: "1h" }
    )
    
    // Enviar token
    return {
        success: true,
        status: 200,
        message: "Login exitoso",
        token,
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    }
}
module.exports = { loginService };