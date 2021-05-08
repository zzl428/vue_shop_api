const connection = require('../app/database')

const {sqlTotal, deleteByField} = require('../utils/sql')


class GoodsService {
  // 获取商品列表数据
  async goodsList(queryInfo) {
    const {query, pagenum, pagesize} = queryInfo
    let offset = (pagenum - 1) * pagesize
    let sql = ``
    let total = 0
    if(!query) {
      // 获取所有商品
      sql = `SELECT 
            goods_id, goods_name, goods_price, goods_number, goods_weight, 
            add_time, upd_time, hot_number, is_promote, goods_state
            FROM goods LIMIT ${offset}, ${pagesize}`
      let [result] = await connection.query(sql).catch(err => err)
      total = await sqlTotal(`goods`)
      return {
        goods: result,
        total,
        pagenum,
      }
    } else {
      // 获取搜索的商品
      sql = `SELECT 
            goods_id, goods_name, goods_price, goods_number, goods_weight, 
            add_time, upd_time, hot_number, is_promote, goods_state
            FROM goods 
            WHERE goods_name LIKE '%${query}%'
            LIMIT ${offset}, ${pagesize}`
      let [result] = await connection.query(sql).catch(err => err)
      total = result.length
      return {
        goods: result,
        total,
        pagenum,
      }
    }
  }

  // 删除商品
  async removeGoods(id) {
    let result = await deleteByField(`goods`, `goods_id`, id)
    return result
  }

  // 添加商品
  async addGoods(form) {
    const {goods_name, goods_price, goods_weight, goods_number, goods_cat, pics, goods_introduce, attrs} = form
    // goods表
    let sql = `INSERT INTO goods 
            (goods_name, goods_price, goods_number, goods_weight, cat_id, goods_introduce, 
            add_time, upd_time, cat_one_id, cat_two_id, cat_three_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    let add_time = new Date().getTime() / 1000
    let [result] = await connection.execute(sql, [goods_name, goods_price, goods_number, goods_weight, goods_cat[2], 
                                            goods_introduce, add_time, add_time, goods_cat[0], goods_cat[1], goods_cat[2]]
                                            ).catch(err => console.log(err))
    
    // goods_attrs表
    sql = `INSERT INTO goods_attr (goods_id, attr_id, attr_value) VALUES (?, ?, ?)`
    let goods_id = result.insertId
    for(let i of attrs) {
      await connection.execute(sql, [goods_id, i.attr_id, i.attr_value]).catch(err => err)
    }                                      
    
    // goods_pics表
    sql = `INSERT INTO goods_pics (goods_id, pics_big, pics_mid, pics_sma) VALUES (?, ?, ?, ?)`
    for(let i of pics) {
      await connection.execute(sql, [goods_id, i.pic, i.pic ,i.pic]).catch(err => err)
    }

    return `添加商品成功`
  }
}

module.exports = new GoodsService()