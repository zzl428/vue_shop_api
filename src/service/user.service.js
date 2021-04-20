const connection = require('../app/database')

class UserService {
  async register(user) {
    const { username, password } = user
    const sql =  `INSERT INTO USER (NAME, PASSWORD) VALUES (?, ?)`
    const result = await connection.execute(sql, [username, password])
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
}

module.exports = new UserService()