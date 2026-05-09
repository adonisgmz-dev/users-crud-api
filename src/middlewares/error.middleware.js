const errorMiddleware = (error, req, res, next) => {
    const status = error.status || 500;
    const message = error.message || "Error interno del servidor"
    res.status(status).json({
        error: message,
    });
};

module.exports = errorMiddleware;