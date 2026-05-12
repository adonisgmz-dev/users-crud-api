const request = require("supertest");
const app = require("../../src/app");

describe("DELETE /users/:id", () => {
    it("Debe eliminar un usuario y responder 200", async () => {
        // login como admin
        const loginResponse = await request(app)
            .post("/login")
            .send({
                email: "admin@gmail.com",
                password: "admin"
            })
        // Obtenemos cookies del admin
        const cookies = loginResponse.headers["set-cookie"];
        // Primero obtenemos usuarios para sacar un ID real
        const usersResponse = await request(app)
            .get("/users?page=1&limit=5")
            .set("Cookie", cookies);
        // Guardamos el id del usuario que vamos a eliminar que sea distinto al de miguel y que no sea admin
        const user = usersResponse.body.users.find(u => u.email !== "miguel@gmail.com" && u.role !== "admin");
        // Validar que exista un usuario para eliminar
        expect(user).toBeDefined();
        // Eliminamos el usuario usando su id
        const response = await request(app)
            .delete(`/users/${user.id}`)
            .set("Cookie", cookies);
        // Validar
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message");
    });
});