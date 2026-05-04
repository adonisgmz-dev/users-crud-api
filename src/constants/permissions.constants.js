// Importamos para usar su valores
const roles = require("./roles.constants");

const permissions = {
    create_user: "create_user",
    read_users : "read_users",
    update_user : "update_user",
    delete_user : "delete_user",
    read_own_profile : "read_own_profile",
};

const rolesPermissions = {
    [roles.ADMIN]: [permissions.create_user, permissions.read_users,permissions.update_user, permissions.delete_user],
    [roles.MODERATOR]: [permissions.read_users,permissions.update_user],
    [roles.USER]: [permissions.read_own_profile],
};

module.exports = {
    permissions,
    rolesPermissions
};