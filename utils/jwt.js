const jwt = require('jsonwebtoken');

// 生成token
function fetchjwt(data){
    return jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
        data
      }, 'sqr');
}
// 解析token
function verifyToken(req, res) {
  let token = req.headers.authorization
    // console.log(token)
    if (!token) {
      return res.json({err:-1,msg:'token invalid'})
    }
    return new Promise(function(resolve, reject) {
      try {
        let decoded = jwt.verify(token, 'sqr')
        resolve(decoded.data)
      } catch(err) {
        // console.log('2222')
        // reject({err:-1,msg:'token invalid'})
        res.json({err:-1,msg:'token invalid'})
      }
    })
}

module.exports={
    fetchjwt,
    verifyToken
}