const Product = require('../models/product');

const productController = {
  // 创建商品
  async create(req, res) {
    try {
      const { name, description, price, category, stock, images } = req.body;
      
      const product = new Product({
        name,
        description,
        price,
        category,
        stock,
        images
      });
      
      await product.save();
      
      res.status(201).json({
        message: '商品创建成功',
        product
      });
    } catch (error) {
      res.status(500).json({ message: '服务器错误', error: error.message });
    }
  },

  // 获取所有商品（支持分页和筛选）
  async getAll(req, res) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        category, 
        minPrice, 
        maxPrice,
        search 
      } = req.query;

      // 构建查询条件
      const query = {};
      if (category) query.category = category;
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      const skip = (page - 1) * limit;

      const [products, total] = await Promise.all([
        Product.find(query)
          .populate('category', 'name')
          .skip(skip)
          .limit(Number(limit))
          .sort({ createdAt: -1 }),
        Product.countDocuments(query)
      ]);

      res.json({
        products,
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalProducts: total
      });
    } catch (error) {
      res.status(500).json({ message: '服务器错误', error: error.message });
    }
  },

  // 获取单个商品
  async getOne(req, res) {
    try {
      const product = await Product.findById(req.params.id)
        .populate('category', 'name');
      
      if (!product) {
        return res.status(404).json({ message: '商品不存在' });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: '服务器错误', error: error.message });
    }
  },

  // 更新商品
  async update(req, res) {
    try {
      const { name, description, price, category, stock, images, isActive } = req.body;
      
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
          name,
          description,
          price,
          category,
          stock,
          images,
          isActive
        },
        { new: true }
      ).populate('category', 'name');

      if (!product) {
        return res.status(404).json({ message: '商品不存在' });
      }

      res.json({
        message: '商品更新成功',
        product
      });
    } catch (error) {
      res.status(500).json({ message: '服务器错误', error: error.message });
    }
  },

  // 删除商品
  async delete(req, res) {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      
      if (!product) {
        return res.status(404).json({ message: '商品不存在' });
      }
      
      res.json({ message: '商品删除成功' });
    } catch (error) {
      res.status(500).json({ message: '服务器错误', error: error.message });
    }
  }
};

module.exports = productController; 