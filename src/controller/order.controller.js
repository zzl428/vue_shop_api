const orderService = require('../service/order.service')

class OrderController {
  // 获取订单列表
  async ordersList(ctx, next) {
    const {queryInfo} = ctx.query
    const result = await orderService.ordersList(JSON.parse(queryInfo))
    ctx.body = result
  }
}

module.exports = new OrderController()