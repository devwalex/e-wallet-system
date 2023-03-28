const request = require("supertest");
const app = require("../app");
const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");

let token, secondToken, mock;
const setWalletPin = async (token) => {
  return request(app)
    .post("/wallet/set-pin")
    .set({ Authorization: `Bearer ${token}` })
    .send({
      pin: "1111",
      confirm_pin: "1111",
    });
};

beforeAll(async () => {
  await request(app).post("/register").send({
    first_name: "Usman",
    last_name: "Salami",
    email: "usman@gmail.com",
    password: "123456",
  });

  await request(app).post("/register").send({
    first_name: "Mary",
    last_name: "Doe",
    email: "mary@gmail.com",
    password: "123456",
  });

  const response = await request(app).post("/login").send({
    email: "usman@gmail.com",
    password: "123456",
  });
  token = response.body.token;

  await setWalletPin(token);

  const secondResponse = await request(app).post("/login").send({
    email: "mary@gmail.com",
    password: "123456",
  });

  secondToken = secondResponse.body.token;

  mock = new MockAdapter(axios);
});

describe("Wallet", () => {
  it("should set wallet pin successfully", async () => {
    const response = await setWalletPin(token);
    expect(response.statusCode).toEqual(201);
    expect(response.body.message).toEqual("Set pin successfully!");
  });

  it("should throw validation error if required input are missing when setting pin", async () => {
    const response = await request(app)
      .post("/wallet/set-pin")
      .set({ Authorization: `Bearer ${token}` })
      .send({
        pin: "",
        confirm_pin: "",
      });
    expect(response.statusCode).toEqual(400);
    expect(response.body).toHaveProperty("errors");
  });

  it("should initialize wallet funding successfully", async () => {
    mock.onPost("https://api.flutterwave.com/v3/payments").reply(200, {
      data: {
        link: "https://ravemodal-dev.herokuapp.com/v3/hosted/pay/f3859ae0ee1b5e4d0413",
      },
    });

    const response = await request(app)
      .post("/wallet/fund")
      .set({ Authorization: `Bearer ${token}` })
      .send({
        amount: "500",
      });

    expect(response.statusCode).toEqual(201);
    expect(response.body.message).toEqual("Initialized Wallet Funding");
    expect(response.body).toHaveProperty("paymentLink");
  });

  it("should throw if wallet pin is not set before funding wallet", async () => {
    const response = await request(app)
      .post("/wallet/fund")
      .set({ Authorization: `Bearer ${secondToken}` })
      .send({
        amount: "500",
      });
    expect(response.statusCode).toEqual(400);
    expect(response.body.message).toEqual("Please set your wallet pin before performing any transaction");
  });

  it("should throw validation error if required input are missing when funding wallet", async () => {
    const response = await request(app)
      .post("/wallet/fund")
      .set({ Authorization: `Bearer ${token}` })
      .send({
        amount: "",
      });

    expect(response.statusCode).toEqual(400);
    expect(response.body).toHaveProperty("errors");
  });

  it("should verify wallet funding successfully", async () => {
    mock.onGet("https://api.flutterwave.com/v3/transactions/288200108/verify").reply(200, {
      status: "success",
      message: "Transaction fetched successfully",
      data: {
        id: 288200108,
        tx_ref: "PID-12C3TH95ZY",
        flw_ref: "HomerSimpson/FLW275407301",
        device_fingerprint: "N/A",
        amount: 500,
        currency: "NGN",
        charged_amount: 500,
        app_fee: 1.4,
        merchant_fee: 0,
        processor_response: "Approved by Financial Institution",
        auth_model: "PIN",
        ip: "::ffff:10.5.179.3",
        narration: "CARD Transaction ",
        status: "successful",
        payment_type: "card",
        created_at: "2021-07-15T14:06:55.000Z",
        account_id: 17321,
        card: {
          first_6digits: "455605",
          last_4digits: "2643",
          issuer: "MASTERCARD GUARANTY TRUST BANK Mastercard Naira Debit Card",
          country: "NG",
          type: "MASTERCARD",
          token: "flw-t1nf-93da56b24f8ee332304cd2eea40a1fc4-m03k",
          expiry: "01/23",
        },
        meta: null,
        amount_settled: 7500,
        customer: {
          id: 370672,
          phone_number: null,
          name: "Usman Salami",
          email: "usman@gmail.com",
          created_at: "2020-04-30T20:09:56.000Z",
        },
      },
    });
    const response = await request(app)
      .get("/wallet/verify?status=successful&tx_ref=PID-12C3TH95ZY&transaction_id=288200108")
      .set({ Authorization: `Bearer ${token}` })
      .send();

    expect(response.statusCode).toEqual(201);
    expect(response.body.message).toEqual("Wallet Funded Successfully");
  });

  it("should transfer funding successfully", async () => {
    const response = await request(app)
      .post("/wallet/transfer")
      .set({ Authorization: `Bearer ${token}` })
      .send({
        amount: 100,
        wallet_code_or_email: "mary@gmail.com",
        wallet_pin: "1111",
      });

    expect(response.statusCode).toEqual(201);
    expect(response.body.message).toEqual("Fund Transfer Successful");
  });

  it("should withdraw fund successfully", async () => {
    const response = await request(app)
      .post("/wallet/withdraw")
      .set({ Authorization: `Bearer ${token}` })
      .send({
        amount: 400,
        bank_code: "044",
        account_number: "0690000040",
        wallet_pin: "1111",
      });

    expect(response.statusCode).toEqual(201);
    expect(response.body.message).toEqual("Withdrawal Successful");
  });

  it("should throw validation error if required input are missing when withdrawing fund", async () => {
    const response = await request(app)
      .post("/wallet/withdraw")
      .set({ Authorization: `Bearer ${token}` })
      .send({
        amount: "",
        bank_code: "",
        account_number: "",
      });

    expect(response.statusCode).toEqual(400);
    expect(response.body).toHaveProperty("errors");
  });

  it("should get wallet balance successfully", async () => {
    const response = await request(app)
      .get("/wallet/balance")
      .set({ Authorization: `Bearer ${token}` })
      .send();
    expect(response.statusCode).toEqual(200);
    expect(response.body.message).toEqual("Returned wallet balance successfully");
  });
});
