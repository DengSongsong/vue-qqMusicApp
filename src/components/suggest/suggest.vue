<template>
  <scroll class="suggest" :data="result">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="item in result" :key="item.index">
        <div class="icon">
          <i :class="getIconCls(item)" class="icon iconfont"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
    </ul>
  </scroll>  
</template>
<script>
import Scroll from '@/base/scroll/scroll'
import { search } from '@/api/search'
import { ERR_OK } from '@/api/config'
import { filterSinger } from '@/common/js/song'
import {createSong } from '@/common/js/song'
const TYPE_SINGER = 'singer'
const perpage = 20
export default {
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      page: 1,
      result: []
    }
  },
  methods: {
    search() {
      search(this.query, this.page, this.showSinger, perpage).then((res) => {
        if (res.code === ERR_OK) {
          this.result = this._genResult(res.data)
          console.log(this.result)
        }
      })
    },
    _genResult(data) {
      let ret = []
      if (data.zhida && data.zhida.singerid) {
        ret.push({...data.zhida, ...{type: TYPE_SINGER}})
      }
      if (data.song) {
        ret = ret.concat(this._normalizeSongs(data.song.list))
      }
      // console.log(ret)
      return ret
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach(musicData => {
        if (musicData.songid && musicData.albumid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
    getIconCls(item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-geshou'
      } else {
        return 'icon-liebiao-copy'
      }
    },
    getDisplayName(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.name}-${item.singer}`
      }
    }
  },
  watch: {
    query(newQuery) {
      if (!newQuery) {
        return
      }
      this.search(newQuery)
    }
  },
  components: {
    Scroll
  }
}
</script>
<style lang="stylus">
  @import "../../common/stylus/variable"
  .suggest
    height 100%
    overflow hidden
    .suggest-list
      padding 0 .4rem /* 30/75 */
      .suggest-item
        display flex
        align-items center
        padding-bottom .533333rem /* 40/75 */
      .icon
        flex 0 0 .8rem /* 60/75 */
        width .8rem /* 60/75 */
        [class^="icon-"]
          font-size 14px
          color $color-text-m
      .name
        flex 1
        font-size $font-size-medium
        color: $color-text-m
        overflow: hidden
        .text
          no-wrap()
</style>
