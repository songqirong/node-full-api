var express = require('express');
var router = express.Router();
var catesModel = require('../model/catesModel');
router.post('/cms/addCate',function(req,res,next){
    let {cate_zh,cate_en} = req.body;
    let data = {
        cate_zh,
        cate_en,
        create_time:Date.now()
    }
    catesModel.find({$or:[{cate_zh},{cate_en}]}).then(arr=>{
        if(arr.length>0){
          res.json({
              success:true,
              data:{
                err:-1, 
                msg:'该品类已存在'
              }
          })
        }else{
          catesModel.insertMany([data]).then(()=>{
            res.json({
                success:true,
                data:{
                  err:0, 
                  msg:'品类添加成功'
                }
            })
          })
        }
      })
    
})
router.get('/cms/getCates',function(req,res,next){
  let {page,limit} = req.query;
  page=page?page:1;
  if(limit){
    catesModel.find({}).sort({'create_time':-1}).skip((page-1)*limit).limit(Number(limit)).then(arr=>{
      res.json({
        success:true,
        data:{
          err:0,
          msg:'success',
          data:arr
        }
      })
    })
  }else{
    catesModel.find({}).sort({'create_time':-1}).then(arr=>{
      res.json({
        success:true,
        data:{
          err:0,
          msg:'success',
          data:arr
        }
      })
    })
  }
  
})
router.post('/cms/removeCate',function(req,res,next){
  let {_id} = req.body;
  catesModel.remove({_id}).then(()=>{
    res.json({
      success:true,
      data:{
        err:0,
        msg:'删除成功',
      }
    })
  })
})
router.post('/cms/updateCate',function(req,res,next){
  let {_id,cate_en,cate_zh} = req.body;
  catesModel.updateOne({_id},{$set:{cate_zh,cate_en}}).then(()=>{
    res.json({
      success:true,
      data:{
        err:0,
        msg:'修改成功',
      }
    })
  })
})
router.get('/cms/getCatesCount',function(req,res,next){
  catesModel.find({}).count().then(arr=>{
    res.json({
      success:true,
      data:{
        err:0,
        msg:'success',
        data:arr
      }
    })
  })
})
module.exports = router