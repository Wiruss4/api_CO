const db = require("../config/db");

// ✅ Lister les besoins par site
exports.getBesoinsSite = async (req, res) => {
  try {
    const { id_site } = req.query;
    const [besoins] = await db.promise().query(
      `SELECT bs.*, tb.nom_type, n.nom_nature, ss.nom_sous_secteur, s.nom_secteur
       FROM besoin_site bs
       JOIN type_besoin tb ON bs.id_type = tb.id_type
       JOIN nature n ON tb.id_nature = n.id_nature
       JOIN sous_secteur ss ON n.id_sous_secteur = ss.id_sous_secteur
       JOIN secteur s ON ss.id_secteur = s.id_secteur
       WHERE bs.id_site = ?`,
      [id_site]
    );
    res.json(besoins);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur récupération besoins site." });
  }
};

// ✅ Ajouter un besoin pour un site
exports.createBesoinSite = async (req, res) => {
  try {
    const { id_site, id_type, etat, quantite } = req.body;
    const [result] = await db.promise().query(
      "INSERT INTO besoin_site (id_site, id_type, etat, quantite) VALUES (?, ?, ?, ?)",
      [id_site, id_type, etat, quantite]
    );
    res.status(201).json({ id_besoin: result.insertId, id_site, id_type, etat, quantite });
  } catch (error) {
    res.status(500).json({ error: "Erreur ajout besoin." });
  }
};

// ✅ Modifier un besoin
exports.updateBesoinSite = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_type, etat, quantite } = req.body;
    await db.promise().query(
      "UPDATE besoin_site SET id_type=?, etat=?, quantite=? WHERE id_besoin=?",
      [id_type, etat, quantite, id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Erreur modification besoin." });
  }
};

// ✅ Supprimer un besoin
exports.deleteBesoinSite = async (req, res) => {
  try {
    const { id } = req.params;
    await db.promise().query(
      "DELETE FROM besoin_site WHERE id_besoin=?",
      [id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Erreur suppression besoin." });
  }
};
