const jwt = require('jsonwebtoken')
const userService = require('../service/user.service')
const { PRIVATE_KEY } = require('../app/config')

class UserController {
  // 注册
  async create(ctx, next) {
    const user = ctx.request.body
    const result = await userService.register(user)
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
}

module.exports = new UserController()