// backend/routes/fokontany.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
    try {
        const [fokontany] = await db.promise().query("SELECT * FROM fokontany");
        res.json(fokontany);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { nom_fokontany, id_commune } = req.body;
        if (!nom_fokontany || !id_commune) {
            return res.status(400).json({ error: "Nom du fokontany et ID de la commune requis." });
        }
        const [result] = await db.promise().query(
            "INSERT INTO fokontany (nom_fokontany, id_commune) VALUES (?, ?)",
            [nom_fokontany, id_commune]
        );
        res.status(201).json({ message: "Fokontany ajouté avec succès", id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
