const db = require("../config/db");
const randomstring = require("randomstring");
const bcrypt = require("bcryptjs");

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
 * @param {String} pin
 * @param {Object} walletData
 * @returns {Promise<Wallet>}
 */

const setWalletPin = async (walletData) => {
  const user = walletData.user;
  const pin = walletData.pin.toString();

  const hashPin = await bcrypt.hashSync(pin, 10);

  const wallet = await db("wallets").where("user_id", user.id).first();

  if (!wallet.wallet_pin) {
    await wallet.update({ wallet_pin: hashPin });
  }
  return wallet;
};

module.exports = {
  createWallet,
  setWalletPin,
};
