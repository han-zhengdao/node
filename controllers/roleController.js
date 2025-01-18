const Role = require('../models/role');
const User = require('../models/user');

const roleController = {
  // 获取角色列表
  async getRoles(req, res) {
    try {
      const { keyword = '', pageIndex = 1, pageSize = 10 } = req.query;
      
      const query = {};
      if (keyword) {
        query.name = { $regex: keyword, $options: 'i' };
      }

      const skip = (pageIndex - 1) * pageSize;

      const [roles, total] = await Promise.all([
        Role.find(query)
          .skip(skip)
          .limit(Number(pageSize))
          .sort({ createTime: -1 }),
        Role.countDocuments(query)
      ]);

      res.json({
        code: 0,
        message: '获取成功',
        data: {
          list: roles.map(role => ({
            id: role._id,
            name: role.name,
            description: role.description,
            permissions: role.permissions,
            createTime: role.createTime
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

  // 创建角色
  async createRole(req, res) {
    try {
      const { name, description, permissions } = req.body;

      // 验证权限列表不为空
      if (!permissions || permissions.length === 0) {
        return res.status(400).json({
          code: 400,
          message: '权限列表不能为空'
        });
      }

      // 检查角色名是否已存在
      const existingRole = await Role.findOne({ name });
      if (existingRole) {
        return res.status(400).json({
          code: 400,
          message: '角色名称已存在'
        });
      }

      const role = new Role({
        name,
        description,
        permissions
      });

      await role.save();

      res.json({
        code: 0,
        message: '角色创建成功'
      });
    } catch (error) {
      res.status(500).json({
        code: 500,
        message: '服务器错误',
        error: error.message
      });
    }
  },

  // 更新角色
  async updateRole(req, res) {
    try {
      const { name, description, permissions } = req.body;
      const roleId = req.params.id;

      // 检查角色是否存在
      const role = await Role.findById(roleId);
      if (!role) {
        return res.status(404).json({
          code: 404,
          message: '角色不存在'
        });
      }

      // 检查是否是系统角色
      if (role.isSystem) {
        return res.status(403).json({
          code: 403,
          message: '系统角色不允许修改'
        });
      }

      // 检查新角色名是否与其他角色重复
      if (name !== role.name) {
        const existingRole = await Role.findOne({ 
          name, 
          _id: { $ne: roleId } 
        });
        if (existingRole) {
          return res.status(400).json({
            code: 400,
            message: '角色名称已存在'
          });
        }
      }

      // 使用新对象进行更新，避免引用问题
      const updatedRole = await Role.findByIdAndUpdate(
        roleId,
        {
          name,
          description,
          permissions: [...permissions] // 创建新数组
        },
        { new: true }
      );

      res.json({
        code: 0,
        message: '角色更新成功',
        data: {
          id: updatedRole._id,
          name: updatedRole.name,
          description: updatedRole.description,
          permissions: updatedRole.permissions
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

  // 删除角色
  async deleteRole(req, res) {
    try {
      const roleId = req.params.id;

      // 检查是否是系统角色
      const role = await Role.findById(roleId);
      if (!role) {
        return res.status(404).json({
          code: 404,
          message: '角色不存在'
        });
      }

      if (role.isSystem) {
        return res.status(403).json({
          code: 403,
          message: '系统角色不允许删除'
        });
      }

      // 检查是否有用户使用该角色
      const usersWithRole = await User.findOne({ role: roleId });
      if (usersWithRole) {
        return res.status(400).json({
          code: 400,
          message: '该角色正在使用中，无法删除'
        });
      }

      await Role.findByIdAndDelete(roleId);

      res.json({
        code: 0,
        message: '角色删除成功'
      });
    } catch (error) {
      res.status(500).json({
        code: 500,
        message: '服务器错误',
        error: error.message
      });
    }
  },

  // 获取权限列表
  async getPermissions(req, res) {
    try {
      // 这里可以根据实际需求从配置文件或数据库中获取权限列表
      const permissions = [
        'user:view',
        'user:create',
        'user:edit',
        'user:delete',
        'role:view',
        'role:create',
        'role:edit',
        'role:delete',
        'product:view',
        'product:create',
        'product:edit',
        'product:delete',
        'order:view',
        'order:create',
        'order:edit',
        'order:delete'
      ];

      res.json({
        code: 0,
        message: '获取成功',
        data: permissions
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

module.exports = roleController; 