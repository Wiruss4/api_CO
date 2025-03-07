const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.promise().query("SELECT * FROM population_data");
        res.json(rows);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des données :", error);
        res.status(500).json({ error: error.message });
    }
});


router.post('/', async (req, res) => {
    try {
        const { data, replaceExisting } = req.body;

        if (!Array.isArray(data) || data.length === 0) {
            return res.status(400).json({ error: 'Données invalides.' });
        }

        console.log("📩 Données reçues :", data);
        console.log("🔄 Mode remplacement :", replaceExisting);

        for (const row of data) {
            let [region] = await db.promise().query(
                "SELECT id_region FROM region WHERE nom_region = ?",
                [row.region]
            );
            let id_region = region.length ? region[0].id_region : null;

            if (!id_region) {
                const [result] = await db.promise().query(
                    "INSERT INTO region (nom_region) VALUES (?)",
                    [row.region]
                );
                id_region = result.insertId;
            }

            let [district] = await db.promise().query(
                "SELECT id_district FROM district WHERE nom_district = ? AND id_region = ?",
                [row.district, id_region]
            );
            let id_district = district.length ? district[0].id_district : null;

            if (!id_district) {
                const [result] = await db.promise().query(
                    "INSERT INTO district (nom_district, id_region) VALUES (?, ?)",
                    [row.district, id_region]
                );
                id_district = result.insertId;
            }

            let [commune] = await db.promise().query(
                "SELECT id_commune FROM commune WHERE nom_commune = ? AND id_district = ?",
                [row.commune, id_district]
            );
            let id_commune = commune.length ? commune[0].id_commune : null;

            if (!id_commune) {
                const [result] = await db.promise().query(
                    "INSERT INTO commune (nom_commune, id_district) VALUES (?, ?)",
                    [row.commune, id_district]
                );
                id_commune = result.insertId;
            }

            let [fokontany] = await db.promise().query(
                "SELECT id_fokontany FROM fokontany WHERE nom_fokontany = ? AND id_commune = ?",
                [row.fokontany, id_commune]
            );
            let id_fokontany = fokontany.length ? fokontany[0].id_fokontany : null;

            if (!id_fokontany) {
                const [result] = await db.promise().query(
                    "INSERT INTO fokontany (nom_fokontany, id_commune) VALUES (?, ?)",
                    [row.fokontany, id_commune]
                );
                id_fokontany = result.insertId;
            }

            if (!id_fokontany) {
                console.log(`⚠️ Impossible d'insérer dans population_data : id_fokontany introuvable pour ${row.fokontany}`);
                continue;
            }

            console.log(`🔍 Vérification avant insertion :`, {
                id_fokontany,
                population: row.population,
                menages: row.menages
            });

            let [existingData] = await db.promise().query(
                "SELECT id FROM population_data WHERE id_fokontany = ?",
                [id_fokontany]
            );

            if (existingData.length > 0) {
                if (replaceExisting) {
                    await db.promise().query(
                        "UPDATE population_data SET population = ?, menages = ? WHERE id_fokontany = ?",
                        [row.population, row.menages, id_fokontany]
                    );
                } else {
                    console.log(`⚠️ Données déjà existantes pour fokontany ${row.fokontany}, pas d'insertion.`);
                }
            } else {
                await db.promise().query(
                    "INSERT INTO population_data (id_fokontany, population, menages) VALUES (?, ?, ?)",
                    [id_fokontany, row.population, row.menages]
                );
            }
        }

        res.status(201).json({ message: "Données importées avec succès." });
    } catch (error) {
        console.error("❌ Erreur lors de l'importation :", error);
        res.status(500).json({ error: error.message, details: error });
    }
});

module.exports = router;
