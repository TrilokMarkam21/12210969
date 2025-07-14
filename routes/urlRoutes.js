const express = require('express');
const router = express.Router();
const { createShortUrl, redirectUrl, getShortUrlStats } = require('../controllers/urlcontrollers');

router.post('/shorten', createShortUrl);
router.get('/:shortCode', redirectUrl); 
router.get('/:shortCode/stats', getShortUrlStats);

module.exports = router;