// routes/sousSecteur.js
const express = require('express');
const router = express.Router();
const sousSecteurController = require('../controllers/sousSecteurController');

router.get('/', sousSecteurController.getSousSecteurs);
router.post('/', sousSecteurController.createSousSecteur);
router.put('/:id', sousSecteurController.updateSousSecteur);
router.delete('/:id', sousSecteurController.deleteSousSecteur);

module.exports = router;
