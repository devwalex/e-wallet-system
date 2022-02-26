const express = require('express');
const userRoute = require('./user.route');
const router = express.Router();

router.use(userRoute);

router.get('/', (req, res) => {
    return res.status(200).json({ message: 'E-Wallet System' });
});

module.exports = router;