var express = require('express');
var router = express.Router();
const { login, refreshAccessToken } = require('../controllers/auth.controller');

router.post('/login', login);
router.post('/refresh', refreshAccessToken);

module.exports = router;
