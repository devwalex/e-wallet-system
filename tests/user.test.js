const request = require("supertest");
const app = require("../server");

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

describe("User", () => {
  it("should register a user successfully", async () => {
    const response = await request(app).post("/register").send({
      first_name: "John",
      last_name: "Doe",
      email: "john@gmail.com",
      password: "123456",
    });
    expect(response.statusCode).toEqual(201);
    expect(response.body.message).toEqual("Registered successfully!");
  });

  it("should throw validation error if required input are missing when registering", async () => {
    const response = await request(app).post("/register").send({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    });

    expect(response.statusCode).toEqual(400);
    expect(response.body).toHaveProperty('errors')
  });

  it("should login a user successfully", async () => {
    const response = await request(app).post("/login").send({
      email: "john@gmail.com",
      password: "123456",
    });
    expect(response.statusCode).toEqual(200);
    expect(response.body.message).toEqual("Logged in successfully!");
    expect(response.body).toHaveProperty('token')
  });

  it("should throw validation error if required input are missing when login", async () => {
    const response = await request(app).post("/login").send({
      email: "",
      password: "",
    });
    expect(response.statusCode).toEqual(400);
    expect(response.body).toHaveProperty('errors')
  });

  it("should throw error if login details are not valid", async () => {
    const response = await request(app).post("/login").send({
      email: "invalid@gmail.com",
      password: "12345",
    });
    expect(response.statusCode).toEqual(401);
    expect(response.body.message).toEqual("Invalid email or password");
  });

  it("should get user profile successfully", async () => {
    const response = await request(app)
      .get("/auth/profile")
      .set({ Authorization: `Bearer ${token}` })
      .send();
    expect(response.statusCode).toEqual(200);
    expect(response.body.message).toEqual("Returned profile successfully");
  });
});
