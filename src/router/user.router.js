const Router = require('koa-router')

const userRouter = new Router({prefix:'/users'})

const { create, check, login, update, search, searchById, setRole } = require('../controller/user.controller')
const { verifyUser, handlePassword, verifyLogin } = require('../middleware/user.middleware')
const { verifyAuth } = require('../middleware/auth.middleware')

// userRouter.post('/', verifyUser, handlePassword, create)
// 验证用户名是否存在
// userRouter.post('/register/:userName', check)
// 用户注册
userRouter.post('/register', verifyUser, handlePassword, create)
// 用户登录
userRouter.post('/login', verifyLogin, login)
// 修改数据
userRouter.patch('/', verifyAuth, update)
// 按用户名搜索用户
userRouter.get('/username', verifyAuth, search)
// 按id搜索用户
userRouter.get('/id', verifyAuth, searchById)
// 给用户分配角色
userRouter.put('/:userId/role', verifyAuth, setRole)

module.exports = userRouter