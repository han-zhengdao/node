const express = require('express');
const router = express.Router();
const wechatAuthController = require('../controllers/wechatAuthController');

// 获取授权URL
router.get('/auth-url', wechatAuthController.getAuthUrl);

// 处理授权回调
router.get('/callback', wechatAuthController.handleCallback);

module.exports = router; 