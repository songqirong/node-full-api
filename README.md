# 项目创建

cnpm install express-generator -g
express --view=ejs node-full-api
cd node-full-api
cnpm install
npm start

# 项目解读

用 nodemon 启动项目，因为我需要热更新的功能
入口文件是 /bin/www

这个项目是一个前后端不分离的项目 MVC
    M - model 与数据库打交道、增删改查
    V - view 是EJS模板引擎
    C - controler 控制器，就是 routes路由

# 数据库连接

mongodb 官方(MongoDB官方提供的)
mongoose （用这个） 

**解析上传图片插件**（multiparty,formidable）

1、*var form = new multiparty.Form()*

2、*var form = new formidable.IncomingForm();*



# socket.io (聊天室)

cnpm install socket.io -S
```
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

io.on('connection', (socket) => {
  console.log('a user connected');
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
```

cnpm install socket.io-client -S
```
this.socket = io('http://10.36.135.68:9999')
this.socket.on('connect', function() {
    console.log('socket连接成功')
})
// 接受服务器发来的聊天消息
this.socket.on('client', msg=> {
    console.log('msg', msg)
    this.charArr.push({
        id: Date.now(),
        msg
    })
})
```
