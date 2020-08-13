var express = require('express');
var router = express.Router();
// var multiparty = require('multiparty')
var formidable = require('formidable')
var path = require('path')
var fs = require('fs')
router.post('/img',function(req, res, next){
    var form = new formidable.IncomingForm();
    // var form = new multiparty.Form()
    form.parse(req, function(err, fields, files){
        
        if(err) {
            res.json({
                success:true,
                data:{err:-1,msg:'图片上传失败'}
            })
        }else{
            console.log("files",files)
            const file = files.file
            // const file = files.file[0]
            // 使用fs模块把临时路径中的图片数据，写入到服务器硬盘中
            let readStream = fs.createReadStream(file.path)
            let now = Date.now();
            // let p = path.join(__dirname,'../public/imgs/' + now + '-' + file.originalFilename);
            let p = path.join(__dirname,'../public/imgs/' + now + '-' + file.name);
            let writeStream = fs.createWriteStream(p);
            readStream.pipe(writeStream);
            writeStream.on('close', function() {
                let data={
                    err:0,
                    msg:'图片上传成功',
                    url: `/imgs/${now}-${file.name}`
                }
                res.json({
                    success:true,
                    data
                })
            })
        }
    })
})
module.exports=router
