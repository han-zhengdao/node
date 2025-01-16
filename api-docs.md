# DouMen商城 API 文档

## 基础信息

- 基础URL: `http://your-domain.com/api`
- 所有请求都需要在 header 中携带 token (除了登录接口)：
  ```
  Authorization: Bearer your-token
  ```
- 响应格式: JSON

## 错误码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未授权（未登录） |
| 403 | 禁止访问（无权限） |
| 404 | 资源不存在 |
| 500 | 服务器错误 |

## 接口详情

### 微信授权登录

#### 1. 获取授权URL
- 请求方式：`GET /wechat/auth-url`
- 请求参数：
  ```js
  {
    redirectUrl: string // 可选，授权后的回调地址
  }
  ```
- 响应示例：
  ```json
  {
    "url": "https://open.weixin.qq.com/..."
  }
  ```

#### 2. 处理授权回调
- 请求方式：`GET /wechat/callback`
- 请求参数：
  ```js
  {
    code: string // 微信授权码
  }
  ```
- 响应示例：
  ```json
  {
    "message": "登录成功",
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "user_id",
      "nickname": "微信昵称",
      "avatarUrl": "头像URL",
      "role": "user"
    }
  }
  ```

### 商品管理

#### 1. 获取商品列表
- 请求方式：`GET /products`
- 请求参数：
  ```js
  {
    page: number,       // 可选，默认1
    limit: number,      // 可选，默认10
    category: string,   // 可选，分类ID
    minPrice: number,   // 可选，最低价格
    maxPrice: number,   // 可选，最高价格
    search: string      // 可选，搜索关键词
  }
  ```
- 响应示例：
  ```json
  {
    "products": [{
      "id": "product_id",
      "name": "商品名称",
      "description": "商品描述",
      "price": 99.99,
      "category": {
        "id": "category_id",
        "name": "分类名称"
      },
      "stock": 100,
      "images": ["图片URL1", "图片URL2"],
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z"
    }],
    "currentPage": 1,
    "totalPages": 10,
    "totalProducts": 100
  }
  ```

#### 2. 获取单个商品
- 请求方式：`GET /products/:id`
- 响应示例：
  ```json
  {
    "id": "product_id",
    "name": "商品名称",
    "description": "商品描述",
    "price": 99.99,
    "category": {
      "id": "category_id",
      "name": "分类名称"
    },
    "stock": 100,
    "images": ["图片URL1", "图片URL2"],
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z"
  }
  ```

#### 3. 创建商品（需要管理员权限）
- 请求方式：`POST /products`
- 请求参数：
  ```json
  {
    "name": "商品名称",
    "description": "商品描述",
    "price": 99.99,
    "category": "category_id",
    "stock": 100,
    "images": ["图片URL1", "图片URL2"]
  }
  ```
- 响应示例：
  ```json
  {
    "message": "商品创建成功",
    "product": {
      "id": "product_id",
      "name": "商品名称",
      "description": "商品描述",
      "price": 99.99,
      "category": "category_id",
      "stock": 100,
      "images": ["图片URL1", "图片URL2"],
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  }
  ```

#### 4. 更新商品（需要管理员权限）
- 请求方式：`PUT /products/:id`
- 请求参数：
  ```json
  {
    "name": "商品名称",
    "description": "商品描述",
    "price": 99.99,
    "category": "category_id",
    "stock": 100,
    "images": ["图片URL1", "图片URL2"],
    "isActive": true
  }
  ```
- 响应示例：
  ```json
  {
    "message": "商品更新成功",
    "product": {
      "id": "product_id",
      "name": "商品名称",
      "description": "商品描述",
      "price": 99.99,
      "category": "category_id",
      "stock": 100,
      "images": ["图片URL1", "图片URL2"],
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  }
  ```

#### 5. 删除商品（需要管理员权限）
- 请求方式：`DELETE /products/:id`
- 响应示例：
  ```json
  {
    "message": "商品删除成功"
  }
  ```

### 分类管理

#### 1. 获取分类列表
- 请求方式：`GET /categories`
- 响应示例：
  ```json
  [
    {
      "id": "category_id",
      "name": "分类名称",
      "description": "分类描述",
      "image": "分类图片URL",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
  ```

#### 2. 获取单个分类
- 请求方式：`GET /categories/:id`
- 响应示例：
  ```json
  {
    "id": "category_id",
    "name": "分类名称",
    "description": "分类描述",
    "image": "分类图片URL",
    "createdAt": "2024-01-01T00:00:00Z"
  }
  ```

#### 3. 创建分类（需要管理员权限）
- 请求方式：`POST /categories`
- 请求参数：
  ```json
  {
    "name": "分类名称",
    "description": "分类描述",
    "image": "分类图片URL"
  }
  ```
- 响应示例：
  ```json
  {
    "message": "分类创建成功",
    "category": {
      "id": "category_id",
      "name": "分类名称",
      "description": "分类描述",
      "image": "分类图片URL",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  }
  ```

### 订单管理

#### 1. 创建订单
- 请求方式：`POST /orders`
- 请求参数：
  ```json
  {
    "items": [
      {
        "product": "product_id",
        "quantity": 2
      }
    ],
    "shippingAddress": {
      "address": "详细地址",
      "city": "城市",
      "postalCode": "邮编",
      "country": "国家"
    },
    "paymentMethod": "wechat"
  }
  ```
- 响应示例：
  ```json
  {
    "message": "订单创建成功",
    "order": {
      "id": "order_id",
      "items": [
        {
          "product": {
            "id": "product_id",
            "name": "商品名称",
            "price": 99.99
          },
          "quantity": 2,
          "price": 99.99
        }
      ],
      "totalAmount": 199.98,
      "status": "pending",
      "shippingAddress": {
        "address": "详细地址",
        "city": "城市",
        "postalCode": "邮编",
        "country": "国家"
      },
      "paymentMethod": "wechat",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  }
  ```

#### 2. 获取用户订单列表
- 请求方式：`GET /orders/my-orders`
- 请求参数：
  ```js
  {
    page: number,     // 可选，默认1
    limit: number,    // 可选，默认10
    status: string    // 可选，订单状态
  }
  ```
- 响应示例：
  ```json
  {
    "orders": [{
      "id": "order_id",
      "items": [...],
      "totalAmount": 199.98,
      "status": "pending",
      "createdAt": "2024-01-01T00:00:00Z"
    }],
    "currentPage": 1,
    "totalPages": 5,
    "totalOrders": 50
  }
  ```

#### 3. 获取订单详情
- 请求方式：`GET /orders/:id`
- 响应示例：
  ```json
  {
    "id": "order_id",
    "items": [...],
    "totalAmount": 199.98,
    "status": "pending",
    "shippingAddress": {...},
    "paymentMethod": "wechat",
    "createdAt": "2024-01-01T00:00:00Z"
  }
  ```

#### 4. 取消订单
- 请求方式：`PUT /orders/:id/cancel`
- 响应示例：
  ```json
  {
    "message": "订单取消成功",
    "order": {
      "id": "order_id",
      "status": "cancelled",
      ...
    }
  }
  ```

## 注意事项

1. 所有需要管理员权限的接口，请在请求头中携带有效的管理员 token
2. 订单状态包括：pending（待支付）、paid（已支付）、shipped（已发货）、delivered（已送达）、cancelled（已取消）
3. 图片上传接口待补充
4. 所有金额单位均为元
5. 时间格式均为 ISO 8601 标准 