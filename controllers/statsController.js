// backend/controllers/statsController.js
const db = require("../config/db");

// ✅ Stats dynamiques pour graphe
exports.getStatsSuiviSite = async (req, res) => {
  try {
    const { id_site, type, date, periode } = req.query;

    let column = type === 'menages' ? 'menages' : 'personnes_sinistrees_presentes';
    let query = "";
    let params = [];

    if (periode === 'month') {
      query = `
        SELECT date_suivi as date, MAX(${column}) as nombre
        FROM suivi_site_hebergement
        WHERE id_site=? AND MONTH(date_suivi)=MONTH(?) AND YEAR(date_suivi)=YEAR(?)
        GROUP BY date_suivi ORDER BY date_suivi ASC
      `;
      params = [id_site, date, date];
    } else {
      query = `
        SELECT date_suivi, heure_suivi, ${column} as nombre, hommes, femmes, femmes_enceintes, enfants_moins_5ans, personnes_agees, personnes_handicapees
        FROM suivi_site_hebergement
        WHERE id_site=? AND date_suivi=?
        ORDER BY heure_suivi ASC
      `;
      params = [id_site, date];
    }

    const [historique] = await db.promise().query(query, params);

    const nombre_actuel = historique.length > 0 ? historique[historique.length - 1].nombre : 0;
    const nombre_max = historique.reduce((max, el) => Math.max(max, el.nombre), 0);

    res.json({ id_site, type, date, periode, nombre_actuel, nombre_max, historique });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur récupération statistiques." });
  }
};
