const cateService = require('../service/cate.service')

class CateController {
  // 获取商品分类数据
  async cateList(ctx, next) {
    const {queryInfo} = ctx.query
    const result = await cateService.cateList(queryInfo)
    ctx.body = result
  }

  // 添加商品分类
  async addCate(ctx, next) {
    const {cat_name, cat_pid, cat_level} = ctx.query
    const result = await cateService.addCate(cat_name, cat_pid, cat_level)
    ctx.body = result
  }

  // 编辑分类
  async editCate(ctx, next) {
    const {cat_name, cat_id} = ctx.query
    const result = await cateService.editCate(cat_name, cat_id)
    ctx.body = result
  }

  // 按Id获取分类信息
  async searchById(ctx, next) {
    const {cat_id} = ctx.params
    const result = await cateService.searchById(cat_id)
    ctx.body = result
  }
}

module.exports = new CateController()