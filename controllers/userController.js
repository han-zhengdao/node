const User = require('../models/user');
const jwt = require('jsonwebtoken');

const userController = {
  // 注册
  async register(req, res) {
    try {
      const { username, email, password } = req.body;
      
      // 检查用户是否已存在
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        return res.status(400).json({ message: '用户名或邮箱已存在' });
      }

      // 创建新用户
      const user = new User({ username, email, password });
      await user.save();

      // 生成 token
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        message: '注册成功',
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      res.status(500).json({ message: '服务器错误', error: error.message });
    }
  },

  // 登录
  async login(req, res) {
    try {
      const { username, password } = req.body;
      
      // 查找用户
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ message: '用户名或密码错误' });
      }

      // 验证密码
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: '用户名或密码错误' });
      }

      // 生成 token
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: '登录成功',
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      res.status(500).json({ message: '服务器错误', error: error.message });
    }
  },

  // 获取用户信息
  async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.userId).select('-password');
      if (!user) {
        return res.status(404).json({ message: '用户不存在' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: '服务器错误', error: error.message });
    }
  }
};

module.exports = userController; 