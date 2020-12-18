const mongoose  = require('mongoose');

module.exports = mongoose.model('addresses', mongoose.Schema({
  user_id: Object,  // 用户_id
  name: String, // 收货人姓名
  tel: Number, // 收货人手机号
  addressDetail: String, // 收货地址
  isDefault: Boolean, // 是否为默认地址
  postalCode: String, // 邮政编码
  areaCode: Number, // 区级编号
  create_time: Number, //创建时间
  city: String, // 区县
  county: String, // 市
  province: String, // 省
  country: String, // 国家
}))