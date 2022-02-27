const httpStatus = require("http-status");
const db = require("../config/db");


const setWalletPin = async (req, res, next) => {
  try {
    const user = req.user;

    const wallet = await db("wallets").where("user_id", user.id).first();

    if (!wallet.wallet_pin) {
      return res.status(httpStatus.BAD_REQUEST).send({
        success: false,
        message: "Please set your wallet pin before performing any transaction",
      });
    }
    next();
  } catch (error) {
    console.error("setWalletPin Middleware Error ==>", error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};

module.exports = {
  setWalletPin,
};
