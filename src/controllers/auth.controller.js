const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dataBaseUsuarios = require("../data/users.db");
const SECRET = process.env.JWT_SECRET;

async function loginController(req,res){
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email y password son obligatorios" });
    };
    // Buscar usuario
    const user = dataBaseUsuarios.find(e => e.email === email);
    if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
    }
    // Mirar si esta blouqeado
    if (user.blockedUntil && user.blockedUntil > Date.now()) {
        return res.status(403).json({ error: "User temporaly blocked", tiempoRestante: Math.ceil((user.blockedUntil - Date.now()) / 1000) })
    };
    // Desbloquear automaticamente
    if (user.blockedUntil && user.blockedUntil < Date.now()) {
        user.blockedUntil = null;
        user.active = true;
        user.loginAttempts = 0;
    };
    // Ver is la cuenta esta activa o bloqueda
    if (!user.active) {
        return res.status(403).json({ error: "Cuenta bloqueada o inactiva" });
    }

    // Contraseña
    const maxIntentos = 6;
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        user.loginAttempts++;
        if (user.loginAttempts >= maxIntentos) {
            user.active = false;
            user.loginAttempts = 0;
            return res.status(403).json({ error: "No tienes mas intentos. Tu cuenta a sido bloqueda por seguridad.Contactar con soporte" });
        };

        if (user.loginAttempts === 3) {
            user.blockedUntil = Date.now() + (60 * 1000);
            return res.status(403).json({ error: "Tu cuenta a sido bloqueada temporalmente por un minuto", tiempoRestante: Math.ceil((user.blockedUntil - Date.now()) / 1000) });
        };

        if (user.loginAttempts > 3) {
            const intentosRest = maxIntentos - user.loginAttempts;
            return res.status(401).json({ error: "Contraseña incorrecta", message: `Te quedan ${intentosRest} intentos antes que se bloquee permanentemente` });
        }
        return res.status(401).json({ error: "Contraseña incorrecta", intentos: user.loginAttempts });
    }
    // Login exitoso
    user.loginAttempts = 0;
    user.blockedUntil = null;
    // Generar token
    const token = jwt.sign({ id: user.id, username: user.username, email: user.email, role: user.role },
        SECRET,
        {expiresIn:"1h"}
    )

    // Enviar token
    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 36000000
    });

    res.status(200).json({ message: "Login exitoso", user: { username: user.username, role: user.role } });
}
module.exports = { loginController };