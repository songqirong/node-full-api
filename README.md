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