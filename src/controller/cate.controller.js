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

  // 获取分类参数
  async attrList(ctx, next) {
    const {cat_id} = ctx.params
    const {sel} = ctx.query
    const result = await cateService.attrList(cat_id, sel)
    ctx.body = result
  }

  // 添加分类参数
  async addAttr(ctx, next) {
    const {cat_id} = ctx.params
    let {attr_name, attr_sel, attr_vals} = ctx.query
    attr_vals = attr_vals || ''
    const result = await cateService.addAttr(cat_id, attr_name, attr_sel, attr_vals)
    ctx.body = result
  }

  // 修改参数的对话框获取参数数据
  async getAttr(ctx, next) {
    const {cat_id, attr_id} = ctx.params
    let {attr_sel, attr_vals} = ctx.query
    const result = await cateService.getAttr(cat_id, attr_id, attr_sel, attr_vals)
    ctx.body = result
  }

  // 修改分类参数属性
  async update(ctx, next) {
    const {cat_id, attr_id} = ctx.params
    let {attr_name, attr_sel, attr_vals} = ctx.query
    const result = await cateService.update(cat_id, attr_id, attr_name, attr_sel, attr_vals)
    ctx.body = result
  }

  // 删除参数属性
  async remove(ctx, next) {
    const {cat_id, attr_id} = ctx.params
    const result = await cateService.remove(cat_id, attr_id)
    ctx.body = result
  }
}

module.exports = new CateController()