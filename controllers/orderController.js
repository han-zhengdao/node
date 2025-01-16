const Order = require('../models/order');
const Product = require('../models/product');

const orderController = {
  // 创建订单
  async create(req, res) {
    try {
      const { items, shippingAddress, paymentMethod } = req.body;
      
      // 计算总金额并检查库存
      let totalAmount = 0;
      for (let item of items) {
        const product = await Product.findById(item.product);
        if (!product) {
          return res.status(404).json({ message: `商品 ${item.product} 不存在` });
        }
        if (product.stock < item.quantity) {
          return res.status(400).json({ message: `商品 ${product.name} 库存不足` });
        }
        totalAmount += product.price * item.quantity;
        
        // 更新库存
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity }
        });
      }

      const order = new Order({
        user: req.user.userId,
        items: items.map(item => ({
          ...item,
          price: item.price
        })),
        totalAmount,
        shippingAddress,
        paymentMethod
      });

      await order.save();

      res.status(201).json({
        message: '订单创建成功',
        order
      });
    } catch (error) {
      res.status(500).json({ message: '服务器错误', error: error.message });
    }
  },

  // 获取用户订单列表
  async getUserOrders(req, res) {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const query = { user: req.user.userId };
      
      if (status) {
        query.status = status;
      }

      const skip = (page - 1) * limit;

      const [orders, total] = await Promise.all([
        Order.find(query)
          .populate('items.product', 'name images price')
          .skip(skip)
          .limit(Number(limit))
          .sort({ createdAt: -1 }),
        Order.countDocuments(query)
      ]);

      res.json({
        orders,
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalOrders: total
      });
    } catch (error) {
      res.status(500).json({ message: '服务器错误', error: error.message });
    }
  },

  // 获取单个订单详情
  async getOne(req, res) {
    try {
      const order = await Order.findById(req.params.id)
        .populate('items.product', 'name images price')
        .populate('user', 'username email');

      if (!order) {
        return res.status(404).json({ message: '订单不存在' });
      }

      // 检查权限（只有管理员或订单所有者可以查看）
      if (req.user.role !== 'admin' && order.user._id.toString() !== req.user.userId) {
        return res.status(403).json({ message: '没有权限查看此订单' });
      }

      res.json(order);
    } catch (error) {
      res.status(500).json({ message: '服务器错误', error: error.message });
    }
  },

  // 更新订单状态（管理员）
  async updateStatus(req, res) {
    try {
      const { status } = req.body;
      
      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      ).populate('items.product', 'name images price');

      if (!order) {
        return res.status(404).json({ message: '订单不存在' });
      }

      res.json({
        message: '订单状态更新成功',
        order
      });
    } catch (error) {
      res.status(500).json({ message: '服务器错误', error: error.message });
    }
  },

  // 取消订单
  async cancel(req, res) {
    try {
      const order = await Order.findById(req.params.id);
      
      if (!order) {
        return res.status(404).json({ message: '订单不存在' });
      }

      // 检查权限（只有订单所有者可以取消）
      if (order.user.toString() !== req.user.userId) {
        return res.status(403).json({ message: '没有权限取消此订单' });
      }

      // 检查订单是否可以取消
      if (order.status !== 'pending') {
        return res.status(400).json({ message: '只能取消待处理的订单' });
      }

      // 恢复库存
      for (let item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity }
        });
      }

      order.status = 'cancelled';
      await order.save();

      res.json({
        message: '订单取消成功',
        order
      });
    } catch (error) {
      res.status(500).json({ message: '服务器错误', error: error.message });
    }
  }
};

module.exports = orderController; 