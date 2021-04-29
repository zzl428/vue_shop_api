const Router = require('koa-router')

const authRouter = new Router({prefix:'/auth'})

const { verifyAuth } = require('../middleware/auth.middleware')
const { 
  create, searchByRoleId, change, remove, removeRoleRight, rightsTree, setRights 
} = require('../controller/auth.controller')

authRouter.post('/test', verifyAuth, (ctx, next) => {
  ctx.body = `验证成功！`
})
// 添加角色
authRouter.post('/roles', verifyAuth, create),
// 按角色id搜索角色
authRouter.get('/roles', verifyAuth, searchByRoleId)
// 修改角色
authRouter.patch('/roles', verifyAuth, change)
// 删除角色
authRouter.delete('/roles', verifyAuth, remove)
// 删除角色权限
authRouter.delete('/roles/:roleId/rights/:rightId', verifyAuth, removeRoleRight)
// 获取权限（树形结构）
authRouter.get('/rights/tree', rightsTree)
// 设置权限
authRouter.post('/:roleId/rights', verifyAuth, setRights)

module.exports = authRouter