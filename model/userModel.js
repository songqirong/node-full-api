const mongoose = require('mongoose');
module.exports = mongoose.model('users',mongoose.Schema({
    username:String,
    password:String,
    create_time:Number,
    user_avatar:String,
}))