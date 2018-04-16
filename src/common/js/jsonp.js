import originJsonp from 'jsonp'

/**
 * @method jsonp 使用promise对原始jsonp封装
 * @param {String} url 数据路径
 * @param {String} data 数据参数
 * @param {Object} option 
 * @returns {Object} 
 */
export default function jsonp(url, data, option) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
  return new Promise((resolve, reject) => {
    originJsonp(url, option, (err, data) => {
      if(!err) {
        resolve(data)
      } else {
        reject(err)
      }      
    })
  })
}

/**
 * @method param url参数拼接
 * @param {Object} data url参数
 * @returns {String}
 */
export function param(data) {
  let url = ''
  for(let k in data) {
    let value = data[k] !== undefined ? data[k] : ''
    url += '&' + k + '=' + encodeURIComponent(value)
  }
  return url ? url.substring(1) : ''
}