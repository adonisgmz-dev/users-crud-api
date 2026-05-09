function sanitizeUser(user) {
    const { password, loginAttempts, blockedUntil, ...safeUser } = user;
    return safeUser;
};

module.exports = { sanitizeUser };