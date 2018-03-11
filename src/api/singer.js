import jsonp from '@/common/js/jsonp'
import {commonParams, options} from './config'

export function getSingerList() {
  const url = 'https://shc.y.qq.com/v8/fcg-bin/v8.fcg'
  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 0,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    g_tk: 591145959,
    platform: 'yqq'
  })
  return jsonp(url, data, options)
}