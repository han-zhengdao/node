const User = require('../models/user');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const WechatOAuth = require('wechat-oauth');

// 创建微信 OAuth 客户端
const client = new WechatOAuth(
  process.env.WECHAT_APPID,
  process.env.WECHAT_SECRET
);

const wechatAuthController = {
  // 获取网页授权URL
  async getAuthUrl(req, res) {
    try {
      const { redirectUrl } = req.query;
      const url = client.getAuthorizeURL(
        redirectUrl || `${process.env.FRONTEND_URL}/auth-callback`,
        'state',
        'snsapi_userinfo'  // 使用snsapi_userinfo可以获取用户基本信息
      );
      res.json({ url });
    } catch (error) {
      res.status(500).json({ message: '服务器错误', error: error.message });
    }
  },

  // 处理授权回调
  async handleCallback(req, res) {
    try {
      const { code } = req.query;
      
      // 通过code获取access_token和openid
      const token = await client.getAccessToken(code);
      const { data: { openid } } = token;
      
      // 获取用户信息
      const userInfo = await client.getUser(openid);

      // 查找或创建用户
      let user = await User.findOne({ 'wechat.openid': openid });
      
      if (!user) {
        // 创建新用户
        user = new User({
          wechat: {
            openid,
            nickname: userInfo.nickname,
            avatarUrl: userInfo.headimgurl
          }
        });
        await user.save();
      } else {
        // 更新用户信息
        user.wechat.nickname = userInfo.nickname;
        user.wechat.avatarUrl = userInfo.headimgurl;
        await user.save();
      }

      // 生成 JWT token
      const jwtToken = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );

      res.json({
        message: '登录成功',
        token: jwtToken,
        user: {
          id: user._id,
          nickname: user.wechat.nickname,
          avatarUrl: user.wechat.avatarUrl,
          role: user.role
        }
      });
    } catch (error) {
      res.status(500).json({ message: '服务器错误', error: error.message });
    }
  }
};

module.exports = wechatAuthController; 