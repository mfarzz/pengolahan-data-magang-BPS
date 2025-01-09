var express = require('express');
var router = express.Router();
const { sendOtp, resetPassword, addBiodata, tampilFormBiodata, editBiodata, listTugasMahasiswa, getTugasDetail,uploadTugas } = require('../controllers/users.controller')
const { auth } = require('../middlewares/auth.middleware');
const { upload } = require('../middlewares/multer.middleware');

router.post('/send-otp', auth('user'), sendOtp)
router.post('/reset-password', auth('user'), resetPassword)

router.get('/form-biodata', auth('user'), tampilFormBiodata)
router.post('/add-biodata', auth('user'), upload.single('foto'), addBiodata)
router.put('/edit-biodata/:userId', auth('user'), editBiodata);

router.get('/daftar-tugas', auth('user'), listTugasMahasiswa);
router.get('/detail-tugas/:tugasId', auth('user'), getTugasDetail);
router.post('/upload-tugas/:tugasId', auth('user'), upload.single('dokumen'), uploadTugas);

//MANAGEMENT TUGAS by user DONE
module.exports = router;