
function checkRole(...rolesPermitidos) {
    return (req, res, next) => {
        if (!req.user) {
            const error = new Error("Usuario no autenticado");
            error.status = 401;
            throw error;
        }
        // No autorizado
        if (!rolesPermitidos.includes(req.user.role)) {
            const error = new Error("Acceso denegado");
            error.status = 403;
            throw error;
        }
        next();
    }
}
module.exports = checkRole;