const request = require("supertest");
const app = require("../../src/app");

describe("GET /users", () => {
    // Test acceso sin autenticacion
    it("debe responder 401 si no hay token ", async () => {
        // Hacer peticion GET sin autenticacion
        const response = await request(app).get("/users?page=1&limit=5");
        // Esperamos que la API bloquee el acceso
        expect(response.status).toBe(401)
    });
    // Test acceso correcto con admin autenticado
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
    // Test metadata
    it("Debe responder con metadata", async () => {
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
        const response = await request(app).get("/users?page=1&limit=5").set("Cookie", cookies);
        expect(response.status).toBe(200);
        // Validamos metadata de paginacion
        expect(response.body).toHaveProperty("page");
        expect(response.body).toHaveProperty("limit");
        expect(response.body).toHaveProperty("totalUsers");
        expect(response.body).toHaveProperty("totalPages");
        expect(response.body).toHaveProperty("users");
        // Validamos que users sea un array
        expect(Array.isArray(response.body.users)).toBe(true)
    });

    // Test permisos con user sin permisos de admin
    it("Debe responder con 403 si el usuario no tiene permisos", async () => {
        // Hacer POST/login para obtener cookie JWT
        const loginResponse = await request(app)
            .post("/login")
            .send({
                email: "miguel@gmail.com",
                password: "pass123456"
            });
        // Esperamos que el login del user sea correcto
        expect(loginResponse.status).toBe(200);
        // Obtenemos cookies enviada por el login
        const cookies = loginResponse.headers["set-cookie"];
        // Hacemos peticion GET enviando la cookie para simular un usuario autenticado
        const response = await request(app).get("/users?page=1&limit=5").set("Cookie", cookies);
        expect(response.status).toBe(403);
        // esperamos que la respuesta tenga la propiedad error
        expect(response.body).toHaveProperty("error");
        // Esperamos mensaje de permiso denegado
        expect(response.body.error).toBe("Permiso denegado");
    })


    //Test con admin filtrando usuarios por rol user
    it("Debe filtrar usuarios por role", async () => {
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
        const response = await request(app).get("/users?role=user").set("Cookie", cookies);
        expect(response.status).toBe(200);
        // esperamos que la respuesta tenga la propiedad users
        expect(response.body).toHaveProperty("users");
        // Validamos que todos los usuarios filtrados tengan role user
        response.body.users.forEach(user => {
            expect(user.role).toBe("user");
        });
    });

});



