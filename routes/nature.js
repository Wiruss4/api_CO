const express = require('express');
const router = express.Router();
const natureController = require('../controllers/natureController');

router.get('/', natureController.getNatures);
router.post('/', natureController.createNature);
router.put('/:id', natureController.updateNature);
router.delete('/:id', natureController.deleteNature);

module.exports = router;
