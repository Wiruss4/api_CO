// frontend/routes/besoinSite.js

const express = require('express');
const router = express.Router();
const besoinSiteController = require('../controllers/besoinSiteController');

router.get('/', besoinSiteController.getBesoinsSite);
router.post('/', besoinSiteController.createBesoinSite);
router.put('/:id', besoinSiteController.updateBesoinSite);
router.delete('/:id', besoinSiteController.deleteBesoinSite);
router.get('/:id', besoinSiteController.getBesoinById);


module.exports = router;
