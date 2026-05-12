const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

// Seguridad
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

// Importar rutas
const usersRoutes = require("./routes/users.routes");
const authRoutes = require("./routes/auth.routes");

// Importar Middleware global de errores
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

// Middlewares globales
app.use(helmet());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: "Demasiadas peticiones. Intenta más tarde."
  }
});
app.use(limiter);

app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));

// Rutas
app.use(usersRoutes);
app.use(authRoutes);
// Errores globales
app.use(errorMiddleware);

module.exports = app;