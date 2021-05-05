const Router = require('koa-router')

const cateRouter = new Router({prefix:'/categories'})

const {cateList, addCate, editCate, searchById, attrList, addAttr, getAttr, update, remove} 
= require('../controller/cate.controller')

// 获取商品分类列表
cateRouter.get('/', cateList)
// 按id获取分类信息
cateRouter.get('/:cat_id', searchById)
// 获取分类参数
cateRouter.get('/:cat_id/attributes', attrList)
// 修改参数的对话框获取参数数据
cateRouter.get('/:cat_id/attributes/:attr_id', getAttr)


// 添加商品分类
cateRouter.post('/', addCate)
// 添加分类参数
cateRouter.post('/:cat_id/attributes', addAttr)


// 编辑商品分类
cateRouter.patch('/', editCate)

// 修改分类参数属性
cateRouter.put('/:cat_id/attributes/:attr_id', update)

// 删除参数属性
cateRouter.delete('/:cat_id/attributes/:attr_id', remove)

module.exports = cateRouter