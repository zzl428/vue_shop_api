const Router = require('koa-router')

const goodRouter = new Router({prefix:'/goods'})

const {goodsList, removeGoods, addGoods} = require('../controller/goods.controller')

// 获取商品列表数据
goodRouter.get('/', goodsList)

// 删除商品
goodRouter.delete('/:id', removeGoods)

// 添加商品
goodRouter.post('/', addGoods)

module.exports = goodRouter