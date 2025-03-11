const db = require("../config/db");

// Lister les natures par sous_secteur
exports.getNatures = async (req, res) => {
  try {
    const { id_sous_secteur } = req.query;
    const [natures] = await db.promise().query(
      "SELECT * FROM nature WHERE id_sous_secteur=?",
      [id_sous_secteur]
    );
    res.json(natures);
  } catch (error) {
    res.status(500).json({ error: "Erreur récupération nature." });
  }
};

// Ajouter une nature
exports.createNature = async (req, res) => {
  try {
    const { id_sous_secteur, nom_nature } = req.body;
    const [result] = await db.promise().query(
      "INSERT INTO nature (id_sous_secteur, nom_nature) VALUES (?, ?)",
      [id_sous_secteur, nom_nature]
    );
    res.status(201).json({ id_nature: result.insertId, nom_nature });
  } catch (error) {
    res.status(500).json({ error: "Erreur ajout nature." });
  }
};

// Modifier une nature
exports.updateNature = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom_nature, id_sous_secteur } = req.body;
    await db.promise().query(
      "UPDATE nature SET nom_nature=?, id_sous_secteur=? WHERE id_nature=?",
      [nom_nature, id_sous_secteur, id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Erreur modification nature." });
  }
};

// Supprimer une nature
exports.deleteNature = async (req, res) => {
  try {
    const { id } = req.params;
    await db.promise().query(
      "DELETE FROM nature WHERE id_nature=?",
      [id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Erreur suppression nature." });
  }
};
