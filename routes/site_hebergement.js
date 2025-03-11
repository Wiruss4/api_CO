// backend/routes/site_hebergement.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ✅ Récupérer tous les sites d'hébergement avec filtres (région, district, commune, fokontany)
router.get("/", async (req, res) => {
    try {
        const { region, district, commune, fokontany } = req.query;

        let query = `
            SELECT 
                sh.*, 
                ts.nom_type, 
                r.nom_region, 
                d.nom_district, 
                c.nom_commune, 
                f.nom_fokontany
            FROM site_hebergement sh
            JOIN type_site ts ON sh.id_type = ts.id_type
            JOIN fokontany f ON sh.id_fokontany = f.id_fokontany
            JOIN commune c ON f.id_commune = c.id_commune
            JOIN district d ON c.id_district = d.id_district
            JOIN region r ON d.id_region = r.id_region
            WHERE 1=1
        `;

        let queryParams = [];

        if (region) {
            query += " AND r.nom_region = ?";
            queryParams.push(region);
        }
        if (district) {
            query += " AND d.nom_district = ?";
            queryParams.push(district);
        }
        if (commune) {
            query += " AND c.nom_commune = ?";
            queryParams.push(commune);
        }
        if (fokontany) {
            query += " AND f.nom_fokontany = ?";
            queryParams.push(fokontany);
        }

        query += " ORDER BY r.nom_region, d.nom_district, c.nom_commune, f.nom_fokontany, sh.nom_site";

        const [rows] = await db.promise().query(query, queryParams);
        res.json(rows);
    } catch (error) {
        console.error("❌ Erreur API site_hebergement :", error);
        res.status(500).json({ error: "Erreur lors de la récupération des sites." });
    }
});

// ✅ Récupérer les régions, districts, communes et fokontany distincts
router.get("/locations", async (req, res) => {
    try {
        const query = `
            SELECT DISTINCT 
                r.nom_region, 
                d.nom_district, 
                c.nom_commune, 
                f.nom_fokontany
            FROM region r
            JOIN district d ON r.id_region = d.id_region
            JOIN commune c ON d.id_district = c.id_district
            JOIN fokontany f ON c.id_commune = f.id_commune
            JOIN site_hebergement sh ON f.id_fokontany = sh.id_fokontany
        `;

        const [rows] = await db.promise().query(query);

        const locations = {
            regions: [...new Set(rows.map(row => row.nom_region))],
            districts: [...new Set(rows.map(row => row.nom_district))],
            communes: [...new Set(rows.map(row => row.nom_commune))],
            fokontanys: [...new Set(rows.map(row => row.nom_fokontany))]
        };

        res.json(locations);
    } catch (error) {
        console.error("❌ Erreur API récupération des lieux :", error);
        res.status(500).json({ error: "Erreur lors de la récupération des lieux." });
    }
});

// ✅ Ajouter un site d'hébergement
router.post("/", async (req, res) => {
    try {
        const { nom_site, capacite, latitude, longitude, id_fokontany, id_type } = req.body;
        const [result] = await db.promise().query(
            "INSERT INTO site_hebergement (nom_site, capacite, latitude, longitude, id_fokontany, id_type) VALUES (?, ?, ?, ?, ?, ?)",
            [nom_site, capacite, latitude, longitude, id_fokontany, id_type]
        );
        res.json({ id: result.insertId, nom_site, capacite, latitude, longitude, id_fokontany, id_type });
    } catch (error) {
        console.error("❌ Erreur API site_hebergement :", error);
        res.status(500).json({ error: "Erreur lors de l'ajout du site." });
    }
});

// ✅ Modifier un site d'hébergement
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { nom_site, capacite, latitude, longitude, id_fokontany, id_type } = req.body;
        await db.promise().query(
            "UPDATE site_hebergement SET nom_site = ?, capacite = ?, latitude = ?, longitude = ?, id_fokontany = ?, id_type = ? WHERE id_site = ?",
            [nom_site, capacite, latitude, longitude, id_fokontany, id_type, id]
        );
        res.json({ message: "Site d'hébergement mis à jour" });
    } catch (error) {
        console.error("❌ Erreur API site_hebergement :", error);
        res.status(500).json({ error: "Erreur lors de la mise à jour du site." });
    }
});

// ✅ Supprimer un site d'hébergement
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        console.log("🔹 ID reçu pour suppression :", id);

        if (isNaN(id)) {
            return res.status(400).json({ success: false, message: "ID invalide." });
        }

        const [site] = await db.promise().query("SELECT * FROM site_hebergement WHERE id_site = ?", [id]);

        if (site.length === 0) {
            return res.status(404).json({ success: false, message: "Site non trouvé." });
        }

        const [result] = await db.promise().query("DELETE FROM site_hebergement WHERE id_site = ?", [id]);

        console.log("✅ Suppression réussie :", result.affectedRows);
        res.json({ success: true, message: "Site d'hébergement supprimé" });
    } catch (error) {
        console.error("❌ Erreur API site_hebergement :", error);
        res.status(500).json({ success: false, error: "Erreur lors de la suppression du site." });
    }
});

module.exports = router;
