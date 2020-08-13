var express = require('express');
var router = express.Router();
var goodModel = require('../model/goodModel');

router.post('/cms/addGood',function(req,res,next){
    let {id,name,desc,price,img,cate,hot,rank}=req.body;
    let data={
        name,
        desc,
        price,
        img,
        cate,
        hot:(hot?hot:false),
        rank:(rank?rank:0),
    }
    if(id==" "){
        data.create_time=Date.now()
        goodModel.insertMany([data]).then(()=>{
            res.json({
                success:true,
                data:{
                    err:0, 
                    msg:'添加商品成功'
                }
            })
        })
    }else{
        goodModel.updateOne({_id:id},{$set:data}).then(()=>{
            res.json({
                success:true,
                data:{
                    err:0, 
                    msg:'修改商品信息成功'
                }
            })
        })
    }
})
router.get('/cms/getCateGoods',function(req,res,next){
    let {page,limit,cate} = req.query;
    let q={cate:cate?cate:''}
    if(!q.cate) delete q.cate;
    // console.log(req.query)
    page=(page?page:1);
    limit=(limit?limit:5)
    goodModel.find(q).then(arr=>{
        let total = arr.length
        goodModel.find(q).sort({'rank':1}).skip((page-1)*limit).limit(Number(limit)).then(arr1=>{
            res.json({
                success:true,
                data:{
                    total:total,
                    err:0,
                    msg:'success',
                    data:arr1,
                    
                }
            })
        })
    })
    
})
router.get('/cms/goodsOfCate',function(req,res,next){
    let {cate} = req.query;
    // console.log(req.query)

      goodModel.find({cate}).sort({'rank':1}).then(arr=>{
          res.json({
              success:true,
              data:{
                  total:arr.length,
                  err:0,
                  msg:'success',
                  data:arr,
                  
              }
          })
      })
    
})
router.get('/cms/getAllGood',function(req,res,next){
    goodModel.find({}).sort({'rank':1}).then(arr=>{
        res.json({
          success:true,
          data:{
            total:arr.length,
            err:0,
            msg:'success',
            data:arr
          }
        })
    })
})
router.post('/cms/removeGood',function(req,res,next){
    let {_id} = req.body;
  // console.log(req.query)
  goodModel.remove({_id}).then(()=>{
    res.json({
      success:true,
      data:{
        err:0,
        msg:'删除成功',
      }
    })
  })
})
router.post('/cms/getGoodDetail',function(req,res,next){
    let {_id} = req.body;
  // console.log(req.query)
  goodModel.find({_id}).then(arr=>{
    res.json({
      success:true,
      data:{
        err:0,
        msg:'查询成功',
        data:arr
      }
    })
  })
})
module.exports=router