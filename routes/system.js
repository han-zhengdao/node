const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const roleController = require('../controllers/roleController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// 用户管理
router.get('/user', [auth, admin], adminController.getUserList);     // 修改路径
router.post('/user', [auth, admin], adminController.createUser);     
router.put('/user/:id', [auth, admin], adminController.updateUser);  
router.delete('/user/:id', [auth, admin], adminController.deleteUser);

// 角色管理
router.get('/roles', [auth, admin], roleController.getRoles);        
router.post('/roles', [auth, admin], roleController.createRole);     
router.put('/roles/:id', [auth, admin], roleController.updateRole);  
router.delete('/roles/:id', [auth, admin], roleController.deleteRole);

// 权限列表
router.get('/permissions', auth, roleController.getPermissions);

// 获取角色列表（用于创建用户时选择）
router.get('/roles/list', auth, adminController.getRoleList);

module.exports = router; 