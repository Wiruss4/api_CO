// backend/routes/typeBesoin.js
const express = require('express');
const router = express.Router();
const typeBesoinController = require('../controllers/typeBesoinController');

router.get('/', typeBesoinController.getTypes);
router.post('/', typeBesoinController.createType);
router.put('/:id', typeBesoinController.updateType);
router.delete('/:id', typeBesoinController.deleteType);

module.exports = router;
