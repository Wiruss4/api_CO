// backend/controllers/natureController.js
const db = require("../config/db");

// Lister toutes les natures (sans filtrer par id_sous_secteur, car la relation a été supprimée)
exports.getNatures = async (req, res) => {
  try {
    const [natures] = await db.promise().query("SELECT * FROM nature");
    res.json(natures);
  } catch (error) {
    res.status(500).json({ error: "Erreur récupération nature." });
  }
};
