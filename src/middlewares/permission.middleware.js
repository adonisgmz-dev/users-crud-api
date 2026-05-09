const rolesPermissions = {
    admin: ["create_user", "read_users", "update_user", "delete_user"],
    moderator: ["read_users", "update_user"],
    user: ["read_own_profile"]
};

function checkPermission(permisoRequerido) {
    return (req, res, next) => {
        // Primero validamos usuario
        if (!req.user) {
            const error = new Error("Usuario no autenticado");
            error.status = 401;
            throw error;
        };
        // Sacamos el rol
        const role = req.user.role;
        const permisos = rolesPermissions[role];
        // Validamos rol
        if (!role || !permisos) {
            const error = new Error("Rol no valido o sin permisos");
            error.status = 403;
            throw error;
        }
        // Y validamos permiso
        if (!permisos.includes(permisoRequerido)) {
            const error = new Error("Permiso denegado");
            error.status = 403;
            throw error;
        };
        // Esta todo bien
        next();
    }
};

module.exports = checkPermission;