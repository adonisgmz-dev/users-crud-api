const request = require("supertest");
const app = require("../../src/app");

describe("GET /users/:id", () => {
    
    // Test con adnim obtener usuario
    it("Debe responder 200 y devolver el usuario si existe", async () => {
        // Hacer POST/login para obtener cookie JWT
        const loginResponse = await request(app)
            .post("/login")
            .send({
                email: "admin@gmail.com",
                password: "admin"
            })
        // Obtenemos cookies enviada por el login
        const cookies = loginResponse.headers["set-cookie"];
    
        // Primero obtenemos usuarios para sacar un ID real
        const usersResponse = await request(app)
            .get("/users?page=1&limit=5")
            .set("Cookie", cookies);
        // 
        const userId = usersResponse.body.users[0].id;
        // Hacemos peticion GET enviando la cookie para simular un usuario autenticado
        const response = await request(app).get(`/users/${userId}`).set("Cookie", cookies);
        expect(response.status).toBe(200);
        // esperamos que la respuesta tenga lo siguiente
        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("username");
        expect(response.body).toHaveProperty("email");
        expect(response.body).not.toHaveProperty("password");
        
    });
    
    // Test usuario no existente
    it("Debe responder 404 y devolver el usuario no existe", async () => {
        // Hacer POST/login para obtener cookie JWT
        const loginResponse = await request(app)
            .post("/login")
            .send({
                email: "admin@gmail.com",
                password: "admin"
            })
        // Obtenemos cookies enviada por el login
        const cookies = loginResponse.headers["set-cookie"];
    
        // Primero obtenemos usuarios para sacar un ID real
        const usersResponse = await request(app)
            .get("/users?page=1&limit=5")
            .set("Cookie", cookies);
        // Simulamos un uuid falso
        const fakeId = "12345678-1234-1234-1234-123456789999";
        // Hacemos peticion GET enviando la cookie para simular un usuario autenticado
        const response = await request(app).get(`/users/${fakeId}`).set("Cookie", cookies);
        expect(response.status).toBe(404);
        // esperamos que la respuesta tenga lo siguiente
        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toBe("Usuario no encontrado");
        
    });
    
    // Test para obtener usuario ID como user
    it("Debe devolver 403 si un user intenta acceder a otro usuario", async () => {
        // Hacer POST/login para obtener cookie JWT
        const adminloginResponse = await request(app)
            .post("/login")
            .send({
                email: "admin@gmail.com",
                password: "admin"
            })
        // Obtenemos cookies enviada por el login
        const admincookies = adminloginResponse.headers["set-cookie"];
    
        // Primero obtenemos usuarios para sacar un ID real
        const usersResponse = await request(app)
            .get("/users?page=1&limit=5")
            .set("Cookie", admincookies);
        
        const otherUser = usersResponse.body.users.find(
            user => user.email !== "miguel@gmail.com"
        );

        expect(otherUser).toBeDefined();

        const userId = otherUser.id;
         // Hacer POST/login para obtener cookie JWT
        const loginResponse = await request(app)
            .post("/login")
            .send({
                email: "miguel@gmail.com",
                password: "pass123456"
            })
        // Obtenemos cookies enviada por el login
        const cookies = loginResponse.headers["set-cookie"];
        // Hacemos peticion GET enviando la cookie para simular un usuario autenticado
        const response = await request(app).get(`/users/${userId}`).set("Cookie", cookies);
        expect(response.status).toBe(403);
        // esperamos que la respuesta tenga lo siguiente
        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toBe("Acceso denegado");
        
    });
    
    // Test usuario puede entrar a su propio usuario
    it("Debe responder 200 y el usuario miguel puede entrar a su propio usuario", async () => {
        // Login como admin para obtener acceso total
        const adminloginResponse = await request(app)
            .post("/login")
            .send({
                email: "admin@gmail.com",
                password: "admin"
            })
        // Guardamos las cookies del admin
        const admincookies = adminloginResponse.headers["set-cookie"];
    
        // Obtener la lista de usuarios usndo permisos de admin
        const usersResponse = await request(app)
            .get("/users?page=1&limit=5")
            .set("Cookie", admincookies);
        
        const miguel = usersResponse.body.users.find(user => user.email === "miguel@gmail.com");
        // Validar que miguel exista en la list obtenida
        expect(miguel).toBeDefined();
        const userId = miguel.id;
         // Login como miguel para simular usuario normal
        const loginResponse = await request(app)
            .post("/login")
            .send({
                email: "miguel@gmail.com",
                password: "pass123456"
            })
        // Guardar cookies del usuario miguel
        const cookies = loginResponse.headers["set-cookie"];
        //Y con miguel tratar de acceder a su propio perdil usando su id 
        const response = await request(app).get(`/users/${userId}`).set("Cookie", cookies);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("id");
        expect(response.body.email).toBe("miguel@gmail.com");
        expect(response.body).not.toHaveProperty("password");
    })
})