const multer = require('multer');
const path = require('path');

// 配置文件存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

// 文件过滤器
const fileFilter = (req, file, cb) => {
  // 只允许图片格式
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('只支持 JPG/PNG/GIF 格式的图片'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024  // 限制文件大小为 2MB
  }
});

const uploadController = {
  async uploadFile(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          code: 400,
          message: '请选择要上传的文件'
        });
      }

      const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      
      res.json({
        code: 0,
        message: '文件上传成功',
        data: fileUrl
      });
    } catch (error) {
      res.status(500).json({
        code: 500,
        message: '文件上传失败',
        error: error.message
      });
    }
  }
};

module.exports = {
  upload,
  uploadController
}; 