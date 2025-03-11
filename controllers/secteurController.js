// backend/controllers/secteurController.js
const db = require("../config/db");

// ✅ Lister tous les secteurs
exports.getSecteurs = async (req, res) => {
  try {
    const [secteurs] = await db.promise().query("SELECT * FROM secteur");
    res.json(secteurs);
  } catch (error) {
    console.error("❌ Erreur récupération secteurs :", error);
    res.status(500).json({ error: "Erreur récupération secteurs." });
  }
};

// ✅ Ajouter un secteur
exports.createSecteur = async (req, res) => {
  try {
    const { nom_secteur } = req.body;
    const [result] = await db.promise().query(
      "INSERT INTO secteur (nom_secteur) VALUES (?)",
      [nom_secteur]
    );
    res.status(201).json({ id_secteur: result.insertId, nom_secteur });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur ajout secteur." });
  }
};

// ✅ Modifier un secteur
exports.updateSecteur = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom_secteur } = req.body;
    await db.promise().query(
      "UPDATE secteur SET nom_secteur=? WHERE id_secteur=?",
      [nom_secteur, id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Erreur mise à jour secteur." });
  }
};

// ✅ Supprimer un secteur
exports.deleteSecteur = async (req, res) => {
  try {
    const { id } = req.params;
    await db.promise().query(
      "DELETE FROM secteur WHERE id_secteur=?",
      [id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Erreur suppression secteur." });
  }
};
