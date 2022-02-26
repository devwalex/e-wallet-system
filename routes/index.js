const express = require('express');
const userRoute = require('./user.route');
const walletRoute = require('./wallet.route');
const router = express.Router();

router.use(userRoute);
router.use(walletRoute);

router.get('/', (req, res) => {
    return res.status(200).json({ message: 'E-Wallet System' });
});

module.exports = router;