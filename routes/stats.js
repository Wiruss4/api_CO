// backend/routes/stats.js
const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

router.get('/suivi-site', statsController.getBesoinsStatsSite);

module.exports = router;
