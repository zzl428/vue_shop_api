const connection = require('../app/database')
const {sqlTotal, deleteByField} = require('../utils/sql')


class OrderService {
  // 获取订单列表
  async ordersList(queryInfo) {
    const {query, pagenum, pagesize} = queryInfo
    let offset = (pagenum - 1) * pagesize
    let sql = ``
    let total = 0
    if(!query) {
      // 获取所有订单
      sql = `SELECT * FROM orders LIMIT ${offset}, ${pagesize}`
      let [result] = await connection.query(sql).catch(err => err)
      total = await sqlTotal(`orders`)
      return {
        orders: result,
        total,
        pagenum,
      }
    }
  }
}

module.exports = new OrderService()