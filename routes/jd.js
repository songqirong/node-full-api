var express = require('express');
var router = express.Router();
var jwt = require('../utils/jwt');
var shopUserModel = require('../model/shopUserModel');
var cartModel = require('../model/webapp/cartModel');
// var orderModel = require('../model/webapp/orderModel');
var addressModel = require('../model/webapp/addressModel');
var goodModel = require('../model/goodModel');
var bannerModel = require('../model/banner/bannerModel');
// const { delete } = require('./upload');
router.post('/cms/createBanner',function(req,res,next){
  let {id,img,desc}=req.body
  console.log(id,img,desc)
  let ele = {
    img,
    desc,
  }
  if(!id){
    ele.create_time=Date.now()
    bannerModel.insertMany([ele]).then(arr=>{
      res.json({
        success:true,
        data:{
          err:0,
          msg:"上传成功"
        }
      })
    })
  }else{
    bannerModel.updateOne({_id:id},{$set:ele}).then(arr=>{
      res.json({
        success:true,
        data:{
          err:0,
          msg:"修改成功"
        }
      })
    })
  }
  
})
router.get('/cms/getBanner',function(req,res,next){
  let {id,page,limit} =req.query;
  if(id=="") delete id;
  page=page?page:1;
  if(!id){
    bannerModel.find({}).then(arr=>{
      if(limit){
        bannerModel.find({}).skip((page-1)*limit).limit(Number(limit)).then(arr1=>{
          res.json({
            success:true,
            data:{
              total:arr.length,
              err:0,
              msg:"获取成功",
              data:arr1
            }
          })
        })
      }else{
        res.json({
          success:true,
          data:{
            total:arr.length,
            err:0,
            msg:"获取成功",
            data:arr
          }
        })
      }  
    })
  }else{
    bannerModel.find({_id:id}).then(arr=>{
      res.json({
        success:true,
        data:{
          err:0,
          msg:"获取成功",
          data:arr
        }
      })
    })
  }
})
router.post('/cms/removeBanner',function(req,res,next){
  let {_id} = req.body
  bannerModel.remove({_id}).then(arr=>{
    res.json({
      success:true,
      data:{
        err:0,
        msg:"删除成功",
      }
    })
  })
})
router.post('/addToCart', function(req, res, next) {
    let { num, good_id } = req.body
  
    // 识别用户，使用前端传递过来的token进行解析
    // 入库，
  
//   console.log('我进来了');
    num = num || 1
    if (!good_id) return res.json({success:true,data:{err: -1, msg: 'good_id商品id是必填参数'}})
    // console.log(req.headers)
    // 解析用户身份
    jwt.verifyToken(req, res).then(user=>{
        // console.log(user)
      // 把token反解析成功后，就得到了用户名和密码
      shopUserModel.find(user).then(arr=>{
        let item = {
          user_id: arr[0]._id,  // 用户id
          good_id,   // 商品id
          num,
          create_time: Date.now(),
          status: 1
        }
        // 购物车入库
        // 入参还要判断，如果在 jdcarts 中已经存在了当前 good_id，直接num++即可，无须重复添加
        cartModel.find({good_id, user_id: item.user_id}).then(arr1=>{
          if (arr1.length == 0) {
            cartModel.insertMany([item]).then(()=>{
              res.json({
                  success:true,
                  data:{err:0,msg:'加入购物车成功'}
              })
            })
          } else {
            cartModel.updateOne({good_id, user_id: item.user_id}, {num: arr1[0].num+1}).then(()=>{
                res.json({
                    success:true,
                    data:{err:0,msg:'加入购物车成功'}
                })
            })
            
          }
        })
      })
    })
  })
  // 获取购物车列表
