//
require("dotenv").config();

const express = require("express");
// protège l'application de certaines vulnérabilités en configurant certains en-têtes HTTP
const helmet = require("helmet");
const mongoose = require("mongoose");
// le package path me permet d'accédez au path de mon serveur
const path = require("path");
const saucesRoutes = require("./routes/sauces");
const userSauces = require("./routes/user");

// mongoose.connect me permet de me connecter à ma base de données mongoDb
mongoose
  .connect(process.env.MONGO_DB_CREDENTIALS, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();

app.use((req, res, next) => {
  // accédez à notre API depuis n'importe quelle origine
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Ajouter les headers mentionnés aux requêtes envoyées vers notre API
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );

  // envoyer des requêtes avec les méthodes mentionnées
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
// express.json permet de lire le corps de la requête
app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/sauces", saucesRoutes);
app.use("/api/auth", userSauces);
app.use(helmet());

module.exports = app;
