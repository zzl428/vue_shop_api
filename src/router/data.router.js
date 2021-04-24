const Router = require('koa-router')

const dataRouter = new Router({prefix:'/data'})

const { verifyAuth } = require('../middleware/auth.middleware')
const { menus, list, remove } = require('../controller/data.controller')
const { searchByField } = require('../controller/data.controller')

// 按字段查找，不返回
dataRouter.get('/search', searchByField)
dataRouter.get('/menus', verifyAuth, menus)
dataRouter.get('/users', verifyAuth, list)
dataRouter.delete('/delete', verifyAuth, remove)

module.exports = dataRouter