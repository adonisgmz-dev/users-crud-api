const express = require("express");
const app = express();

// Middleware para leer JSON
app.use(express.json());

// Importar rutas
const usersRoutes = require("./routes/users.routes");

// Usar rutas
app.use("/users", usersRoutes);

// Arrancar servidor
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});