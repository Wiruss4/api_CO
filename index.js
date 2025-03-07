// backend/index.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();

// ✅ Augmenter la taille maximale du body pour éviter l'erreur PayloadTooLargeError
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// ✅ Configuration CORS pour autoriser plusieurs origines
app.use(cors({
    origin: [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://bngrc-wirus3033s-projects.vercel.app",
        "https://api-bngrc.onrender.com"
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));




// ✅ Importation des routes
const commune = require('./routes/commune');
const district = require('./routes/district');
const fokontany = require('./routes/fokontany');
const region = require('./routes/region');
const site_hebergement = require('./routes/site_hebergement');
const population_data = require('./routes/population_data');
const localisationStats = require("./routes/localisationStats"); 

app.use('/api/commune', commune);
app.use('/api/district', district);
app.use('/api/fokontany', fokontany);
app.use('/api/region', region);
app.use('/api/site', site_hebergement);
app.use('/api/population', population_data);
app.use("/api/localisation-stats", localisationStats);

// ✅ Middleware pour gérer les erreurs
app.use((err, req, res, next) => {
    console.error("❌ Erreur détaillée :", err);

    // Vérifier si l'erreur vient d'un body trop large
    if (err.type === "entity.too.large") {
        return res.status(413).json({ error: "La requête est trop volumineuse. Réduisez la taille des données envoyées." });
    }

    res.status(500).json({ error: "Une erreur interne s'est produite.", details: err.message });
});

// ✅ Démarrer le serveur
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Serveur API démarré sur http://localhost:${PORT}`);
});
