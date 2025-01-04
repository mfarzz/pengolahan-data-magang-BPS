var express = require('express');
var router = express.Router();
const { login, refreshAccessToken, registerUser, logout } = require('../controllers/auth.controller');
const { auth } = require('../middlewares/auth.middleware');

router.post('/login', login);
router.post('/refresh', refreshAccessToken);
router.post('/register', registerUser);
router.post('/logout', logout);

module.exports = router;
