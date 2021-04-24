const connection = require('../app/database')

class UserService {
  async register(form) {
    const { username, password, email, mobile } = form
    const sql =  `INSERT INTO USER (NAME, PASSWORD, role, state, email, mobile) VALUES (?, ?, 2, 1, ?, ?)`
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
}

module.exports = new UserService()