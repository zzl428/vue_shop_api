const Router = require('koa-router')

const orderRouter = new Router({prefix:'/orders'})

const {ordersList} = require('../controller/order.controller')

// 获取订单列表数据
orderRouter.get('/', ordersList)


module.exports = orderRouter