const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// 创建商品（需要管理员权限）
router.post('/', [auth, admin], productController.create);

// 获取所有商品
router.get('/', productController.getAll);

// 获取单个商品
router.get('/:id', productController.getOne);

// 更新商品（需要管理员权限）
router.put('/:id', [auth, admin], productController.update);

// 删除商品（需要管理员权限）
router.delete('/:id', [auth, admin], productController.delete);

module.exports = router; 