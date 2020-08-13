var express = require('express');
var router = express.Router();
var userModel = require('../model/userModel');
var shopUserModel = require('../model/shopUserModel');
const {fetchjwt} = require('../utils/jwt');

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });


// cms
router.post('/cms/regist',function(req,res,next){
  let {username,password,password2}=req.body;

  userModel.find({username}).then(arr=>{
    if(arr.length>0){
      res.json({
        success:true,
        data:{
          err:-1, 
          msg:'此用户名已被注册'
        }
      })
    }else{
      // console.log('发送成功')
      userModel.insertMany([{username,password,create_time:Date.now()}]).then(arr=>{
        res.json({
          success:true,
            data:{
              err:0, 
              msg:'注册成功'
            }
        })
      })
    }
  })
})
router.get('/cms/all', function(req, res, next) {
  // 查询数据库
  userModel.find({}).then(arr=>{
    // console.log('user arr', arr)
    let data = {
      success:true,
        data:{
          err:0,
          msg:'success', 
          data:arr
        }
    }
    res.json(data)
  })
})
router.post('/cms/login',function(req,res,next){
  let {username,password} = req.body;
  userModel.find({username,password}).then(arr=>{
    // console.log(arr);
    if(arr.length>0){
      let token = fetchjwt({username,password});
      // console.log(token)
      let data = {
        success:true,
        data:{
          err:0, 
          token,
          msg:'登录成功'
        }
        
      }
      res.json(data)
    }else{
      userModel.find({username}).then(arr=>{
        // console.log(arr)
        let data = {
          success:true,
            data:{
              err:-1, 
            }
        }
        data.data.msg = arr.length > 0 ? "用户密码错误" : "用户名错误";
        res.json(data);
      })
    }
    
  })
})

// shop
router.post('/shop/regist',function(req,res,next){
  let {username,password,password2}=req.body;

  shopUserModel.find({username}).then(arr=>{
    if(arr.length>0){
      res.json({
        success:true,
        data:{
          err:-1, 
          msg:'此用户名已被注册'
        }
      })
    }else{
      // console.log('发送成功')
      shopUserModel.insertMany([{username,password,create_time:Date.now()}]).then(arr=>{
        res.json({
          success:true,
            data:{
              err:0, 
              msg:'注册成功'
            }
        })
      })
    }
  })
})
router.get('/shop/all', function(req, res, next) {
  // 查询数据库
  shopUserModel.find({}).then(arr=>{
    // console.log('user arr', arr)
    let data = {
      success:true,
        data:{
          err:0,
          msg:'success', 
          data:arr
        }
    }
    res.json(data)
  })
})
router.post('/shop/login',function(req,res,next){
  let {username,password} = req.body;
  shopUserModel.find({username,password}).then(arr=>{
    // console.log(arr);
    if(arr.length>0){
      let token = fetchjwt({username,password});
      // console.log(token)
      let data = {
        success:true,
        data:{
          err:0, 
          token,
          msg:'登录成功'
        }
        
      }
      res.json(data)
    }else{
      userModel.find({username}).then(arr=>{
        // console.log(arr)
        let data = {
          success:true,
            data:{
              err:-1, 
            }
        }
        data.data.msg = arr.length > 0 ? "用户密码错误" : "用户名错误";
        res.json(data);
      })
    }
    
  })
})
module.exports = router;
