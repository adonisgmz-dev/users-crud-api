// Importar zod 
const { z } = require("zod");

const loginSchema = z.object({
    email: z.string().email("Email invalido"),
    password: z.string().min(4, "Minimo 4 caracteres").max(15, "Maximo 15 caracteres")
}).strict();
// Exportamos
module.exports = {
    loginSchema
}