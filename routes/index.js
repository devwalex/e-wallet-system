const express = require('express');
const userRoute = require('./user.route');
const walletRoute = require('./wallet.route');
const transactionRoute = require('./transaction.route');
const router = express.Router();

router.use(userRoute);
router.use(walletRoute);
router.use(transactionRoute);

router.get('/', (req, res) => {
    return res.status(200).json({ message: 'E-Wallet System' });
});

module.exports = router;