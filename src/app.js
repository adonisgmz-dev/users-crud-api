const express = require("express");
require("dotenv").config();
const cookieParser= require("cookie-parser")
// Importar rutas
const usersRoutes = require("./routes/users.routes");
const authRoutes = require("./routes/auth.routes");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(usersRoutes);
app.use(authRoutes);
// Errores globales
app.use(errorMiddleware);

// Arrancar servidor
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});