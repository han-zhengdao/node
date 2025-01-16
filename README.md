# DouMen商城后端服务

## 项目说明
DouMen商城的后端API服务，基于Node.js + Express + MongoDB开发。

## 技术栈
- Node.js
- Express
- MongoDB
- JWT认证
- 微信公众号登录

## 安装和运行
1. 安装依赖
```bash
npm install
```

2. 配置环境变量
复制 `.env.example` 文件为 `.env` 并修改配置：
```bash
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/doumen
JWT_SECRET=your_jwt_secret_key
WECHAT_APPID=your_wechat_appid
WECHAT_SECRET=your_wechat_secret
FRONTEND_URL=http://your-frontend-url
```

3. 初始化数据库
```bash
npm run init-db
```

4. 启动服务
```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

## API文档
详见 [api-docs.md](api-docs.md)

## 测试账号
- 管理员账号：admin
- 管理员密码：admin123 