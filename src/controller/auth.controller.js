const authService = require('../service/auth.service')

class AuthController {
  // 创建角色
  async create(ctx, next) {
    const { form } = ctx.request.body
    const result = await authService.create(form)
    ctx.body = result
  }

  // 按角色id搜索角色
  async searchByRoleId(ctx, next) {
    const {id} = ctx.query
    const result = await authService.searchByRoleId(id)
    ctx.body = result
  }

  // 删除角色
  async remove(ctx, next) {
    const {id} = ctx.query
    const result = await authService.remove(id)
    ctx.body = result
  }

  // 修改角色
  async change(ctx, next) {
    const {form} = ctx.request.body
    const result = await authService.change(form)
    ctx.body = result
  }

  // 删除角色权限
  async removeRoleRight(ctx, next) {
    const {roleId, rightId} = ctx.params
    const result = await authService.removeRoleRight(roleId, rightId)
    ctx.body = result
  }

  // 获取权限（树形结构）
  async rightsTree(ctx, next) {
    const result = await authService.rightsTree()
    ctx.body = result
  }

  // 设置权限
  async setRights(ctx, next) {
    const {roleId} = ctx.params
    const {rids} = ctx.request.body
    const result = await authService.setRights(roleId, rids)
    ctx.body = result
  }
}

module.exports = new AuthController()