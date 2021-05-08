const Router = require('koa-router')

const dataRouter = new Router({prefix:'/data'})


const {goodsPicsHandler} = require('../middleware/file.middleware')
const { verifyAuth } = require('../middleware/auth.middleware')
const { menus, list, remove, rightsList, rolesList, upload, showPic } = require('../controller/data.controller')
const { searchByField } = require('../controller/data.controller')

// 按字段查找，不返回
dataRouter.get('/search', searchByField)
// 获取菜单栏数据
dataRouter.get('/menus', verifyAuth, menus)
// 获取权限列表
dataRouter.get('/rights', rightsList)
// 获取角色列表
dataRouter.get('/roles', rolesList)
// 获取用户列表
dataRouter.get('/users', verifyAuth, list)
// 删除用户数据
dataRouter.delete('/delete', verifyAuth, remove)
// 上传图片
dataRouter.post('/upload', verifyAuth, goodsPicsHandler, upload)
// 访问图片
dataRouter.get('/temp_goods_pics/:pic_name', showPic)

module.exports = dataRouter