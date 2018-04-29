<template>
  <div class="singer" ref="singer">
    <div class="list-header">
      <span class="icon iconfont icon-fanhui"></span>
      <span class="list-title">歌手</span>
      <span class="icon iconfont icon-iconfontzhizuobiaozhun22"></span>
    </div>
    <list-view :data="singers" @select="selectSinger" ref="list"></list-view>
    <router-view></router-view>
  </div>
</template>
<script>
import ListView from '@/base/list-view/list-view'
import { getSingerList } from '@/api/singer'
import { ERR_OK } from '@/api/config'
import Singer from '@/common/js/singer'
import {mapMutations} from 'vuex'
import { playlistMixin } from '@/common/js/mixin'
const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10
export default {
  mixins: [playlistMixin],
  data() {
    return {
      singers: []
    }
  },
  created() {
    this._getSingerList()
  },
  methods: {
    handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.singer.style.bottom = bottom
        this.$refs.list.refresh()
    },
    // 歌手详情页跳转  子路由跳转
    selectSinger(singer) {
      // console.log(singer)
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      this.setSinger(singer)
    },
    // 获取歌手列表
    _getSingerList() {
      getSingerList().then(res => {
        if (res.code === ERR_OK) {
          this.singers = this._normalizeSinger(res.data.list)
          // console.log(this.singers)
        }
      })
    },
    // 规范歌手列表，两类数据：一是热门数据、二是按照a-z排列
    _normalizeSinger(list) {
      let map = {
        hot: { //热门歌手列表
          title: HOT_NAME,
          items: []
        }
      }
      // 遍历所有歌手
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          // 热门歌手信息存入数组，10条
          map.hot.items.push(new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          }))
        }
        // 按字母分类
        const key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        // 按字母分类，分别存入各自数组
        map[key].items.push(new Singer({
          name: item.Fsinger_name,
          id: item.Fsinger_mid
        }))
      })
      // console.log(map);
      // return map
      // 按a-z排序
      let ret = []
      let hot = []
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-z]/)) {
          ret.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  },
  components: {
    ListView
  }
}
</script>
<style lang="stylus">
  @import "../../common/stylus/variable"
  .singer
    position fixed
    width 100%
    top 0
    bottom 0
    background: $color-background
    .list-header
      padding .24rem .266667rem 0 .4rem 
      display flex
      justify-content space-between
      line-height .533333rem /* 40/75 */
      font-size 0
      .icon, .list-title
        font-size $font-size-large
</style>
