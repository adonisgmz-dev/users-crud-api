const request = require("supertest");
const app = require("../../src/app");

describe("POST /login", () => {

    // Test login correcto
    it("Debe hacer login correctamente y responder 200", async () => {
        // Hacer petición POST al login
        const response = await request(app)
            .post("/login")
            .send({
                email: "admin@gmail.com",
                password: "admin"
            });

        // Validamos respuesta correcta
        expect(response.status).toBe(200);

        // Validamos que exista cookie JWT
        expect(response.headers["set-cookie"]).toBeDefined();

        // Validamos propiedades básicas de la respuesta
        expect(response.body).toHaveProperty("message");
    });

    // Test login sin email o password
    it("Debe responder 400 si faltan email o password", async () => {
        // Hacer petición sin password
        const response = await request(app)
            .post("/login")
            .send({
                email: "admin@gmail.com"
            });

        // Esperamos error de validación
        expect(response.status).toBe(400);

        // Validamos mensaje de error
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body[0]).toHaveProperty("field");
        expect(response.body[0]).toHaveProperty("message");
    });

    // Test contraseña incorrecta
    it("Debe responder 401 si la contraseña es incorrecta", async () => {
        // Hacer login con password incorrecto
        const response = await request(app)
            .post("/login")
            .send({
                email: "admin@gmail.com",
                password: "passwordI"
            });

        // Esperamos acceso denegado
        expect(response.status).toBe(401);

        // Validamos mensaje de error
        expect(response.body).toHaveProperty("error");
    });

    // Test usuario inexistente
    it("Debe responder 404 si el usuario no existe", async () => {
        // Hacer login con usuario inexistente
        const response = await request(app)
            .post("/login")
            .send({
                email: "usuariofake@gmail.com",
                password: "fake1234"
            });

        // Esperamos usuario no encontrado
        expect(response.status).toBe(404);

        // Validamos mensaje de error
        expect(response.body).toHaveProperty("error");
    });

});