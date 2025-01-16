const Category = require('../models/category');

const categoryController = {
  // 创建分类
  async create(req, res) {
    try {
      const { name, description, image } = req.body;
      
      // 检查分类名是否已存在
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return res.status(400).json({ message: '分类名已存在' });
      }

      const category = new Category({ name, description, image });
      await category.save();

      res.status(201).json({
        message: '分类创建成功',
        category
      });
    } catch (error) {
      res.status(500).json({ message: '服务器错误', error: error.message });
    }
  },

  // 获取所有分类
  async getAll(req, res) {
    try {
      const categories = await Category.find();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: '服务器错误', error: error.message });
    }
  },

  // 获取单个分类
  async getOne(req, res) {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ message: '分类不存在' });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: '服务器错误', error: error.message });
    }
  },

  // 更新分类
  async update(req, res) {
    try {
      const { name, description, image } = req.body;
      
      // 如果要更新名称，检查新名称是否与其他分类重复
      if (name) {
        const existingCategory = await Category.findOne({ 
          name, 
          _id: { $ne: req.params.id } 
        });
        if (existingCategory) {
          return res.status(400).json({ message: '分类名已存在' });
        }
      }

      const category = await Category.findByIdAndUpdate(
        req.params.id,
        { name, description, image },
        { new: true }
      );

      if (!category) {
        return res.status(404).json({ message: '分类不存在' });
      }

      res.json({
        message: '分类更新成功',
        category
      });
    } catch (error) {
      res.status(500).json({ message: '服务器错误', error: error.message });
    }
  },

  // 删除分类
  async delete(req, res) {
    try {
      const category = await Category.findByIdAndDelete(req.params.id);
      if (!category) {
        return res.status(404).json({ message: '分类不存在' });
      }
      res.json({ message: '分类删除成功' });
    } catch (error) {
      res.status(500).json({ message: '服务器错误', error: error.message });
    }
  }
};

module.exports = categoryController; 