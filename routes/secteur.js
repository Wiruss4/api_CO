// backend/routes/secteur.js
const express = require('express');
const router = express.Router();
const secteurController = require('../controllers/secteurController');

// Routes Secteurs
router.get('/', secteurController.getSecteurs);
router.post('/', secteurController.createSecteur);
router.put('/:id', secteurController.updateSecteur);
router.delete('/:id', secteurController.deleteSecteur);

module.exports = router;
