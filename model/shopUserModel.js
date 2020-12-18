const mongoose = require('mongoose');
module.exports = mongoose.model('shopUsers',mongoose.Schema({
    username:String,
    password:String,
    create_time:Number,
    user_avatar:String,
    enjoys_value:Number,
    white_credit:Number,
}))