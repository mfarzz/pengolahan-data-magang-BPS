var express = require('express');
var router = express.Router();
const { login, refreshAccessToken, registerUser } = require('../controllers/auth.controller');

router.post('/login', login);
router.post('/refresh', refreshAccessToken);
router.post('/register', registerUser);

module.exports = router;
