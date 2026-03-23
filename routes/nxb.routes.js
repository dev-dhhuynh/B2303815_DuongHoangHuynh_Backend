const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/nxb.controller');
const authAdmin = require('../middleware/authAdmin');

router.get('/', ctrl.getAll);
router.post('/', authAdmin, ctrl.create);
router.put('/:id', authAdmin, ctrl.update);
router.delete('/:id', authAdmin, ctrl.delete);

module.exports = router;