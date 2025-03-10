// backend/routes/site_hebergement.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ✅ Récupérer tous les sites d'hébergement
router.get("/", async (req, res) => {
    try {
        const [rows] = await db.promise().query(` 
            SELECT sh.*, ts.nom_type 
            FROM site_hebergement sh
            JOIN type_site ts ON sh.id_type = ts.id_type
        `);
        res.json(rows);
    } catch (error) {
        console.error("❌ Erreur API site_hebergement :", error);
        res.status(500).json({ error: "Erreur lors de la récupération des sites." });
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
        await db.promise().query("DELETE FROM site_hebergement WHERE id_site = ?", [id]);
        res.json({ message: "Site d'hébergement supprimé" });
    } catch (error) {
        console.error("❌ Erreur API site_hebergement :", error);
        res.status(500).json({ error: "Erreur lors de la suppression du site." });
    }
});

module.exports = router;
