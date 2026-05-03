const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET
// Crear el middleware para  verificar el token
function verifyToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: "No existe token" });
    }

    try {
    const decoded = jwt.verify(token,SECRET)
        req.user = decoded;
        next();
    }catch(error){return res.status(403).json({error:"Token invalido"})}
};
// Exportamos para poder usarlo en routes
module.exports = verifyToken;