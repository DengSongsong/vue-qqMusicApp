/**
 * @method hasClass 判断dom元素是否有class
 * @param {Object} el 
 * @param {String} className 
 * @returns {Boolean}
 */
export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}
/**
 * @description 应用于slider组件
 * @method addClass 向dom元素添加class
 * @param {Object} el 
 * @param {String} className 
 * @returns {String}
 */
export function addClass(el, className) {
  if (hasClass(el, className)) {
    return
  }
  
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

export function getData(el, name, val) {
  const prefix = 'data-'
  if (val) {
    return el.setAttribute(prefix + name, val)
  } else {
    return el.getAttribute(prefix + name)
  }
}