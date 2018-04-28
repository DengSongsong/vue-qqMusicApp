import Vue from 'vue'
import Router from 'vue-router'
import Mine from '@/components/mine/mine'
import MusicHall from '@/components/musicHall/musicHall'
import Find from '@/components/find/find'
import Singer from '@/components/singer/singer'
import Rank from '@/components/rank/rank'
import SongList from '@/components/song-list/song-list'
import RadioStation from '@/components/radio-station/radio-station'
import Video from '@/components/video/video'
import SingerDetail from '@/components/singer-detail/singer-detail'
import Disc from '@/components/disc/disc'
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
      component: MusicHall,
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      path: '/find',
      component: Find
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/rank',
      component: Rank
    },
    {
      path: '/video',
      component: Video
    },
    {
      path: '/songList',
      component: SongList
    },
    {
      path: '/radioStation',
      component: RadioStation
    }
  ]
})
