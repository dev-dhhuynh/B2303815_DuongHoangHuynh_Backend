const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/muon.controller');
const authUser = require('../middleware/authUser');
const authAdmin = require('../middleware/authAdmin');
const jwt = require('jsonwebtoken');

router.get('/stats', ctrl.getStats);
router.post('/', authUser, ctrl.requestBorrow);
router.get('/me', authUser, ctrl.getByUser);
router.get('/pending', authAdmin, ctrl.listPending);
router.get('/approved', authAdmin, ctrl.listApproved);
router.get('/', authAdmin, ctrl.getAll);
router.put('/approve/:id', authAdmin, ctrl.approveBorrow);
router.put('/reject/:id', authAdmin, ctrl.rejectRequest);
router.put('/return/:id', async (req, res, next) => {
  const token = (req.headers.authorization || '').split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req._caller = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}, async (req, res) => {
  const MuonSach = require('../models/MuonSach');
  const id = req.params.id;
  try {
    const rec = await MuonSach.findById(id);
    if (!rec) return res.status(404).json({ message: 'Not found' });

    if (req._caller.role === 'user' && String(rec.MaDocGia) !== String(req._caller.id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    return require('../controllers/muon.controller').markReturned(req, res);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', authAdmin, ctrl.deleteRecord);

module.exports = router;