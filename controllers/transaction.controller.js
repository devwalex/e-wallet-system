const { transactionService } = require("../services");
const httpStatus = require("http-status");

const getTransactions = async (req, res) => {
  try {

    const transactionData = {
        userId: req.user.id,
        limit: req.query.limit,
        page: req.query.page
    };
    const transactions = await transactionService.getTransactions(transactionData);

    return res.status(httpStatus.OK).send({
      success: true,
      message: "Returned transactions successfully",
      result: transactions,
    });
  } catch (error) {
    console.error("GetTransactions Error ==>", error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};

module.exports = {
  getTransactions,
};
