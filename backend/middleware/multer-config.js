const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};
// enregistre les fichiers dans le dossier images
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },

  // fonction pour générer le nouveau nom du fichier à partir du nom d'origine
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});
// exportation du fichier unique image
module.exports = multer({ storage: storage }).single("image");
