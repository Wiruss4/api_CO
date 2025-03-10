// backend/routes/suivi_site_hebergement_full.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ✅ Récupérer tous les suivis avec détails + possibilité de filtrer (région, commune, fokontany, site)
router.get("/", async (req, res) => {
  try {
    const { region, commune, fokontany, id_site } = req.query;

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
        sh.nom_site,
        sh.capacite,
        ts.nom_type AS type_site,
        r.nom_region,
        d.nom_district,
        c.nom_commune,
        f.nom_fokontany
      FROM suivi_site_hebergement s
      JOIN site_hebergement sh ON s.id_site = sh.id_site
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
    if (commune) {
      query += " AND c.nom_commune = ?";
      queryParams.push(commune);
    }
    if (fokontany) {
      query += " AND f.nom_fokontany = ?";
      queryParams.push(fokontany);
    }
    if (id_site) {
      query += " AND sh.id_site = ?";
      queryParams.push(id_site);
    }

    query += " ORDER BY s.date_suivi DESC, s.heure_suivi DESC";

    const [rows] = await db.promise().query(query, queryParams);
    res.json(rows);
  } catch (error) {
    console.error("❌ Erreur API suivi_site_hebergement_full :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des suivis." });
  }
});

// ✅ Nouvelle route : Récupérer uniquement les régions distinctes
router.get("/regions", async (req, res) => {
  try {
    const query = `
      SELECT DISTINCT r.nom_region 
      FROM region r
      JOIN district d ON r.id_region = d.id_region
      JOIN commune c ON d.id_district = c.id_district
      JOIN fokontany f ON c.id_commune = f.id_commune
      JOIN site_hebergement sh ON f.id_fokontany = sh.id_fokontany
      JOIN suivi_site_hebergement s ON sh.id_site = s.id_site
      ORDER BY r.nom_region
    `;

    const [rows] = await db.promise().query(query);
    res.json(rows.map(row => row.nom_region)); // ✅ Retourne un tableau simple de noms de régions
  } catch (error) {
    console.error("❌ Erreur API récupération des régions :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des régions." });
  }
});

// ✅ Ajouter un suivi
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

// ✅ Modifier un suivi
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

// ✅ Supprimer un suivi
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

// ✅ Supprimer plusieurs suivis en une seule requête
router.delete("/", async (req, res) => {
  try {
    const { ids } = req.body; 

    if (!ids || ids.length === 0) {
      return res.status(400).json({ error: "Aucun suivi sélectionné pour suppression." });
    }

    const query = "DELETE FROM suivi_site_hebergement WHERE id IN (?)";
    await db.promise().query(query, [ids]);

    res.json({ success: true, message: "Suivis supprimés avec succès." });
  } catch (error) {
    console.error("❌ Erreur lors de la suppression des suivis :", error);
    res.status(500).json({ error: "Erreur lors de la suppression des suivis." });
  }
});

module.exports = router;

