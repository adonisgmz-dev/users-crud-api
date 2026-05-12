const request = require("supertest");
const app = require("../../src/app");

describe("PUT /users/:id", () => {

    // Test para actualizar usuario
    it("Debe actualizar un usuario y responder 200", async () => {
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
        // 
        const response = await request(app)
            .put(`/users/${userId}`)
            .set("Cookie", cookies)
            .send({
                username: "PatricioNuevo"
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message");
        expect(response.body).toHaveProperty("user");
        expect(response.body.user.username).toBe("PatricioNuevo");
        expect(response.body.user).not.toHaveProperty("password");
    });
})