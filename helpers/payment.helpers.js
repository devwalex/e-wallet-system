require('dotenv/config');
const randomstring = require("randomstring");
const FlutterwaveKey = process.env.FLUTTERWAVE_KEY
const axios = require("axios");

/**
 * Make Payment with flutterwave
 *
 * @param {Integer} amount
 * @param {Object} authenticatedUser
 * @param {String} redirect_url
 * @param {String} description
 * @returns {String}
 */
const makePayment = async (
  amount,
  authenticatedUser,
  redirect_url,
  description
) => {
  try {
    const generatedTransactionReference = randomstring.generate({
      length: 10,
      charset: "alphanumeric",
      capitalization: "uppercase",
    });

    console.log('redirect_url>>>>>', redirect_url);
    const paymentLink = await axios({
      method: "post",
      url: "https://api.flutterwave.com/v3/payments",
      data: {
        tx_ref: `PID-${generatedTransactionReference}`,
        amount: amount,
        currency: "NGN",
        redirect_url: redirect_url,
        payment_options: "card",
        customer: {
          email: authenticatedUser.email,
          name:
            authenticatedUser.first_name + " " + authenticatedUser.last_name,
        },
        customizations: {
          title: "E-wallet",
          description: description,
        },
      },
      headers: {
        Authorization: `Bearer ${FlutterwaveKey}`,
        Accept: "application/json",
      },
    });
    return paymentLink.data.data.link;
  } catch (error) {
    console.error("MakePayment Error>>", error.message);
    throw new Error(error);
  }
};

/**
 * Verify Payment with flutterwave
 *
 * @param {Integer} transactionId
 * @returns {Object}
 */

const verifyPayment = async (transactionId) => {
  try {
    const paymentVerification = await axios({
      method: "get",
      url: `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
      headers: {
        Authorization: `Bearer ${FlutterwaveKey}`,
        Accept: "application/json",
      },
    });
    return paymentVerification.data.data;
  } catch (error) {
    console.error("VerifyPayment Error>>", error.message);
    throw new Error(error);
  }
}

module.exports = { makePayment, verifyPayment };
