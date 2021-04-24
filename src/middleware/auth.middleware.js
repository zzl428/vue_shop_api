const jwt = require('jsonwebtoken')
const errorType = require('../constants/error-types')
const { PUBLIC_KEY } = require('../app/config')

const verifyAuth = async (ctx, next) => {
  console.log(`验证授权的middleware`);
  // 获取token
  const authorization = ctx.headers.authorization
  if(!authorization) {
    const err = new Error(errorType.UNAUTHORIZATION)
    return ctx.app.emit(`error`,err, ctx)
  }
  const token = authorization.replace(`Bearer `,``)
  // 验证token
  try {
    const result = jwt.verify(token, PUBLIC_KEY, {
      algorithms:[`RS256`]
    })
    console.log(`result`,result);
    ctx.user = result
    await next()
  } catch (error) {
    console.log(error);
    const err = new Error(errorType.UNAUTHORIZATION)
    ctx.app.emit(`error`,err, ctx)
  }
}

module.exports = {
  verifyAuth,

}
