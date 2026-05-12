function checkOwnershipOrRole(rolesPermitido) {
    return (req, res, next) => {
        // Validar usuario
        if (!req.user) {
            const error = new Error("Usuario no autenticado");
            error.status = 401;
            throw error;
        };
        // Scamos IDS
        const userIdFromToken = req.user.id;
        const userIdFromParams =req.params.id;

        if (userIdFromToken === userIdFromParams || req.user.role === rolesPermitido) {
            return next();
        };
        const error = new Error("Acceso denegado");
        error.status = 403;
        throw error;
    }
};

module.exports = checkOwnershipOrRole;