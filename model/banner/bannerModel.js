var mongoose = require('mongoose');
module.exports = mongoose.model('bannerImgs',mongoose.Schema({
    desc:String,
    img:String,
    create_num:Number
}))