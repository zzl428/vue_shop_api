const dataService = require('../service/data.service')

class DataController {
  // 获取菜单栏数据
  async menus(ctx, next) {
    ctx.body = {
      "data": [
          {
              "id": 125,
              "authName": "用户管理",
              "path": "users",
              "children": [
                  {
                      "id": 110,
                      "authName": "用户列表",
                      "path": "users",
                      "children": [],
                      "order": null
                  }
              ],
              "order": 1
          },
          {
              "id": 103,
              "authName": "权限管理",
              "path": "rights",
              "children": [
                  {
                      "id": 111,
                      "authName": "角色列表",
                      "path": "roles",
                      "children": [],
                      "order": null
                  },
                  {
                      "id": 112,
                      "authName": "权限列表",
                      "path": "rights",
                      "children": [],
                      "order": null
                  }
              ],
              "order": 2
          },
          {
              "id": 101,
              "authName": "商品管理",
              "path": "goods",
              "children": [
                  {
                      "id": 104,
                      "authName": "商品列表",
                      "path": "goods",
                      "children": [],
                      "order": 1
                  },
                  {
                      "id": 115,
                      "authName": "分类参数",
                      "path": "params",
                      "children": [],
                      "order": 2
                  },
                  {
                      "id": 121,
                      "authName": "商品分类",
                      "path": "categories",
                      "children": [],
                      "order": 3
                  }
              ],
              "order": 3
          },
          {
              "id": 102,
              "authName": "订单管理",
              "path": "orders",
              "children": [
                  {
                      "id": 107,
                      "authName": "订单列表",
                      "path": "orders",
                      "children": [],
                      "order": null
                  }
              ],
              "order": 4
          },
          {
              "id": 145,
              "authName": "数据统计",
              "path": "reports",
              "children": [
                  {
                      "id": 146,
                      "authName": "数据报表",
                      "path": "reports",
                      "children": [],
                      "order": null
                  }
              ],
              "order": 5
          }
      ],
      "meta": {
          "msg": "获取菜单列表成功",
          "status": 200
      }
    }
  }

  // 获取权限列表
  async rightsList(ctx, next) {
    const result = await dataService.rightsList()
    ctx.body = result
  }

//   获取角色列表
  async rolesList(ctx, next) {
    const result = await dataService.rolesList()
    ctx.body = result
  }

  async list(ctx, next) {
      const { pagenum, pagesize } = ctx.query
      const result = await dataService.userList(pagenum, pagesize)
      const [len] = await dataService.tableLength('user')
      ctx.body = {
          result,
          len
      }
  }

  //按字段搜索   
  async searchByField(ctx, next) {
      const { table, field, value } = ctx.query
      const result = await dataService.search(table, field, value)
      if(result.length !== 0) {
        ctx.body = {
            msg: `查找成功`,
            search: `have`
        }
      } else {
          ctx.body = {
            msg: `查找失败`,
            search: `none`
          }
      }
  }

    //按字段删除
    async remove(ctx, next) {
        const { table, field, value } = ctx.query
        const result = await dataService.remove(table, field, value)
        ctx.body = result
    }
}

module.exports = new DataController()