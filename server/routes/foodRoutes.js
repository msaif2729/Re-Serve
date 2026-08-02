const express = require('express');
const router = express.Router();
const { createFoodListing, getFoodListings, getFoodById } = require('../controllers/foodController');
const { authMiddleware } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getFoodListings);
router.get('/:id', getFoodById);
router.post('/', authMiddleware, createFoodListing);

// File Upload Route (Device photos)
router.post('/upload', upload.single('food_image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }
    const host = req.get('host');
    const protocol = req.protocol;
    const imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
    res.status(200).json({
      success: true,
      imageUrl,
      filename: req.file.filename,
      message: 'Image uploaded successfully from device'
    });
  } catch (err) {
    res.status(500).json({ message: 'File upload failed: ' + err.message });
  }
});

module.exports = router;
