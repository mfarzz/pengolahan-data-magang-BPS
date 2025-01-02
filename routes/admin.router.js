var express = require('express');
var router = express.Router();
const { approveUser, rejectUser } = require('../controllers/admin.controller');
const { auth } = require('../middlewares/auth.middleware');

router.put('/approve/:userId', approveUser, auth('admin'));
router.put('/reject/:userId', rejectUser, auth('admin'));

module.exports = router;