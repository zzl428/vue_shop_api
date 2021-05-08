const Multer = require('koa-multer')

const picsUpload = Multer({
  dest: './uploads/temp_goods_pics'
})

const goodsPicsHandler = picsUpload.single('file')

module.exports = {
  goodsPicsHandler
}