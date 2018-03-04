import Vue from 'vue'
import Router from 'vue-router'
import Mine from '@/components/mine/mine'
import MusicHall from '@/components/musicHall/musicHall'
import Find from '@/components/find/find'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/musicHall'
    },
    {
      path: '/mine',
      component: Mine
    },
    {
      path: '/musicHall',
      component: MusicHall
    },
    {
      path: '/find',
      component: Find
    }
  ]
})
