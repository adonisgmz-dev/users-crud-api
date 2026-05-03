const rolesPermissions = {
    admin: ["create_user", "read_users", "update_user", "delete_user"],
    moderator: ["read_users", "update_user"],
    user: ["read_own_profile"]
};

function checkPermission(permisoRequerido) {
    return (req, res, next) => {
        // Primero validamos usuario
        if (!req.user) {
        return res.status(401).json({ error: "Usuario no autenticado" });
        };
        // Sacamos el rol
        const role = req.user.role;
        const permisos = rolesPermissions[role];
        // Validamos rol
        if (!role || !permisos) {
            return res.status(403).json({ error: "Rol no valido o sin permisos" });
        }
        // Y validamos permiso
        if (!permisos.includes(permisoRequerido)) {
            return res.status(403).json({error:"Permiso denegado"})
        };
        // Esta todo bien
        next();
    }
};

module.exports = checkPermission;