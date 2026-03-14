const router  = require('express').Router();
const { createDelivery, validateDelivery, getDeliveries } = require('../controllers/movementController');
const protect = require('../middleware/authMiddleware');
router.get('/',             protect, getDeliveries);
router.post('/',            protect, createDelivery);
router.put('/:id/validate', protect, validateDelivery);
module.exports = router;
