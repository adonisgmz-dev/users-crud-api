
function checkRole(...rolesPermitidos) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: "Usuario no autenticado" });
        }
        // No autorizado
        if (!rolesPermitidos.includes(req.user.role)) {
            return res.status(403).json({error:"Acceso denegado"})
        }
        next();
    }
}
module.exports = checkRole;