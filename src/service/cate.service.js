const connection = require('../app/database')

function sqlFunc(level, pid) {
  return `SELECT
	        *
        FROM category
        WHERE cat_level = ${level} AND cat_pid = ${pid}`
}

class CateService {
  async cateList(queryInfo) {
    const middle = JSON.parse(queryInfo)
    let {type, pagenum, pagesize} = middle
    let midtype = type || 3
    let sql = `SELECT COUNT(*) total FROM category WHERE cat_level = 0`
    let [result] = await connection.query(sql)
    let midnum = pagenum || 1
    
    let midsize = pagesize || result[0].total
    let offset = (midnum - 1) * midsize

    sql = `SELECT
              *
          FROM category
          WHERE cat_level = 0
          LIMIT ${offset}, ${midsize}`
    let [floor1] = await connection.query(sql)
    // 若type为1，直接返回第一级数据
    if(midtype === 1) {
      return {
        total : result[0].total,
        result: floor1
      }
    }
    for(let i of floor1) {
      sql = sqlFunc(1, i.cat_id)
      let [floor2] = await connection.query(sql)
      if(floor2.length !== 0) {
        i.children = floor2
        // 如果type为2，则只返回两级数据
        if(midtype === 2)  continue
        for(let j of i.children) {
          sql = sqlFunc(2, j.cat_id)
          let [floor3] = await connection.query(sql)
          if(floor3.length !== 0) {
            j.children = floor3
          }
        }
      }
    }
    return {
      total : result[0].total,
      result: floor1
    }
  }

  // 添加分类
  async addCate(cat_name, cat_pid, cat_level) {
    let sql = `INSERT INTO category (cat_name, cat_pid, cat_level) VALUES (?, ?, ?)`
    const [result] = await connection.execute(sql, [cat_name, cat_pid, cat_level])
    return result
  }

  // 编辑分类
  async editCate(cat_name, cat_id) {
    let sql = `UPDATE category SET cat_name = ? WHERE cat_id = ?`
    const [result] = await connection.execute(sql, [cat_name, cat_id])
    return result
  }

  // 按id获取分类数据
  async searchById(cat_id) {
    let sql = `SELECT cat_name FROM category WHERE cat_id = ?`
    const [result] = await connection.execute(sql, [cat_id])
    return result[0].cat_name
  }
}

module.exports = new CateService()