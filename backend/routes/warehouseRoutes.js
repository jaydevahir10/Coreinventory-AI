const router   = require('express').Router();
const Warehouse = require('../models/Warehouse');
const protect  = require('../middleware/authMiddleware');
router.get('/',    protect, async (req, res) => { res.json(await Warehouse.find()); });
router.post('/',   protect, async (req, res) => { res.status(201).json(await Warehouse.create(req.body)); });
router.delete('/:id', protect, async (req, res) => { await Warehouse.findByIdAndDelete(req.params.id); res.json({ msg: 'Deleted' }); });
module.exports = router;
