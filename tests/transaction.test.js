const request = require("supertest");
const app = require("../app");

let token;
beforeAll(async () => {
  await request(app).post("/register").send({
    first_name: "Carter",
    last_name: "Doe",
    email: "carter@gmail.com",
    password: "123456",
  });

  const response = await request(app).post("/login").send({
    email: "carter@gmail.com",
    password: "123456",
  });
  token = response.body.token;
});

describe("Transaction", () => {
  it("should get all transactions successfully", async () => {
    const response = await request(app)
      .get("/transactions")
      .set({ Authorization: `Bearer ${token}` })
      .send();
    expect(response.statusCode).toEqual(200);
    expect(response.body.message).toEqual("Returned transactions successfully");
  });
});
