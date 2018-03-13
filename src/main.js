// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyload from 'vue-lazyload'
import store from './store'
import 'lib-flexible/flexible'
import 'normalize.css/normalize.css'

import '@/common/stylus/index.styl'

Vue.use(VueLazyload, {
  loading: require('../src/common/image/default_pic.jpg')
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
