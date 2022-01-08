// 引入模块
const mongoose = require('mongoose');
// 连接
mongoose.connect('mongodb://localhost/webapp',{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
// 监听数据库连接是否成功
const conn = mongoose.connection;
conn.on('open',function(){
    console.log('数据库连接成功');
})
conn.on('error',function(){
    console.log('数据库连接失败');
})