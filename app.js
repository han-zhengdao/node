const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// 错误处理
process.on('uncaughtException', (err) => {
  console.error('未捕获的异常:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('未处理的 Promise 拒绝:', err);
});

// 中间件
app.use(cors());
app.use(express.json());

// 数据库连接
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB 连接成功'))
.catch(err => console.error('MongoDB 连接失败:', err));

// 路由
try {
  app.use('/api/users', require('./routes/user'));
  app.use('/api/products', require('./routes/product'));
  app.use('/api/categories', require('./routes/category'));
  app.use('/api/orders', require('./routes/order'));
  app.use('/api/wechat', require('./routes/wechatAuth'));
} catch (error) {
  console.error('路由加载错误:', error);
}

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '服务器错误', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
}); 