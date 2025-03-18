// backend/controllers/statsController.js
const db = require("../config/db");

exports.getStatsSuiviSite = async (req, res) => {
  try {
    let { id_site, type, date, periode } = req.query;

    id_site = parseInt(id_site, 10);
    let column = type === 'menages' ? 'menages' : 'personnes_sinistrees_presentes';

    let query = "";
    let params = [];

    if (periode === 'year') {
      query = `
        SELECT DATE_FORMAT(CONVERT_TZ(date_suivi, '+00:00', @@session.time_zone), '%Y-%m') as date, 
               MAX(${column}) as nombre
        FROM suivi_site_hebergement
        WHERE id_site=? AND YEAR(date_suivi) = YEAR(?)
        GROUP BY YEAR(date_suivi), MONTH(date_suivi)
        ORDER BY date_suivi ASC
      `;
      params = [id_site, date];
    } else if (periode === 'month') {
      query = `
        SELECT DATE_FORMAT(CONVERT_TZ(date_suivi, '+00:00', @@session.time_zone), '%Y-%m-%d') as date, 
               MAX(${column}) as nombre
        FROM suivi_site_hebergement
        WHERE id_site=? AND YEAR(date_suivi) = YEAR(?) AND MONTH(date_suivi) = MONTH(?)
        GROUP BY date_suivi
        ORDER BY date_suivi ASC
      `;
      params = [id_site, date, date];
    } else {
      query = `
        SELECT 
            DATE_FORMAT(CONVERT_TZ(date_suivi, '+00:00', @@session.time_zone), '%Y-%m-%d') as date_suivi, 
            heure_suivi, 
            ${column} as nombre, 
            hommes, 
            femmes, 
            femmes_enceintes, 
            enfants_moins_5ans, 
            personnes_agees, 
            personnes_handicapees
        FROM suivi_site_hebergement
        WHERE id_site=? AND DATE(CONVERT_TZ(date_suivi, '+00:00', @@session.time_zone))=?
        ORDER BY heure_suivi DESC
      `;
      params = [id_site, date];
    }

    const [historique] = await db.promise().query(query, params);

    // 🔹 Correction pour récupérer le dernier suivi avec la bonne date
    const latestQuery = `
      SELECT 
          ${column} as nombre, 
          DATE_FORMAT(CONVERT_TZ(date_suivi, '+00:00', @@session.time_zone), '%Y-%m-%d') as date_suivi, 
          heure_suivi
      FROM suivi_site_hebergement
      WHERE id_site=?
      ORDER BY date_suivi DESC, heure_suivi DESC
      LIMIT 1
    `;

    const [latest] = await db.promise().query(latestQuery, [id_site]);

    const nombre_actuel = latest.length > 0 ? latest[0].nombre : 0;
    const nombre_max = historique.reduce((max, el) => Math.max(max, el.nombre), 0);

    res.json({ id_site, type, date, periode, nombre_actuel, nombre_max, historique });
  } catch (err) {
    console.error("Erreur API Stats:", err);
    res.status(500).json({ error: "Erreur récupération statistiques." });
  }
};
