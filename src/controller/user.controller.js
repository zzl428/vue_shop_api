const jwt = require('jsonwebtoken')
const userService = require('../service/user.service')
const { PRIVATE_KEY } = require('../app/config')

class UserController {
  // 注册
  async create(ctx, next) {
    const {form} = ctx.request.body
    const result = await userService.register(form)
    ctx.body = result
  }

  // 检查是否重名
  async check(ctx, next) {
    const { userName } = ctx.params
    const result = await userService.getUserByName(userName)
    if(result.length !==0) {
      ctx.status = 409
      ctx.body = '用户名已存在'
    } else {
      ctx.status = 200
      ctx.body = `可以注册`
    }
  }

  // 登录
  async login(ctx, next) {
    const {id, name} = ctx.user
    const token = jwt.sign({id, name}, PRIVATE_KEY, {
      expiresIn:60 * 60 *24,
      algorithm:`RS256` 
    })
    // ctx.status = 200
    ctx.body = {id, name, token}
  }

  // 修改数据
  async update(ctx, next) {
    const {id, data} = ctx.query
    const middle = JSON.parse(data)
    const result = await userService.update(id, middle)
    ctx.body = result
  }

  // 按用户名搜索用户
  async search(ctx, next) {
    const {user} = ctx.query
    const result = await userService.search(user)
    ctx.body = result
  }

  // 按id搜索用户
  async searchById(ctx, next) {
    console.log(11);
    const {id} = ctx.query
    
    const result = await userService.searchById(id)
    ctx.body = result
  }

  // 分配用户角色
  async setRole(ctx, next) {
    const {userId} = ctx.params
    const {roleId} = ctx.request.body
    const result = await userService.setRole(userId, roleId)
    ctx.body = result
  }
}

module.exports = new UserController()