const express = require('express');
const router = express.Router();
const { upload, uploadController } = require('../controllers/uploadController');
const auth = require('../middleware/auth');

// 文件上传接口
router.post('/', auth, upload.single('file'), uploadController.uploadFile);

module.exports = router; 