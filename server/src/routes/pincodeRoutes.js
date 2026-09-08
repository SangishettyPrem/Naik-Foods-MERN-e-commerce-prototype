const express = require('express');
const router = express.Router();
const { checkPincode } = require('../controllers/pincodeController');

router.post('/check', checkPincode);

module.exports = router;
