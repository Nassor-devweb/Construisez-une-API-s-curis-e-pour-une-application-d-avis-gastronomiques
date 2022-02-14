const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': '.jpg',
  'image/jpeg': '.jpeg',
  'image/png': '.png'
};

// Stockages des images
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  // Nom du fichier images
  filename: (req, file, callback) => {
    const extension = MIME_TYPES[file.mimetype];
    const name = file.originalname.split(extension).join('_');
    callback(null, name + Date.now() + extension);
  }
});

module.exports = multer({storage: storage}).single('image');