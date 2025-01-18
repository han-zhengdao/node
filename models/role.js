const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  permissions: [{
    type: String,
    required: true
  }],
  isSystem: {
    type: Boolean,
    default: false  // 系统内置角色标记，如 admin
  },
  createTime: {
    type: Date,
    default: Date.now
  }
});

const Role = mongoose.model('Role', roleSchema);
module.exports = Role; 