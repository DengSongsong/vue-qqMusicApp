/**
 *  音乐馆页面 请求数据
 */

import jsonp from '@/common/js/jsonp'
import {commonParams, options} from './config'

/**
 * @method getMusicHall 获取音乐馆数据的方法
 * @returns {Object}
 */
export function getMusicHall() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  const data = Object.assign({}, commonParams, {
    paltform: 'h5',
    uin: 0,
    needNewCode: 1
  })
  return jsonp(url, data, options)
}