const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// 获取角色列表
router.get('/roles', auth, roleController.getRoles);

// 创建角色
router.post('/roles', [auth, admin], roleController.createRole);

// 更新角色
router.put('/roles/:id', [auth, admin], roleController.updateRole);

// 删除角色
router.delete('/roles/:id', [auth, admin], roleController.deleteRole);

// 获取权限列表
router.get('/permissions', auth, roleController.getPermissions);

module.exports = router; 