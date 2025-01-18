const User = require('../models/user');
const Role = require('../models/role');

const adminController = {
  // 获取用户列表
  async getUserList(req, res) {
    try {
      const { keyword = '', pageIndex = 1, pageSize = 10 } = req.query;
      
      const query = {};
      if (keyword) {
        query.$or = [
          { username: { $regex: keyword, $options: 'i' } },
          { nickname: { $regex: keyword, $options: 'i' } }
        ];
      }

      const skip = (pageIndex - 1) * pageSize;

      const [users, total] = await Promise.all([
        User.find(query)
          .select('-password')
          .skip(skip)
          .limit(Number(pageSize))
          .sort({ createTime: -1 }),
        User.countDocuments(query)
      ]);

      res.json({
        code: 0,
        message: '获取成功',
        data: {
          list: users.map(user => ({
            id: user._id,
            username: user.username,
            nickname: user.nickname || user.username,
            avatar: user.avatar || '',
            role: user.role,
            createTime: user.createTime
          })),
          total
        }
      });
    } catch (error) {
      res.status(500).json({
        code: 500,
        message: '服务器错误',
        error: error.message
      });
    }
  },

  // 创建用户
  async createUser(req, res) {
    try {
      const { username, password, roleId, nickname } = req.body;

      // 参数验证
      if (!username || !password || !roleId) {
        return res.status(400).json({
          code: 400,
          message: '用户名、密码和角色为必填项'
        });
      }

      // 验证角色是否存在
      const role = await Role.findById(roleId);
      if (!role) {
        return res.status(400).json({
          code: 400,
          message: '选择的角色不存在'
        });
      }

      // 检查用户名是否已存在
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({
          code: 400,
          message: '用户名已存在'
        });
      }

      // 创建新用户
      const user = new User({
        username,
        password,
        role: role.name, // 使用角色名称
        nickname: nickname || username
      });

      await user.save();

      res.json({
        code: 0,
        message: '用户创建成功',
        data: {
          id: user._id,
          username: user.username,
          nickname: user.nickname,
          role: user.role
        }
      });
    } catch (error) {
      console.error('创建用户错误:', error);
      res.status(500).json({
        code: 500,
        message: '服务器错误',
        error: error.message
      });
    }
  },

  // 更新用户
  async updateUser(req, res) {
    try {
      const { nickname, avatar, role, password } = req.body;
      const userId = req.params.id;

      // 检查用户是否存在
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          code: 404,
          message: '用户不存在'
        });
      }

      // 不允许修改 admin 用户
      if (user.role === 'admin') {
        return res.status(403).json({
          code: 403,
          message: '不能修改管理员用户'
        });
      }

      // 构建更新对象
      const updateData = {};
      if (nickname) updateData.nickname = nickname;
      if (avatar) updateData.avatar = avatar;
      if (role) updateData.role = role;
      if (password) updateData.password = password;

      await User.findByIdAndUpdate(userId, updateData);

      res.json({
        code: 0,
        message: '用户更新成功'
      });
    } catch (error) {
      res.status(500).json({
        code: 500,
        message: '服务器错误',
        error: error.message
      });
    }
  },

  // 删除用户
  async deleteUser(req, res) {
    try {
      const userId = req.params.id;

      // 检查用户是否存在
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          code: 404,
          message: '用户不存在'
        });
      }

      // 不允许删除 admin 用户
      if (user.role === 'admin') {
        return res.status(403).json({
          code: 403,
          message: '不能删除管理员用户'
        });
      }

      await User.findByIdAndDelete(userId);

      res.json({
        code: 0,
        message: '用户删除成功'
      });
    } catch (error) {
      res.status(500).json({
        code: 500,
        message: '服务器错误',
        error: error.message
      });
    }
  },

  // 获取角色列表
  async getRoleList(req, res) {
    try {
      const roles = await Role.find({}, 'name description');
      res.json({
        code: 0,
        message: '获取成功',
        data: roles.map(role => ({
          id: role._id,
          name: role.name,
          description: role.description
        }))
      });
    } catch (error) {
      res.status(500).json({
        code: 500,
        message: '服务器错误',
        error: error.message
      });
    }
  }
};

module.exports = adminController; 