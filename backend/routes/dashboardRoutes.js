const router  = require('express').Router();
const { getStats, getAlerts } = require('../controllers/dashboardController');
const protect = require('../middleware/authMiddleware');
router.get('/stats',  protect, getStats);
router.get('/alerts', protect, getAlerts);
module.exports = router;
