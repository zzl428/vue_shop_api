const connection = require('../app/database')

function sqlfunc(level, pid, role_id) {
  return `SELECT 
          JSON_ARRAYAGG(JSON_OBJECT('id', rr.right_id, 'authName', authName, 'path', path)) children
        FROM rights ri
        LEFT JOIN role_right rr ON ri.right_id = rr.right_id
        WHERE rr.right_level = ${level} AND rr.right_pid = ${pid} AND role_id = ${role_id}
        GROUP BY role_id`
}
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

  // 获取权限列表
  async rightsList() {
    const sql = 'SELECT * FROM rights'
    const [result] = await connection.query(sql)
    return result
  }

  // 获取角色列表
  async rolesList() {
    const sql1 = `SELECT 
                  ro.role_id id, ro.roleName, ro.roleDesc,
                  IF (COUNT(ri.right_id) ,JSON_ARRAYAGG(JSON_OBJECT('id', ri.right_id, 'authName', ri.authName, 'path', ri.path
                  )),JSON_ARRAY())children
                FROM role ro
                LEFT JOIN role_right rr ON ro.role_id =rr.role_id 
                LEFT JOIN rights ri ON ri.right_id = rr.right_id
                WHERE rr.right_level=0 OR rr.right_level IS NULL
                GROUP BY ro.role_id`
    let [result] = await connection.query(sql1)
    for(let i of result) {
      if(i.children.length !== 0) {
        for(let j of i.children) {
          let sql2 = sqlfunc(1, j.id, i.id)
          const [result2] = await connection.query(sql2)
          if(result2.length !== 0) {
            j.children = result2[0].children
            // last
            for(let k of j.children) {
              let sql3 = sqlfunc(2, k.id, i.id)
              const [result3] = await connection.query(sql3)
              if(result3.length !== 0) {
                k.children = result3[0].children
              }
            }
          }
        }
      }
    }
    return result
  }
}

module.exports = new DataService()