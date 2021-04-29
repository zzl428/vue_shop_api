const connection = require('../app/database')

class UserService {
  async register(form) {
    const { username, password, email, mobile } = form
    const sql =  `INSERT INTO USER (NAME, PASSWORD, state, email, mobile) VALUES (?, ?, 1, ?, ?)`
    const result = await connection.execute(sql, [username, password, email, mobile])
    return result
  }

  async getUserByName(name) {
    const sql = `SELECT * FROM USER WHERE NAME = ?`
    const [result] = await connection.execute(sql, [name])
    return result
  }

  async login(username, password) {
    console.log(`登陆成功`);
  }

  async update(id, middle) {
    let values = []
    let frag = ``
    const keys = Object.keys(middle)
    for(let i of keys) {
      values.push(middle[i])
      frag = `${frag} ${i} = ?,`
    }
    frag = frag.slice(0, -1)
    const sql = `update user set${frag} where id = ${id}`
    const result = await connection.execute(sql, values)
    return result
  }

  async search(user) {
    const sql = `SELECT id, name, role, state, email, mobile, createAt, updateAt FROM USER WHERE NAME = ?`
    const [result] = await connection.execute(sql, [user])
    return result
  }

  async searchById(id) {
    const sql = `SELECT name, role, state, email, mobile, createAt, updateAt FROM USER WHERE id = ?`
    const [result] = await connection.execute(sql, [id])
    return result
  }

  // 给用户分配角色
  async setRole(userId, roleId) {
    let sql = `SELECT roleName FROM role WHERE role_id = ?`
    let [result] = await connection.execute(sql, [roleId])
    sql = `UPDATE USER SET role = ?, role_id = ? WHERE id = ?`
    let [finalResult] = await connection.execute(sql, [result[0].roleName, roleId, userId])
    return finalResult
  }
}

module.exports = new UserService()