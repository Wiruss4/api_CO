// backend/routes/region.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');


router.get('/', async (req, res) => {
    try {
        const [regions] = await db.promise().query("SELECT * FROM region");
        res.json(regions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { nom_region } = req.body;
        if (!nom_region) {
            return res.status(400).json({ error: "Nom de la région requis." });
        }
        const [result] = await db.promise().query(
            "INSERT INTO region (nom_region) VALUES (?)",
            [nom_region]
        );
        res.status(201).json({ message: "Région ajoutée avec succès", id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 🔴 Suppression d'une région et de toutes ses données associées
router.delete('/:id_region', async (req, res) => {
    const id_region = req.params.id_region;

    try {
        // ✅ Supprimer les données associées (population)
        await db.promise().query(
            "DELETE FROM population_data WHERE id_fokontany IN (SELECT id_fokontany FROM fokontany WHERE id_commune IN (SELECT id_commune FROM commune WHERE id_district IN (SELECT id_district FROM district WHERE id_region = ?)))",
            [id_region]
        );

        // ✅ Supprimer les fokontany
        await db.promise().query(
            "DELETE FROM fokontany WHERE id_commune IN (SELECT id_commune FROM commune WHERE id_district IN (SELECT id_district FROM district WHERE id_region = ?))",
            [id_region]
        );

        // ✅ Supprimer les communes
        await db.promise().query(
            "DELETE FROM commune WHERE id_district IN (SELECT id_district FROM district WHERE id_region = ?)",
            [id_region]
        );

        // ✅ Supprimer les districts
        await db.promise().query(
            "DELETE FROM district WHERE id_region = ?",
            [id_region]
        );

        // ✅ Supprimer la région elle-même
        await db.promise().query(
            "DELETE FROM region WHERE id_region = ?",
            [id_region]
        );

        res.status(200).json({ message: "Région supprimée avec succès" });
    } catch (error) {
        console.error("❌ Erreur lors de la suppression de la région :", error);
        res.status(500).json({ error: "Erreur lors de la suppression de la région", details: error.message });
    }
});

module.exports = router;