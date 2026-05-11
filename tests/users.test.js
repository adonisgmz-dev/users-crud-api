const request = require("supertest");
const app = require("../src/app");

describe("GET /users", () => {
    it("debe responder 401 si no hay token ", async () => {
        // Hacer peticion GET sin autenticacion
        const response = await request(app).get("/users?page=1&limit=5");
        // Esperamos que la API bloquee el acceso
        expect(response.status).toBe(401)
    });

    it("Debe responder 200 con token valido", async () => {
        // Hacer POST/login para obtener cookie JWT
        const loginResponse = await request(app)
            .post("/login")
            .send({
                email: "admin@gmail.com",
                password: "admin"
            })
        // Obtenemos cookies enviada por el login
        const cookies = loginResponse.headers["set-cookie"];
        // Hacemos peticion GET enviando la cookie para simular un usuario autenticado
        const response = await request(app).get("/users").set("Cookie", cookies);
        // Esperamos acceso correcto
        expect(response.status).toBe(200);
    });
});

