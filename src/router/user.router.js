const Router = require('koa-router')

const userRouter = new Router({prefix:'/users'})

const { create, check, login } = require('../controller/user.controller')
const { verifyUser, handlePassword, verifyLogin } = require('../middleware/user.middleware')


// userRouter.post('/', verifyUser, handlePassword, create)
// 验证用户名是否存在
userRouter.post('/register/:userName', check)
// 用户注册
userRouter.post('/register', verifyUser, handlePassword, create)
// 用户登录
userRouter.post('/login', verifyLogin, login)

module.exports = userRouter