const { transactionService } = require("../services");
const httpStatus = require("http-status");
const catchAsync = require("../utils/catchasync");

const getTransactions = catchAsync(async (req, res) => {
  const transactionData = {
    userId: req.user.id,
    limit: req.query.limit,
    page: req.query.page,
  };
  const transactions = await transactionService.getTransactions(transactionData);

  return res.status(httpStatus.OK).send({
    success: true,
    message: "Returned transactions successfully",
    result: transactions,
  });
});

module.exports = {
  getTransactions,
};
