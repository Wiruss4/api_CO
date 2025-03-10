// backend/routes/suivi_site_hebergement.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ✅ Route pour récupérer les suivis avec filtres (date_suivi et site)
router.get("/", async (req, res) => {
    try {
        const { date_suivi, id_site } = req.query;

        let query = `
            SELECT 
                s.id, 
                s.date_suivi, 
                s.heure_suivi, 
                s.menages, 
                s.personnes_sinistrees_presentes, 
                s.hommes, 
                s.femmes, 
                s.femmes_enceintes, 
                s.enfants_moins_5ans, 
                s.personnes_agees, 
                s.personnes_handicapees,
                sh.nom_site
            FROM suivi_site_hebergement s
            JOIN site_hebergement sh ON s.id_site = sh.id_site
            WHERE 1=1
        `;

        let queryParams = [];

        // 🔹 Appliquer les filtres si fournis
        if (date_suivi) {
            query += " AND s.date_suivi = ?";
            queryParams.push(date_suivi);
        }
        if (id_site) {
            query += " AND s.id_site = ?";
            queryParams.push(id_site);
        }

        query += " ORDER BY s.date_suivi DESC, s.heure_suivi DESC";

        const [rows] = await db.promise().query(query, queryParams);
        res.json(rows);
    } catch (error) {
        console.error("❌ Erreur API suivi_site_hebergement :", error);
        res.status(500).json({ error: "Erreur lors de la récupération des suivis." });
    }
});

// ✅ Route pour ajouter un suivi
router.post("/", async (req, res) => {
    try {
        const {
            date_suivi,
            heure_suivi,
            menages,
            personnes_sinistrees_presentes,
            hommes,
            femmes,
            femmes_enceintes,
            enfants_moins_5ans,
            personnes_agees,
            personnes_handicapees,
            id_site
        } = req.body;

        const query = `
            INSERT INTO suivi_site_hebergement 
            (date_suivi, heure_suivi, menages, personnes_sinistrees_presentes, hommes, femmes, 
            femmes_enceintes, enfants_moins_5ans, personnes_agees, personnes_handicapees, id_site)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.promise().query(query, [
            date_suivi, heure_suivi, menages, personnes_sinistrees_presentes, hommes, femmes,
            femmes_enceintes, enfants_moins_5ans, personnes_agees, personnes_handicapees, id_site
        ]);

        res.status(201).json({ success: true, message: "Suivi ajouté avec succès", id: result.insertId });
    } catch (error) {
        console.error("❌ Erreur lors de l'ajout du suivi :", error);
        res.status(500).json({ error: "Erreur lors de l'ajout du suivi." });
    }
});

// ✅ Route pour mettre à jour un suivi
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const {
            date_suivi,
            heure_suivi,
            menages,
            personnes_sinistrees_presentes,
            hommes,
            femmes,
            femmes_enceintes,
            enfants_moins_5ans,
            personnes_agees,
            personnes_handicapees,
            id_site
        } = req.body;

        const query = `
            UPDATE suivi_site_hebergement 
            SET date_suivi = ?, heure_suivi = ?, menages = ?, personnes_sinistrees_presentes = ?, 
                hommes = ?, femmes = ?, femmes_enceintes = ?, enfants_moins_5ans = ?, 
                personnes_agees = ?, personnes_handicapees = ?, id_site = ?
            WHERE id = ?
        `;

        await db.promise().query(query, [
            date_suivi, heure_suivi, menages, personnes_sinistrees_presentes, hommes, femmes,
            femmes_enceintes, enfants_moins_5ans, personnes_agees, personnes_handicapees, id_site, id
        ]);

        res.json({ success: true, message: "Suivi mis à jour avec succès" });
    } catch (error) {
        console.error("❌ Erreur lors de la mise à jour du suivi :", error);
        res.status(500).json({ error: "Erreur lors de la mise à jour du suivi." });
    }
});

// ✅ Route pour supprimer un suivi
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const query = "DELETE FROM suivi_site_hebergement WHERE id = ?";
        await db.promise().query(query, [id]);

        res.json({ success: true, message: "Suivi supprimé avec succès" });
    } catch (error) {
        console.error("❌ Erreur lors de la suppression du suivi :", error);
        res.status(500).json({ error: "Erreur lors de la suppression du suivi." });
    }
});

module.exports = router;
