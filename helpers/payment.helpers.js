require("dotenv/config");
const randomstring = require("randomstring");
const FlutterwaveKey = process.env.FLUTTERWAVE_KEY;
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
const makePayment = async (amount, authenticatedUser, redirect_url, description) => {
  try {
    const generatedTransactionReference = randomstring.generate({
      length: 10,
      charset: "alphanumeric",
      capitalization: "uppercase",
    });
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
          name: authenticatedUser.first_name + " " + authenticatedUser.last_name,
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
};

/**
 * Widthraw Payment with flutterwave
 *
 * @param {Integer} amount
 * @param {String} bank_code
 * @param {String} account_number
 * @returns {Object}
 */

const withdrawPayment = async (amount, bank_code, account_number) => {
  try {
    /**
     * NOTE:
     * Withdraw Fund does work because: Compliance approval required to use this feature
     */

    const generatedTransactionReference = randomstring.generate({
      length: 10,
      charset: "alphanumeric",
      capitalization: "uppercase",
    });

    const mockWithdrawFundResponse = {
      status: "success",
      message: "Transfer Queued Successfully",
      data: {
        id: 190626,
        account_number: "0690000040",
        bank_code: "044",
        full_name: "Alexis Sanchez",
        created_at: "2021-04-26T11:19:55.000Z",
        currency: "NGN",
        debit_currency: "NGN",
        amount: amount,
        fee: 10.75,
        status: "NEW",
        reference: `PID-${generatedTransactionReference}`,
        meta: null,
        narration: "Payment for things",
        complete_message: "",
        requires_approval: 0,
        is_approved: 1,
        bank_name: "ACCESS BANK NIGERIA",
      },
    };
    return mockWithdrawFundResponse.data;
  } catch (error) {
    console.error("withdrawPayment Error>>", error);
    throw new Error(error);
  }
};

/**
 * Fetch Bank List from flutterwave
 *
 * @returns {Object}
 */
const getBankList = async () => {
  try {
    const banks = await axios({
      method: "get",
      url: `https://api.flutterwave.com/v3/banks/NG`,
      headers: {
        Authorization: `Bearer ${FlutterwaveKey}`,
        Accept: "application/json",
      },
    });
    return banks.data.data;
  } catch (error) {
    console.error("Get Banks Error>>", error.message);
    throw new Error(error);
  }
};

/**
 * Resolve a bank account to get the account holder's details
 *
 * @param {String} bank_code
 * @param {String} account_number
 * @returns {Object}
 */
const retrieveBankAccountName = async (bank_code, account_number) => {
  try {
    const accountName = await axios({
      method: "post",
      url: `https://api.flutterwave.com/v3/accounts/resolve`,
      data: { account_bank: bank_code, account_number },
      headers: {
        Authorization: `Bearer ${FlutterwaveKey}`,
        Accept: "application/json",
      },
    });
    return accountName.data.data;
  } catch (error) {
    console.error("Retrieve Bank Account Name Error>>", error.response?.data);
    if (error.response?.data) {
      throw new Error(error.response?.data?.message)
    }
    throw new Error(error);
  }
};

module.exports = { makePayment, verifyPayment, withdrawPayment, getBankList, retrieveBankAccountName };
