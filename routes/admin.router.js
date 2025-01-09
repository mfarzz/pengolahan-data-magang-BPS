var express = require('express');
var router = express.Router();
const { approveUser, rejectUser, tampilUsers, detailUsers, tampilPendaftar, hapusUser, listBiodata,editBiodata,deleteBiodata, listTugas, tambahTugas, hapusTugas, editTugas, getTugasDetail } = require('../controllers/admin.controller');
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

router.get('/list-tugas', auth('admin'), listTugas);
router.post('/add-tugas/:userId', auth('admin'), tambahTugas);
router.get('/lihat-tugas/:tugasId', auth('admin'), getTugasDetail);
router.put('/edit-tugas/:tugasId', auth('admin'), editTugas);
router.delete('/delete-tugas/:tugasId', auth('admin'), hapusTugas);



module.exports = router;