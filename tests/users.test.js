const request = require("supertest");
const app = require("../src/app");

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
        
        const userId = usersResponse.body.users[0].id;
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



describe("POST /users", () => {
    // it("Debe crear un usuario y responder 201", async () => {
    //     // Login como admin para obtener acceso total
    //     const adminloginResponse = await request(app)
    //         .post("/login")
    //         .send({
    //             email: "admin@gmail.com",
    //             password: "admin"
    //         })
    //     // Guardamos las cookies del admin
    //     const admincookies = adminloginResponse.headers["set-cookie"];
    
    //     // Crear usuario con datos validos
    //     const response = await request(app)
    //         .post("/users")
    //         .set("Cookie", admincookies)
    //         .send({
    //             firstName: "Claudia",
    //             lastName: "Tobar",
    //             secondLastName: null,
    //             username: "claudia10",
    //             email: "claudiatobar@gmail.com",
    //             password: "claudia1234"
    //         });
        
    //     expect(response.status).toBe(201);
    //     expect(response.body).toHaveProperty("message");
    //     expect(response.body).toHaveProperty("user");
    //     expect(response.body.user).toHaveProperty("firstName");
    //     expect(response.body.user).toHaveProperty("lastName");
    //     expect(response.body.user).toHaveProperty("secondLastName");
    //     expect(response.body.user).toHaveProperty("username");
    //     expect(response.body.user).toHaveProperty("email");
    //     expect(response.body.user).not.toHaveProperty("password");
    // });

    // Test acceso sin autenticacion
    it("debe responder 403 si un user intenta crear un usuario", async () => {
        // Hacer peticion POSTsin autenticacion
        const response = await request(app).post("/users")
            .send({
                firstName: "sin",
                lastName: "token",
                secondLastName: null,
                username: "sintoken10",
                email: "sintoken@gmail.com",
                password: "holaquehace"
            });
        // Esperamos que la API bloquee el acceso
        expect(response.status).toBe(401)
    });
})


