const Koa = require('koa')
// 解析json数据
const bodyParser = require('koa-bodyparser')
const cors = require('koa2-cors')

const useRoutes = require('../router/index')
const errorHandler = require('./error.handle')

const app = new Koa()

app.use(
  cors()
);

// app.use(async (ctx, next) => {
//   ctx.set('Access-Control-Allow-Origin', '*');
//   await next();
// });

app.use(bodyParser())



useRoutes(app)
// 错误处理
app.on('error',errorHandler)

module.exports = app