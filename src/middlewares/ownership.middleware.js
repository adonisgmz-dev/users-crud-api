function checkOwnershipOrRole(rolesPermitido) {
    return (req, res, next) => {
        // Validar usuario
        if (!req.user) {
            return res.status(401).json({ error: "Usuario no autenticado" });
        };
        // Scamos IDS
        const userIdFromToken = req.user.id;
        const userIdFromParams = Number(req.params.id);

        if (userIdFromToken === userIdFromParams || req.user.role === rolesPermitido) {
            return next();
        };
        return res.status(403).json({ error: "Acceso denegado" });
    }
};

module.exports = checkOwnershipOrRole;