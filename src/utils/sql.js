const connection = require('../app/database')

let sql = ``

// 获取某张表的长度
async function sqlTotal(table) {
  sql = `SELECT COUNT(*) total FROM ${table}`
  const [result] = await connection.query(sql)
  return result[0].total
}

// 按字段删除数据
async function deleteByField(table, field, value) {
  sql = `DELETE FROM ${table} WHERE ${field} = ?`
  const [result] = await connection.execute(sql, [value])
  return result
}

module.exports = {
  sqlTotal,
  deleteByField
}