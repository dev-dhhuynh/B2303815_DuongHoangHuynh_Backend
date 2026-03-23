const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/docgia.controller');
const authAdmin = require('../middleware/authAdmin');
const authUser = require('../middleware/authUser');

router.get('/', authAdmin, ctrl.getAll);
router.get('/:id', authAdmin, ctrl.getOne);
router.put('/:id', authAdmin, ctrl.update);
router.delete('/:id', authAdmin, ctrl.delete);

router.put('/me/update', authUser, ctrl.updateSelf);

module.exports = router;