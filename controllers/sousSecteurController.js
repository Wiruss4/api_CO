// controllers/sousSecteurController.js
const db = require("../config/db");

exports.getSousSecteurs = async (req, res) => {
  try {
    const { id_secteur } = req.query;
    const [sousSecteurs] = await db.promise().query(
      "SELECT * FROM sous_secteur WHERE id_secteur=?",
      [id_secteur]
    );
    res.json(sousSecteurs);
  } catch (error) {
    res.status(500).json({ error: "Erreur récupération sous-secteurs." });
  }
};

exports.createSousSecteur = async (req, res) => {
  try {
    const { id_secteur, nom } = req.body;

    if (!id_secteur || !nom) {
      return res.status(400).json({ error: "L'ID du secteur et le nom du sous-secteur sont requis." });
    }

    const [result] = await db.promise().query(
      "INSERT INTO sous_secteur (id_secteur, nom_sous_secteur) VALUES (?, ?)",
      [id_secteur, nom]
    );

    res.status(201).json({ id_sous_secteur: result.insertId, id_secteur, nom_sous_secteur: nom });
  } catch (error) {
    console.error("❌ Erreur ajout sous-secteur :", error);
    res.status(500).json({ error: "Erreur ajout sous-secteur." });
  }
};


exports.updateSousSecteur = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, id_secteur } = req.body;

    if (!id_secteur || !nom) {
      return res.status(400).json({ error: "L'ID du secteur et le nom du sous-secteur sont requis." });
    }

    await db.promise().query(
      "UPDATE sous_secteur SET nom_sous_secteur=?, id_secteur=? WHERE id_sous_secteur=?",
      [nom, id_secteur, id]
    );

    res.json({ success: true });
  } catch (error) {
    console.error("❌ Erreur modification sous-secteur :", error);
    res.status(500).json({ error: "Erreur modification sous-secteur." });
  }
};


exports.deleteSousSecteur = async (req, res) => {
  try {
    const { id } = req.params;
    await db.promise().query(
      "DELETE FROM sous_secteur WHERE id_sous_secteur=?",
      [id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Erreur suppression." });
  }
};
