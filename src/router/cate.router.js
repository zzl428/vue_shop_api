const Router = require('koa-router')

const cateRouter = new Router({prefix:'/categories'})

const {cateList, addCate, editCate, searchById} = require('../controller/cate.controller')

// 获取商品分类列表
cateRouter.get('/', cateList)
// 按id获取分类信息
cateRouter.get('/:cat_id', searchById)

// 添加商品分类
cateRouter.post('/', addCate)

// 编辑商品分类
cateRouter.patch('/', editCate)


module.exports = cateRouter