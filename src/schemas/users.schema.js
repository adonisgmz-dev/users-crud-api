// Importar zod 
const { z } = require("zod");

// Schema para crear usuario
const createUserSchema = z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    secondLastName: z.string().optional().nullable(),
    username: z.string().min(4, "Minimo de 4 caracteres").max(13, "Maximo 13 caracteres"),
    email: z.string().email("Email invalido"),
    password: z.string().min(6, "Minimo 6 caracteres").max(15, "Maximo 15 caracteres"),
    
}).strict()

// Schema para actualizar usuario
const updateUserSchema = z.object({
    username: z.string().min(4, "Minimo de 4 caracteres").max(13, "Maximo 13 caracteres").optional(),
    email: z.string().email("Email invalido").optional(),
    password: z.string().min(6, "Minimo 6 caracteres").max(15,"Maximo 15 caracteres").optional(),
}).strict();

// Exportamos
module.exports = {
    createUserSchema,
    updateUserSchema
}