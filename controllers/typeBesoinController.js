// backend/controllers/typeBesoinController.js
const db = require("../config/db");

// Lister les types selon la nature et le sous-secteur
exports.getTypes = async (req, res) => {
  try {
    const { id_nature, id_sous_secteur } = req.query;

    let query = "SELECT * FROM type_besoin";
    const params = [];

    // Ajouter des conditions seulement si les paramètres existent
    if (id_nature && id_sous_secteur) {
      query += " WHERE id_nature = ? AND id_sous_secteur = ?";
      params.push(id_nature, id_sous_secteur);
    } else if (id_nature) {
      query += " WHERE id_nature = ?";
      params.push(id_nature);
    } else if (id_sous_secteur) {
      query += " WHERE id_sous_secteur = ?";
      params.push(id_sous_secteur);
    }

    const [types] = await db.promise().query(query, params);
    res.json(types);
  } catch (error) {
    console.error("Erreur récupération types :", error);
    res.status(500).json({ error: "Erreur récupération types." });
  }
};



// Ajouter un type de besoin
exports.createType = async (req, res) => {
  try {
    console.log("🔍 Données reçues en backend :", req.body);

    const { id_nature, id_sous_secteur, nom_type } = req.body;

    // Vérifier si toutes les données sont bien reçues
    if (!id_nature || !id_sous_secteur || !nom_type) {
      return res.status(400).json({ error: "Veuillez remplir tous les champs." });
    }

    // 🔍 Debug: Vérification de la requête SQL avant exécution
    console.log("🔍 SQL Query :", 
      "INSERT INTO type_besoin (id_nature, id_sous_secteur, nom_type) VALUES (?, ?, ?)", 
      [id_nature, id_sous_secteur, nom_type]
    );

    const [result] = await db.promise().query(
      "INSERT INTO type_besoin (id_nature, id_sous_secteur, nom_type) VALUES (?, ?, ?)",
      [id_nature, id_sous_secteur, nom_type]
    );

    res.status(201).json({ id_type: result.insertId, id_nature, id_sous_secteur, nom_type });
  } catch (error) {
    console.error("Erreur lors de l'insertion du type de besoin :", error);
    res.status(500).json({ error: "Erreur ajout type." });
  }
};


// Modifier un type de besoin (modifié pour inclure id_sous_secteur)
exports.updateType = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom_type, id_nature, id_sous_secteur } = req.body;
    await db.promise().query(
      "UPDATE type_besoin SET nom_type = ?, id_nature = ?, id_sous_secteur = ? WHERE id_type = ?",
      [nom_type, id_nature, id_sous_secteur, id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Erreur modification type." });
  }
};

// Supprimer un type de besoin (reste inchangé)
exports.deleteType = async (req, res) => {
  try {
    const { id } = req.params;
    await db.promise().query("DELETE FROM type_besoin WHERE id_type = ?", [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Erreur suppression type besoin." });
  }
};