router.get('/getCartList', function(req, res, next) {
    let { page, size } = req.query
  
    page = parseInt(page||1)
    size = parseInt(size||1000)
  
    jwt.verifyToken(req, res).then(user=>{
      shopUserModel.find(user).then((userArr)=>{
        // -1 按时间从大到小
        cartModel.find({status:1, user_id: userArr[0]._id}).limit(size).skip((page-1)*size).sort({create_time: -1}).then(arr1=>{
          if(arr1.length==0) return res.json({
            success:true,
            data:{err:0,msg:'success',data:[]}
        })
          let list = []
          // 遍历获取商品信息，一起传递给购物车列表
          arr1.map((ele,idx)=>{
            goodModel.find({_id: ele.good_id}).then(arr2=>{
              list.push({
                _id: ele._id,
                good_id: ele.good_id,
                create_time: ele.create_time,
                user_id: ele.user_id,
                num: ele.num,
                status: ele.status,
                good: arr2[0]
              })
              if (list.length == arr1.length) {
                res.json({
                    success:true,
                    data:{err:0,msg:'success',data:list}
                })
              }
            })
          })
        })
      })
    })
  })
  
   // 获取用户信息
  router.post('/getUserInfo', function(req, res, next) {
    jwt.verifyToken(req, res).then(user=>{
      shopUserModel.find(user).then((userArr)=>{
        res.json({
          success:true,
          data:{
            err:0,
            username:userArr[0].username,
            password:userArr[0].password,
            create_time:userArr[0].create_time,
            user_avatar:userArr[0].user_avatar,
            enjoys_value:userArr[0].enjoys_value,
            white_credit:userArr[0].white_credit
          }
        })
      })
    })
  })

  // 改变购物车商品数量
  router.post('/updateCartNum', function(req, res, next) {
    let { num, id } = req.body
  
    if (!num) return res.json({success:true,data:{err:-1, msg:'num是必填参数'}})
    if (num < 1) return res.json({success:true,data:{err:-1, msg:'num不能小于1'}})
    if (!id) return res.json({success:true,data:{err:-1, msg:'id是必填参数'}})
  
    jwt.verifyToken(req, res).then(user=>{
      cartModel.updateOne({_id: id}, {num}).then(()=>{
        res.json({success:true,data:{err:0,msg:'成功'}})
      })
    })
  })
  
  // 删除购物车商品
  router.get('/deleteToCart', function(req, res, next) {
    let { id } = req.query
  
    if (!id) return res.json({success:true,data:{err: -1, msg:'id是必填参数'}})
  
    jwt.verifyToken(req, res).then(user=>{
      cartModel.deleteMany({_id: id}).then(()=>{
        res.json({success:true,data:{err:0,msg:'删除成功'}})
      })
    })
  })
  
  // 提交购物车
  router.post('/submitToCart', function(req, res, next) {
    let { goods } = req.body
  
    // goods是用 ; 连接起来的 _id的字符串，不能用数组进行传递
    if (!goods) return res.json({success:true,data:{err: -1, msg: 'goods是必填参数'}})
  
    let goodIdArr = goods.split(';')
    goodIdArr.map((ele,idx)=>{
      if (!ele) goodIdArr.splice(idx,1)
    })
  
    jwt.verifyToken(req, res).then(user=>{
      let count = 0
      goodIdArr.map(ele=>{
        cartModel.deleteMany({_id: ele}).then(()=>{
          count++
          if (count == goodIdArr.length) {
            res.json({success:true,data:{err:0, msg:'下单成功'}})
            // 向'订单'集合中插入一条订单记录
          }
        })
      })
    })
  })
   // 查询收货地址列表
   router.get('/getAddressList', function(req, res, next) {
    jwt.verifyToken(req, res).then(user=>{
      shopUserModel.find(user).then((userArr)=>{
        addressModel.find({user_id: userArr[0]._id}).then(arr => {
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
    })
  })
  // 新增收货地址列表
  router.post('/addressList', function(req, res, next) {
    const { name, tel, addressDetail, isDefault, postalCode, city, county, country, province, areaCode, id } = req.body;
    const params = {
      name,
      city,
      county,
      province,
      country: country || '中国',
      tel,
      addressDetail,
      isDefault,
      postalCode,
      areaCode,
      create_time: Date.now(),
    }
    if(id){
      delete params.create_time;
    }
    jwt.verifyToken(req, res).then(user=>{
      shopUserModel.find(user).then((userArr)=>{
        if(isDefault){
          addressModel.updateMany({user_id: userArr[0]._id},{$set: {isDefault: false}}).then(() => {
           if(id){
            addressModel.updateOne({user_id: userArr[0]._id, _id: id}, {$set: params}).then(() => {
              let data = {
                success:true,
                  data:{
                    err:0,
                    msg:'修改地址成功', 
                  }
              }
              res.json(data)
            })
           }else{
            addressModel.insertMany({user_id: userArr[0]._id, ...params}).then(arr => {
              let data = {
                success:true,
                  data:{
                    err:0,
                    msg:'新增地址成功', 
                  }
              }
              res.json(data)
            })
           }
          })
        }else{
          if(id){
            addressModel.updateOne({user_id: userArr[0]._id, _id: id}, {$set: params}).then(() => {
              let data = {
                success:true,
                  data:{
                    err:0,
                    msg:'修改地址成功', 
                  }
              }
              res.json(data)
            })
           }else{
            addressModel.insertMany({user_id: userArr[0]._id, ...params}).then(arr => {
              let data = {
                success:true,
                  data:{
                    err:0,
                    msg:'新增地址成功', 
                  }
              }
              res.json(data)
            })
           }
        }
      })
    })
  })

  // 删除收货地址
  router.delete('/addressList', function(req, res, next) {
    const { id } = req.query;
    jwt.verifyToken(req, res).then(user=>{
      shopUserModel.find(user).then((userArr)=>{
        addressModel.deleteOne({user_id:userArr[0]._id, _id: id}).then(() => {
          let data = {
            success:true,
              data:{
                err:0,
                msg:'删除地址成功', 
              }
          }
          res.json(data)
        })
      })
    })
  })


  module.exports=router