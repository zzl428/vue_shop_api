const goodsService = require('../service/goods.service')

class GoodsController {
  // 获取商品列表数据
  async goodsList(ctx, next) {
    const {queryInfo} = ctx.query
    const result = await goodsService.goodsList(JSON.parse(queryInfo))
    ctx.body = result
  }

  // 删除商品
  async removeGoods(ctx, next) {
    const {id} = ctx.params
    const result = await goodsService.removeGoods(id)
    ctx.body = result
  }

  // 添加商品
  async addGoods(ctx, next) {
    const {form} = ctx.request.body
    const result = await goodsService.addGoods(form)
    ctx.body = result
  }
}

module.exports = new GoodsController()