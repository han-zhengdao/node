const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// 创建用户的请求体验证
const validateCreateUser = (req, res, next) => {
  const { username, password, role } = req.body;
  
  // 检查必填字段
  if (!username || !password || !role) {
    return res.status(400).json({
      code: 400,
      message: '用户名、密码和角色为必填项'
    });
  }

  // 验证用户名长度
  if (username.length < 4) {
    return res.status(400).json({
      code: 400,
      message: '用户名最少4个字符'
    });
  }

  // 验证密码长度
  if (password.length < 6) {
    return res.status(400).json({
      code: 400,
      message: '密码最少6个字符'
    });
  }

  // 验证角色
  if (!['admin', 'user'].includes(role)) {
    return res.status(400).json({
      code: 400,
      message: '无效的角色类型'
    });
  }

  next();
};

// 获取用户列表
router.get('/users', [auth, admin], adminController.getUserList);

// 创建用户
router.post('/users', [auth, admin, validateCreateUser], adminController.createUser);

// 更新用户
router.put('/users/:id', [auth, admin], adminController.updateUser);

// 删除用户
router.delete('/users/:id', [auth, admin], adminController.deleteUser);

// 重置用户密码
router.post('/users/:id/reset-password', [auth, admin], adminController.resetPassword);

module.exports = router; 