const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET
// Crear el middleware para  verificar el token
function verifyToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
            const error = new Error("No existe token");
            error.status = 401;
            throw error;
    }
    try {
    const decoded = jwt.verify(token,SECRET)
        req.user = decoded;
        next();
    } catch (erro) {
        const error = new Error("Token invalido");
        error.status = 403;
        throw error;
    }
};
// Exportamos para poder usarlo en routes
module.exports = verifyToken;