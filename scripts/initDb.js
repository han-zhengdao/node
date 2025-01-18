const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Category = require('../models/category');
const Product = require('../models/product');
const Role = require('../models/role');

// 连接数据库
mongoose.connect('mongodb://127.0.0.1:27017/doumen', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// 初始化管理员账户
const initAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const admin = new User({
        username: 'admin',
        password: 'admin123',
        email: 'admin@example.com',
        role: 'admin'
      });
      await admin.save();
      console.log('管理员账户创建成功');
    }
  } catch (error) {
    console.error('创建管理员账户失败:', error);
  }
};

// 初始化示例分类
const initCategories = async () => {
  try {
    const categories = [
      {
        name: '手机数码',
        description: '手机、平板电脑等数码产品',
        image: 'https://example.com/images/digital.jpg'
      },
      {
        name: '服装服饰',
        description: '男装、女装、童装等服装类产品',
        image: 'https://example.com/images/clothing.jpg'
      },
      {
        name: '食品生鲜',
        description: '零食、生鲜、饮料等食品',
        image: 'https://example.com/images/food.jpg'
      }
    ];

    for (const category of categories) {
      const exists = await Category.findOne({ name: category.name });
      if (!exists) {
        await Category.create(category);
      }
    }
    console.log('示例分类创建成功');
  } catch (error) {
    console.error('创建示例分类失败:', error);
  }
};

// 初始化示例商品
const initProducts = async () => {
  try {
    const categories = await Category.find();
    const products = [
      {
        name: 'iPhone 15',
        description: '最新款iPhone手机',
        price: 6999,
        category: categories[0]._id,
        stock: 100,
        images: ['https://example.com/images/iphone15-1.jpg'],
        isActive: true
      },
      {
        name: '男士休闲夹克',
        description: '舒适休闲的男士夹克外套',
        price: 299,
        category: categories[1]._id,
        stock: 200,
        images: ['https://example.com/images/jacket-1.jpg'],
        isActive: true
      },
      {
        name: '进口巧克力',
        description: '比利时进口巧克力礼盒',
        price: 99,
        category: categories[2]._id,
        stock: 500,
        images: ['https://example.com/images/chocolate-1.jpg'],
        isActive: true
      }
    ];

    for (const product of products) {
      const exists = await Product.findOne({ name: product.name });
      if (!exists) {
        await Product.create(product);
      }
    }
    console.log('示例商品创建成功');
  } catch (error) {
    console.error('创建示例商品失败:', error);
  }
};

// 初始化管理员角色
const initAdminRole = async () => {
  try {
    const adminRole = await Role.findOne({ name: 'admin' });
    if (!adminRole) {
      await Role.create({
        name: 'admin',
        description: '系统管理员',
        permissions: ['*'],  // 所有权限
        isSystem: true
      });
      console.log('管理员角色创建成功');
    }
  } catch (error) {
    console.error('创建管理员角色失败:', error);
  }
};

// 运行初始化
const initDb = async () => {
  try {
    await initAdminRole();
    await initAdmin();
    await initCategories();
    await initProducts();
    console.log('数据库初始化完成');
    process.exit(0);
  } catch (error) {
    console.error('数据库初始化失败:', error);
    process.exit(1);
  }
};

initDb(); 