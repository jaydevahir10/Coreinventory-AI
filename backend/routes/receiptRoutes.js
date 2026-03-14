const router  = require('express').Router();
const { createReceipt, validateReceipt, getReceipts } = require('../controllers/movementController');
const protect = require('../middleware/authMiddleware');
router.get('/',              protect, getReceipts);
router.post('/',             protect, createReceipt);
router.put('/:id/validate',  protect, validateReceipt);
module.exports = router;
