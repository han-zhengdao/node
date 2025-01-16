const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// 创建分类（需要管理员权限）
router.post('/', [auth, admin], categoryController.create);

// 获取所有分类
router.get('/', categoryController.getAll);

// 获取单个分类
router.get('/:id', categoryController.getOne);

// 更新分类（需要管理员权限）
router.put('/:id', [auth, admin], categoryController.update);

// 删除分类（需要管理员权限）
router.delete('/:id', [auth, admin], categoryController.delete);

module.exports = router; 