const router  = require('express').Router();
const { createTransfer, getTransfers } = require('../controllers/movementController');
const protect = require('../middleware/authMiddleware');
router.get('/',  protect, getTransfers);
router.post('/', protect, createTransfer);
module.exports = router;
