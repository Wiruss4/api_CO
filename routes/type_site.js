// backend/routes/type_site.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ✅ Récupérer tous les types de site
router.get("/", async (req, res) => {
    try {
        const [types] = await db.promise().query("SELECT * FROM type_site");
        res.json(types);
    } catch (error) {
        console.error("❌ Erreur API type_site :", error);
        res.status(500).json({ error: "Erreur lors de la récupération des types de site." });
    }
});

// ✅ Récupérer un type de site par ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const [type] = await db.promise().query("SELECT * FROM type_site WHERE id_type = ?", [id]);

        if (type.length === 0) {
            return res.status(404).json({ error: "Type de site non trouvé." });
        }

        res.json(type[0]);
    } catch (error) {
        console.error("❌ Erreur API type_site :", error);
        res.status(500).json({ error: "Erreur lors de la récupération du type de site." });
    }
});

// ✅ Ajouter un nouveau type de site
router.post("/", async (req, res) => {
    try {
        const { nom_type } = req.body;
        if (!nom_type) {
            return res.status(400).json({ error: "Le nom du type de site est requis." });
        }

        const [result] = await db.promise().query("INSERT INTO type_site (nom_type) VALUES (?)", [nom_type]);

        res.status(201).json({ message: "Type de site ajouté avec succès", id: result.insertId });
    } catch (error) {
        console.error("❌ Erreur API type_site :", error);
        res.status(500).json({ error: "Erreur lors de l'ajout du type de site." });
    }
});

// ✅ Modifier un type de site
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { nom_type } = req.body;
        if (!nom_type) {
            return res.status(400).json({ error: "Le nom du type de site est requis." });
        }

        const [result] = await db.promise().query("UPDATE type_site SET nom_type = ? WHERE id_type = ?", [nom_type, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Type de site non trouvé." });
        }

        res.json({ message: "Type de site mis à jour avec succès." });
    } catch (error) {
        console.error("❌ Erreur API type_site :", error);
        res.status(500).json({ error: "Erreur lors de la mise à jour du type de site." });
    }
});

// ✅ Supprimer un type de site
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.promise().query("DELETE FROM type_site WHERE id_type = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Type de site non trouvé." });
        }

        res.json({ message: "Type de site supprimé avec succès." });
    } catch (error) {
        console.error("❌ Erreur API type_site :", error);
        res.status(500).json({ error: "Erreur lors de la suppression du type de site." });
    }
});

module.exports = router;
