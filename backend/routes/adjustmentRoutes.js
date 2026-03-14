const router  = require('express').Router();
const { createAdjustment } = require('../controllers/movementController');
const protect = require('../middleware/authMiddleware');
router.post('/', protect, createAdjustment);
module.exports = router;
