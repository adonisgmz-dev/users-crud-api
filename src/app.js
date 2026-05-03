const express = require("express");
require("dotenv").config();
const cookieParser= require("cookie-parser")
// Importar rutas
const usersRoutes = require("./routes/users.routes");

const app = express();
app.use(cookieParser());
app.use(express.json());
// Usar rutas
app.use(usersRoutes);

// Arrancar servidor
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});