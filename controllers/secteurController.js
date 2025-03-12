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
      console.log("📢 Requête reçue :", req.body);  // ✅ Debugging

      const { nom } = req.body;

      if (!nom) {
          return res.status(400).json({ error: "Le nom du secteur est requis." });
      }

      const [result] = await db.promise().query(
          "INSERT INTO secteur (nom_secteur) VALUES (?)",
          [nom]
      );

      res.status(201).json({ id: result.insertId, nom });
  } catch (error) {
      console.error("❌ Erreur API secteur:", error);
      res.status(500).json({ error: "Erreur serveur." });
  }
};



// ✅ Modifier un secteur
exports.updateSecteur = async (req, res) => {
  try {
      const { id } = req.params;
      const { nom } = req.body;  // ❌ Correction ici (nom au lieu de nom_secteur)

      if (!nom) {
          return res.status(400).json({ error: "Le nom du secteur est requis." });
      }

      const [result] = await db.promise().query(
          "UPDATE secteur SET nom_secteur = ? WHERE id_secteur = ?",
          [nom, id]
      );

      if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Secteur non trouvé." });
      }

      res.json({ message: "Secteur modifié avec succès" });
  } catch (error) {
      console.error("❌ Erreur API modification secteur :", error);
      res.status(500).json({ error: "Erreur serveur." });
  }
};


// ✅ Supprimer un secteur
exports.deleteSecteur = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Supprimer d'abord les sous-secteurs liés
    await db.promise().query("DELETE FROM sous_secteur WHERE id_secteur=?", [id]);

    // ✅ Ensuite supprimer le secteur
    const [result] = await db.promise().query("DELETE FROM secteur WHERE id_secteur=?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Secteur non trouvé." });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("❌ Erreur suppression secteur :", error);
    res.status(500).json({ error: "Erreur suppression secteur." });
  }
};
