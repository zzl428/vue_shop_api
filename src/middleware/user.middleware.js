const errorType = require('../constants/error-types')
const userService = require('../service/user.service')
const passwordHandle = require('../utils/passwordHandle')
const md5password = require('../utils/passwordHandle')

const verifyUser = async(ctx, next) => {
  // 获取用户名和密码
  const { username, password } = ctx.request.body.form;
  
  // 判断用户名或密码是否为空
  if(!username || !password) {
    const err = new Error(errorType.NAME_OR_PASSWORD_IS_REQUIRED)
    return ctx.app.emit('error', err, ctx)
  }

  // 判断用户名不重复
  const result = await userService.getUserByName(username)
  if(result.length !==0) {
    const err = new Error(errorType.USER_ALREADY_EXISTS)
    return ctx.app.emit('error', err, ctx)
  }

  await next()
}

const handlePassword = async(ctx, next) => {
  const { password } = ctx.request.body.form
  ctx.request.body.form.password = passwordHandle(password)

  await next()
}

const verifyLogin = async(ctx, next) => {
  // 获取用户名和密码
  const {username, password} = ctx.request.body.form
  // 判断用户名和密码是否为空
  if(!username || !password) {
    const err = new Error(errorType.NAME_OR_PASSWORD_IS_REQUIRED)
    return ctx.app.emit('error', err, ctx)
  }
  // 判断用户是否存在
  const result = await userService.getUserByName(username)
  const user = result[0]
  if(!user) {
    const err = new Error(errorType.USER_NOT_EXISTS)
    return ctx.app.emit('error', err, ctx)
  }
  // 判断密码是否和数据库中的一致（加密）
  if(md5password(password) !== user.password) {
    const err = new Error(errorType.PASSWORD_IS_INCORRECT)
    return ctx.app.emit('error', err, ctx)
  }
  ctx.user = user
  await next()
}

module.exports = {
  verifyUser,
  handlePassword,
  verifyLogin
}