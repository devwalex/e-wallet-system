const db = require("../config/db");
const randomstring = require("randomstring");
const bcrypt = require("bcryptjs");
const { makePayment, verifyPayment } = require("../helpers/payment.helpers");
require("dotenv/config");

/**
 * Create Wallet
 * @param {Integer} userID
 * @returns {Promise<Wallet>}
 */

const createWallet = async (userID) => {
  const user = await db.select("*").from("users").where("id", userID).first();

  const generatedWalletCode = randomstring.generate({
    length: 7,
    charset: "alphanumeric",
    capitalization: "uppercase",
  });

  const wallet = await db("wallets").insert({
    user_id: user.id,
    wallet_code: generatedWalletCode,
  });
  return wallet;
};

/**
 * Set Wallet Pin
 * @param {Object} walletData
 * @returns {Promise<Wallet>}
 */

const setWalletPin = async (walletData) => {
  const user = walletData.user;
  const pin = walletData.pin.toString();

  const hashPin = await bcrypt.hashSync(pin, 10);

  const wallet = await db("wallets").where("user_id", user.id).first();
  if (!wallet.wallet_pin) {
    await db("wallets").where("user_id", user.id).update({ wallet_pin: hashPin });
  }
  return wallet;
};

/**
 * Fund Wallet
 * @param {Object} walletData
 * @returns {String} paymentLink
 */

const fundWallet = async (walletData) => {
  const user = walletData.user;
  const amount = walletData.amount;

  const appUrl = process.env.HOST && process.env.PORT ? `http://${process.env.HOST}:${process.env.PORT}`: "http://localhost:3000";

  const paymentLink = await makePayment(
    amount,
    user,
    `${appUrl}/wallet/verify`,
    "Wallet Funding"
  );

  return paymentLink;
};

/**
 * Verify Wallet Funding
 * @param {Object} walletData
 * @returns {Promise<Wallet>}
 */

const verifyWalletFunding = async (walletData) => {
  const user = walletData.user;

  const payment = await verifyPayment(walletData.transaction_id);

  if (payment.customer.email !== user.email) {
    return Promise.reject({
      success: false,
      message: "Could not verify payment",
    });
  }

  await db("wallets")
    .where("user_id", user.id)
    .increment("balance", payment.amount);

  return payment;
};

module.exports = {
  createWallet,
  setWalletPin,
  fundWallet,
  verifyWalletFunding,
};
