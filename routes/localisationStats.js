// backend/routes/localisationStats.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ✅ Route pour récupérer les données avec filtres
router.get("/", async (req, res) => {
    try {
        const { region, district } = req.query; // Récupère les paramètres de filtre

        let query = `
            SELECT DISTINCT
                f.id_fokontany,  -- ✅ Utiliser un identifiant unique
                d.nom_district,
                c.nom_commune,
                f.nom_fokontany,
                COALESCE(p.population, 0) AS population,
                COALESCE(p.menages, 0) AS menages,
                r.nom_region
            FROM fokontany f
            JOIN commune c ON f.id_commune = c.id_commune
            JOIN district d ON c.id_district = d.id_district
            JOIN region r ON d.id_region = r.id_region
            LEFT JOIN population_data p ON f.id_fokontany = p.id_fokontany
            WHERE 1=1
        `;

        let queryParams = [];

        // 🔹 Appliquer les filtres si fournis
        if (region) {
            query += " AND r.nom_region = ?";
            queryParams.push(region);
        }
        if (district) {
            query += " AND d.nom_district = ?";
            queryParams.push(district);
        }

        query += " GROUP BY f.id_fokontany";  // ✅ Éviter les doublons sur les fokontany

        const [rows] = await db.promise().query(query, queryParams);
        res.json(rows);
    } catch (error) {
        console.error("❌ Erreur API localisationStats :", error);
        res.status(500).json({ error: "Erreur lors de la récupération des données." });
    }
});


// ✅ Route pour récupérer la liste des régions avec leurs statistiques
router.get("/regions", async (req, res) => {
    try {
        let query = `
            SELECT 
                r.nom_region, 
                COUNT(DISTINCT d.id_district) AS nb_districts,
                COUNT(DISTINCT c.id_commune) AS nb_communes,
                COUNT(DISTINCT f.id_fokontany) AS nb_fokontany,
                COALESCE(SUM(p.population), 0) AS population_total,
                COALESCE(SUM(p.menages), 0) AS menage_total
            FROM region r
            LEFT JOIN district d ON r.id_region = d.id_region
            LEFT JOIN commune c ON d.id_district = c.id_district
            LEFT JOIN fokontany f ON c.id_commune = f.id_commune
            LEFT JOIN population_data p ON f.id_fokontany = p.id_fokontany
            GROUP BY r.nom_region
            ORDER BY r.nom_region;
        `;

        const [rows] = await db.promise().query(query);
        res.json(rows);
    } catch (error) {
        console.error("❌ Erreur API récupération régions :", error);
        res.status(500).json({ error: "Erreur lors de la récupération des régions." });
    }
});


// ✅ Route pour supprimer une région et toutes ses données associées
router.delete("/deleteRegions", async (req, res) => {
    try {
        const { regionNames } = req.body; // Liste des régions à supprimer

        if (!regionNames || regionNames.length === 0) {
            return res.status(400).json({ error: "Aucune région sélectionnée." });
        }

        // 🔹 Récupérer les IDs des régions à supprimer
        const [regionRows] = await db.promise().query(
            "SELECT id_region FROM region WHERE nom_region IN (?)",
            [regionNames]
        );

        if (regionRows.length === 0) {
            return res.status(404).json({ error: "Régions non trouvées." });
        }

        const regionIds = regionRows.map((row) => row.id_region);

        // 🔥 Suppression des données associées dans l'ordre des dépendances
        await db.promise().query("DELETE FROM population_data WHERE id_fokontany IN (SELECT id_fokontany FROM fokontany WHERE id_commune IN (SELECT id_commune FROM commune WHERE id_district IN (SELECT id_district FROM district WHERE id_region IN (?))))", [regionIds]);

        await db.promise().query("DELETE FROM fokontany WHERE id_commune IN (SELECT id_commune FROM commune WHERE id_district IN (SELECT id_district FROM district WHERE id_region IN (?)))", [regionIds]);

        await db.promise().query("DELETE FROM commune WHERE id_district IN (SELECT id_district FROM district WHERE id_region IN (?))", [regionIds]);

        await db.promise().query("DELETE FROM district WHERE id_region IN (?)", [regionIds]);

        await db.promise().query("DELETE FROM region WHERE id_region IN (?)", [regionIds]);

        res.json({ success: true, message: "Régions supprimées avec succès." });

    } catch (error) {
        console.error("❌ Erreur API suppression région :", error);
        res.status(500).json({ error: "Erreur lors de la suppression des régions." });
    }
});



module.exports = router;
