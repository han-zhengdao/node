const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// 创建订单（需要登录）
router.post('/', auth, orderController.create);

// 获取用户订单列表（需要登录）
router.get('/my-orders', auth, orderController.getUserOrders);

// 获取单个订单详情（需要登录）
router.get('/:id', auth, orderController.getOne);

// 更新订单状态（需要管理员权限）
router.put('/:id/status', [auth, admin], orderController.updateStatus);

// 取消订单（需要登录）
router.put('/:id/cancel', auth, orderController.cancel);

module.exports = router; 