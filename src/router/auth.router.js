const Router = require('koa-router')

const authRouter = new Router()

const { verifyAuth } = require('../middleware/auth.middleware')

authRouter.post('/test', verifyAuth, (ctx, next) => {
  ctx.body = `验证成功！`
})

module.exports = authRouter