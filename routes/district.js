// backend/routes/district.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
    try {
        const [districts] = await db.promise().query("SELECT * FROM district");
        res.json(districts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { nom_district, id_region } = req.body;
        if (!nom_district || !id_region) {
            return res.status(400).json({ error: "Nom du district et ID de la région requis." });
        }
        const [result] = await db.promise().query(
            "INSERT INTO district (nom_district, id_region) VALUES (?, ?)",
            [nom_district, id_region]
        );
        res.status(201).json({ message: "District ajouté avec succès", id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
