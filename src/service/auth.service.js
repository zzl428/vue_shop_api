const connection = require('../app/database')

function sqlfunc(level, pid, role_id) {
  return `SELECT 
          JSON_ARRAYAGG(JSON_OBJECT('id', rr.right_id, 'authName', authName, 'path', path)) children
        FROM rights ri
        LEFT JOIN role_right rr ON ri.right_id = rr.right_id
        WHERE rr.right_level = ${level} AND rr.right_pid = ${pid} AND role_id = ${role_id}
        GROUP BY role_id`
}

function sqlRightsTree(level, pid) {
  return `SELECT 
	        JSON_ARRAYAGG(JSON_OBJECT('id', right_id, 'authName', authName, 'path', path, 'pid', pid)) children
        FROM rights
        WHERE LEVEL = ${level} AND pid = ${pid}`
}

class AuthService {
  // 创建角色
  async create(form) {
    const {roleName, roleDesc} = form
    let sql = `SELECT MAX(role_id) FROM role`
    const [result] = await connection.query(sql)
    const maxId = result[0]['MAX(role_id)']
    let mid = Math.floor(Math.random()*10) + 1
    let id = maxId + mid
    sql = `INSERT INTO role (role_id, roleName, roleDesc) VALUES (?, ?, ?)`
    const [result2] = await connection.execute(sql, [id, roleName, roleDesc])
    return result2
  }

  // 按角色id搜索角色
  async searchByRoleId(id) {
    const sql = `SELECT * FROM role WHERE role_id = ?`
    const [result] = await connection.execute(sql, [id])
    return result[0]
  }

  // 修改角色
  async change(form) {
    const {role_id, roleName, roleDesc} = form
    const sql = `UPDATE role SET roleName = ?, roleDesc = ? WHERE role_id = ?`
    const [result] = await connection.execute(sql, [roleName, roleDesc, role_id])
    return result
  }

  // 删除角色
  async remove(id) {
    const sql = `DELETE FROM role WHERE role_id = ?`
    const [result] = await connection.execute(sql, [id])
    return result
  }

  // 删除角色权限
  async removeRoleRight(roleId, rightId) {
    let sql = `SELECT right_level level FROM role_right WHERE role_id = ? AND right_id = ?`
    let [result] = await connection.execute(sql, [roleId, rightId])
    let {level} = result[0]
    level = parseInt(level)
    if(level === 2) {
      sql = `DELETE from role_right WHERE role_id = ? AND right_id = ?`
      await connection.execute(sql, [roleId, rightId])
    } else if(level === 1) {
      sql = `DELETE FROM role_right WHERE role_id = ? AND right_pid = ?`
      await connection.execute(sql, [roleId, rightId])
      sql = `DELETE from role_right WHERE role_id = ? AND right_id = ?`
      await connection.execute(sql, [roleId, rightId])
    } else if(level == 0) {
      sql = `SELECT right_id id FROM role_right WHERE role_id = ? AND right_pid = ?`
      let [mid] = await connection.execute(sql, [roleId, rightId])
      if(mid.length === 0){
        sql = `DELETE from role_right WHERE role_id = ? AND right_id = ?`
        await connection.execute(sql, [roleId, rightId])
      } else {
        for(let i of mid) {
          sql = `DELETE FROM role_right WHERE role_id = ? AND right_pid = ?`
          await connection.execute(sql, [roleId, i.id])
          sql = `DELETE from role_right WHERE role_id = ? AND right_id = ?`
          await connection.execute(sql, [roleId, i.id])
        }
        sql = `DELETE from role_right WHERE role_id = ? AND right_id = ?`
        await connection.execute(sql, [roleId, rightId])
      }
    }
    sql = `SELECT 
            ro.role_id id, ro.roleName, ro.roleDesc,
            IF (COUNT(ri.right_id) ,JSON_ARRAYAGG(JSON_OBJECT('id', ri.right_id, 'authName', ri.authName, 'path', ri.path
            )),JSON_ARRAY())children
          FROM role ro
          LEFT JOIN role_right rr ON ro.role_id =rr.role_id 
          LEFT JOIN rights ri ON ri.right_id = rr.right_id
          WHERE rr.right_level=0 AND ro.role_id = ? 
          GROUP BY id`
    let [[finalresult]] = await connection.execute(sql, [roleId])
    if(!finalresult) return []
    for(let i of finalresult.children) {
      sql = sqlfunc(1, i.id, finalresult.id)
      let [result2] = await connection.query(sql)
      if(result2.length !== 0) {
        i.children = result2[0].children
        for(let j of i.children) {
          sql = sqlfunc(2, j.id, finalresult.id)
          let [result3] = await connection.query(sql)
          if(result3.length !== 0) {
            j.children = result3[0].children
          }
        }
      }
    }
    return finalresult
  }

  // 获取权限（树形结构）
  async rightsTree() {
    let sql = `SELECT 
                right_id id, authName, path, pid
              FROM rights
              WHERE LEVEL = 0`
    let [result] = await connection.query(sql)
    for(let i of result) {
      sql = sqlRightsTree(1, i.id)
      let [result] = await connection.query(sql)
      if(result[0].length !== 0) {
        i.children = result[0].children
      }
      for(let j of i.children) {
        sql = sqlRightsTree(2, j.id)
        let [result] = await connection.query(sql)
        if(result[0].length !== 0) {
          j.children = result[0].children
        }
      }
    }
    return result
  }

  // 设置权限
  async setRights(roleId, rids) {
    let sql = `SELECT right_id rid FROM role_right WHERE role_id = ?`
    let [result] = await connection.execute(sql, [roleId])
    let len1 = rids.length
    let len2 = result.length
    // if(result[0].rid !== null) {
    //   len2 = result.length
    // }
    if(len1 !== 0) {
      // 先删除表内已有地权限
      sql = `DELETE FROM role_right WHERE role_id = ?`
      await connection.execute(sql, [roleId])
      // 全部添加
      sql = `SELECT LEVEL, pid FROM rights WHERE right_id = ?`
      let levels = []
      let pids = []
      for(let i of rids) {
        let [midResult] = await connection.execute(sql, [i])
        levels.push(midResult[0].LEVEL)
        pids.push(midResult[0].pid)
      }
      sql = `INSERT INTO role_right (role_id, right_id, right_level, right_pid) VALUES (?, ?, ?, ?)`
      for(let i = 0; i < len1; i++) {
        await connection.execute(sql, [roleId, rids[i], levels[i], pids[i]])
      }
    } else if(len2 !== 0) {
      // 全部删除
      sql = `DELETE FROM role_right WHERE role_id = ?`
      await connection.execute(sql, [roleId])
    } else {
      // 直接返回
    } 
    return []
  }
}

module.exports = new AuthService()