const connection = require('../app/database')

class DataService {
  // 展示列表
  async userList(pagenum, pagesize) {
    const sql = `SELECT * FROM USER LIMIT ?, ?`
    const [result] = await connection.execute(sql, [pagenum, pagesize])
    return result
  }

  // 获取表单长度
  async tableLength(table) {
    const sql = `SELECT COUNT(*) FROM ${table}`
    const [len] = await connection.query(sql)
    return len
  }

  // 按字段查找
  async search(table, field, value) {
    const sql = `SELECT * FROM ${table} WHERE ${field} = ?`
    const [result] = await connection.execute(sql, [value])
    return result
  }

  // 按字段删除
  async remove(table, field, value) {
    const sql = `DELETE FROM ${table} WHERE ${field} = ?`
    const [result] = await connection.execute(sql, [value])
    return result
  }
}

module.exports = new DataService()