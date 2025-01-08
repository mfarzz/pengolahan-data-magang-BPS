var express = require('express');
var router = express.Router();
const { approveUser, rejectUser, tampilUsers, detailUsers, tampilPendaftar, hapusUser, listBiodata,editBiodata,deleteBiodata } = require('../controllers/admin.controller');
const { auth } = require('../middlewares/auth.middleware');

router.put('/approve/:userId', auth('admin'), approveUser);
router.put('/reject/:userId', auth('admin'), rejectUser);
router.get('/list-users', auth('admin'), tampilUsers);
router.delete('/list-hapus/:userId', auth('admin'), hapusUser);
router.get('/list-pendaftar', auth('admin'), tampilPendaftar);
router.get('/list-biodata', auth('admin'), listBiodata);
router.get('/detail-users/:userId', auth('admin'), detailUsers);
router.put('/edit-biodata/:userId', auth('admin'), editBiodata);
router.delete('/delete-biodata/:userId', auth('admin'), deleteBiodata);

module.exports = router;