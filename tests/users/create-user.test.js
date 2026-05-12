const request = require("supertest");
const app = require("../../src/app");

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