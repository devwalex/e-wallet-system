const db = require("../config/db");
const randomstring = require("randomstring");
const bcrypt = require("bcryptjs");
const {
  makePayment,
  verifyPayment,
  withdrawPayment,
} = require("../helpers/payment.helpers");
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
    await db("wallets")
      .where("user_id", user.id)
      .update({ wallet_pin: hashPin });
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

  const appUrl =
    process.env.HOST && process.env.PORT
      ? `http://${process.env.HOST}:${process.env.PORT}`
      : "http://localhost:3000";

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

  const transaction = await db("transactions")
    .where("user_id", user.id)
    .where("transaction_code", payment.id)
    .first();

  if (!transaction) {
    await db("wallets")
      .where("user_id", user.id)
      .increment("balance", payment.amount);

    await db("transactions").insert({
      user_id: user.id,
      transaction_code: payment.id,
      transaction_reference: payment.tx_ref,
      amount: payment.amount,
      description: "Wallet Funding",
      status: payment.status,
      payment_method: payment.payment_type,
      is_inflow: true,
    });
  }

  return payment;
};

/**
 * Verify Wallet Funding
 * @param {Object} walletData
 * @returns {Promise<Wallet>}
 */

const transferFund = async (walletData) => {
  const sender = walletData.user;
  const walletCodeOrEmail = walletData.wallet_code_or_email;
  const amount = walletData.amount;
  const walletPin = walletData.wallet_pin;

  let recipient;
  if (walletCodeOrEmail.includes("@")) {
    recipient = await db("users").where("email", walletCodeOrEmail).first();
  } else {
    const recipientWallet = await db("wallets")
      .where("wallet_code", walletCodeOrEmail)
      .first();

    const recipientID = recipientWallet?.user_id || null

    recipient = await db("users").where("id", recipientID).first();
  }

  if (!recipient) {
    return Promise.reject({
      message: "Recipient not found",
      success: false,
    });
  }

  if (sender.id === recipient.id) {
    return Promise.reject({
      message: "You cannot transfer fund to yourself",
      success: false,
    });
  }

  const senderWallet = await db("wallets")
    .where("user_id", sender.id)
    .first();

  if (senderWallet.balance < amount) {
    return Promise.reject({ message: "Insufficient Fund", success: false });
  }

  // Check if wallet pin is correct
  const match = await bcrypt.compare(walletPin, senderWallet.wallet_pin);

  if (!match) {
    return Promise.reject({
      message: "Incorrect Pin",
      success: false,
    });
  }

  const generatedTransactionReference = randomstring.generate({
    length: 10,
    charset: "alphanumeric",
    capitalization: "uppercase",
  });

  const generatedTransactionCode = randomstring.generate({
    length: 7,
    charset: "numeric",
  });

  // Deduct from sender wallet
  await db("wallets").where("user_id", sender.id).decrement("balance", amount);

  await db("transactions").insert({
    user_id: sender.id,
    transaction_code: generatedTransactionCode,
    transaction_reference: `PID-${generatedTransactionReference}`,
    amount: amount,
    description: "Fund Transfer",
    status: "successful",
    payment_method: "wallet",
    is_inflow: false,
  });

  // Add to recipient wallet
  await db("wallets")
    .where("user_id", recipient.id)
    .increment("balance", amount);

  await db("transactions").insert({
    user_id: recipient.id,
    transaction_code: generatedTransactionCode,
    transaction_reference: `PID-${generatedTransactionReference}`,
    amount: amount,
    description: "Fund Transfer",
    status: "successful",
    payment_method: "wallet",
    is_inflow: true,
  });
};

/**
 * Withdraw Fund
 * @param {Object} walletData
 * @returns {Promise<Wallet>}
 */

const withdrawFund = async (walletData) => {
  const user = walletData.user;
  const bankCode = walletData.bank_code;
  const accountNumber = walletData.account_number;
  const amount = walletData.amount;
  const walletPin = walletData.wallet_pin;

  const userWallet = await db("wallets")
    .where("user_id", user.id)
    .first();

  if (userWallet.balance < amount) {
    return Promise.reject({ message: "Insufficient Fund", success: false });
  }

    // Check if wallet pin is correct
    const match = await bcrypt.compare(walletPin, userWallet.wallet_pin);

    if (!match) {
      return Promise.reject({
        message: "Incorrect Pin",
        success: false,
      });
    }

  const payment = await withdrawPayment(amount, bankCode, accountNumber);

  const amountToDeduct = payment.amount + payment.fee

  // Deduct from user wallet
  await db("wallets").where("user_id", user.id).decrement("balance", amountToDeduct);

  await db("transactions").insert({
    user_id: user.id,
    transaction_code: payment.id,
    transaction_reference: payment.reference,
    amount: amountToDeduct,
    description: "Fund Withdrawal",
    status: 'successful',
    payment_method: 'bank transfer',
    is_inflow: false,
  });
};

module.exports = {
  createWallet,
  setWalletPin,
  fundWallet,
  verifyWalletFunding,
  transferFund,
  withdrawFund
};
