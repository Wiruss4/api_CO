const db = require("../config/db");

// Lister tous les types selon la nature
exports.getTypes = async (req, res) => {
  try {
    const { id_nature } = req.query;
    const [types] = await db.promise().query(
      "SELECT * FROM type_besoin WHERE id_nature=?",
      [id_nature]
    );
    res.json(types);
  } catch (error) {
    res.status(500).json({ error: "Erreur récupération types." });
  }
};

// Ajouter un type de besoin
exports.createType = async (req, res) => {
  try {
    const { id_nature, nom_type } = req.body;
    const [result] = await db.promise().query(
      "INSERT INTO type_besoin (id_nature, nom_type) VALUES (?, ?)",
      [id_nature, nom_type]
    );
    res.status(201).json({ id_type: result.insertId, nom_type });
  } catch (error) {
    res.status(500).json({ error: "Erreur ajout type." });
  }
};

// Modifier un type de besoin
exports.updateType = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom_type, id_nature } = req.body;
    await db.promise().query(
      "UPDATE type_besoin SET nom_type=?, id_nature=? WHERE id_type=?",
      [nom_type, id_nature, id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Erreur modification type." });
  }
};

// Supprimer un type de besoin
exports.deleteType = async (req, res) => {
  try {
    const { id } = req.params;
    await db.promise().query(
      "DELETE FROM type_besoin WHERE id_type=?",
      [id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Erreur suppression type besoin." });
  }
};
