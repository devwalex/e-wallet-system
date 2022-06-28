const db = require('../config/db')

/**
 * Get Transactions
 * @param {Object} transactionData
 * @returns {Promise<transactions>}
 */

const getTransactions = async (transactionData) => {
    const transactions = await db("transactions").where("user_id", transactionData.userId).paginate({ perPage: transactionData.limit, currentPage: transactionData.page, isLengthAware: true });
    return transactions;
};

module.exports = {
    getTransactions,
};