const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");
const SECRET = process.env.JWT_SECRET;

async function loginService(email, password) {
    if (!email || !password) {
        return { success: false, status: 400, error: "Email y password son obligatorios" }
    };
    // Buscar usuario
    const user = await prisma.user.findUnique({
        where : {email},
    })
    if (!user) {
        return { success: false, status: 404, error: "Usuario no encontrado" }
    }
    // Mirar si esta bloqueado
    if (user.blockedUntil && user.blockedUntil >  new Date()) {
        return { success: false, status: 403, error: "Usuario bloqueado temporalmente", tiempoRestante: Math.ceil((user.blockedUntil - Date.now()) / 1000) }
    };
    // Desbloquear automaticamente
    if (user.blockedUntil && user.blockedUntil < new Date()) {
        await prisma.user.update({
            where: { id: user.id },
            data: {
                blockedUntil: null,
                active: true,
                loginAttempts : 0,
            }
        })
    };
    // Ver is la cuenta esta activa o bloqueda
    if (!user.active) {
        return { success: false, status: 403, error: "Cuenta bloqueada o inactiva" };
    }

    // Contraseña
    const maxIntentos = 6;
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        const newAttempts = user.loginAttempts + 1;
        if (newAttempts >= maxIntentos) {
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    active: false,
                    blockedUntil: null,
                    loginAttempts: 0,
                }
            })
            return { success: false, status: 403, error: "No tienes mas intentos. Tu cuenta ha sido bloqueda por seguridad.Contactar con soporte" };
        };

        if (newAttempts === 3) {
            const blockedUntil = new Date(Date.now() + 60 * 1000);
            
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    loginAttempts: newAttempts,
                    blockedUntil: blockedUntil
                }
            });

            return { success: false, status: 403, error: "Tu cuenta a sido bloqueada temporalmente por un minuto", tiempoRestante: Math.ceil((blockedUntil - Date.now()) / 1000) };
        };

        if (newAttempts > 3) {
            const intentosRest = maxIntentos - newAttempts;
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    loginAttempts : newAttempts,
                }
            })
            return { success: false, status: 403, error: "Contraseña incorrecta", message: `Te quedan ${intentosRest} intentos antes que se bloquee permanentemente` };
        }
        await prisma.user.update({
            where: { id: user.id },
            data: {
                loginAttempts: newAttempts,
            }
        });
        return { success: false, status: 401, error: "Contraseña incorrecta", intentos: newAttempts };
    }
    // Login exitoso
    await prisma.user.update({
        where: { id: user.id },
        data: {
            loginAttempts: 0,
            blockedUntil: null,
        }
    })

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