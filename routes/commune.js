// backend/routes/commune.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
    try {
        const [communes] = await db.promise().query("SELECT * FROM commune");
        res.json(communes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { nom_commune, id_district } = req.body;
        if (!nom_commune || !id_district) {
            return res.status(400).json({ error: "Nom de la commune et ID du district requis." });
        }
        const [result] = await db.promise().query(
            "INSERT INTO commune (nom_commune, id_district) VALUES (?, ?)",
            [nom_commune, id_district]
        );
        res.status(201).json({ message: "Commune ajoutée avec succès", id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
