const mongoose = require('mongoose');
module.exports = mongoose.model('goods',mongoose.Schema({
    create_time:Number,
    name:String,
    desc:String,
    price:Number,
    cate:String,
    img:String,
    hot:Boolean,
    rank:Number,
}))