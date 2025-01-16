const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// 注册
router.post('/register', userController.register);

// 登录
router.post('/login', userController.login);

// 获取用户信息（需要认证）
router.get('/profile', auth, userController.getProfile);

module.exports = router; 