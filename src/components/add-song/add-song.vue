<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <i class="icon iconfont icon-shanchu"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box2 ref="searchBox" @query="onQueryChange" placeholder="搜索歌曲"></search-box2>
      </div>
      <div class="shortcut" v-show="!query">
        <switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
        <div class="list-wrapper">
          <scroll ref="songList" v-if="currentIndex===0" class="list-scroll" :data="playHistory">
            <div class="list-inner">
              <song-list :songs="playHistory" @select="selectSong"></song-list>
            </div>
          </scroll>
          <scroll :refreshDelay="refreshDelay" ref="searchList" v-if="currentIndex===1" class="list-scroll" :data="searchHistory">
            <div class="list-inner">
              <search-list @delete="deleteSearchHistory" @select="addQuery" :searches="searchHistory"></search-list>
            </div>
          </scroll>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <suggest :query="query" :showSinger="showSinger" @select="selectSuggest" @listScroll="blurInput"></suggest>
      </div>
      <top-tip ref="topTip">
        <div class="tip-title">
          <i></i>
          <span class="text">1首歌曲已经添加到播放列表</span>
        </div>
      </top-tip>
    </div>
  </transition>  
</template>
<script>
import SearchBox2 from '@/base/search-box2/search-box2' 
import Suggest from '@/components/suggest/suggest'
import Switches from '@/base/switches/switches'
import Scroll from '@/base/scroll/scroll'
import SongList from '@/base/song-list/song-list'
import SearchList from '@/base/search-list/search-list'
import TopTip from '@/base/top-tip/top-tip'
import { searchMixin } from '@/common/js/mixin'
import { mapGetters, mapActions } from 'vuex'
import Song from '@/common/js/song'
export default {
  mixins: [searchMixin],
  data() {
    return {
      showFlag: false,
      // query: '',
      showSinger: false,
      switches: [
        {
          name: '最近播放'
        },
        {
          name: '搜索历史'
        }
      ],
      currentIndex: 0
    }
  },
  computed: {
    ...mapGetters([
      'playHistory'
    ])
  },
  methods: {
    show() {
      this.showFlag = true
      this.refreshList()
    },
    hide() {
      this.showFlag = false
    },
    refreshList() {
      setTimeout(() => {
        if (this.currentIndex === 0) {
          this.$refs.songList.refresh()
        } else {
          this.$refs.searchList.refresh()
        }
      })
    },
    selectSuggest() {
      this.$refs.topTip.show()
      this.saveSearch()
    },
    switchItem(index) {
      this.currentIndex = index
    },
    selectSong(song, index) {
      if (index !== 0) {
        this.insertSong(new Song(song))
        this.$refs.topTip.show()
      }
    },
    ...mapActions([
      'insertSong'
    ])
  },
  components: {
    SearchBox2,
    Suggest,
    Switches,
    Scroll,
    SongList,
    SearchList,
    TopTip
  }
}
</script>
<style lang="stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"
  .add-song
    position fixed
    top 0
    bottom 0
    width 100%
    z-index 200
    background $color-background
    &.slide-enter-active, &.slide-leave-active
      transition all 0.3s
    &.slide-enter, &.slide-leave-to
      transform translate3d(100%, 0, 0)
    .header
      position relative
      height 1.173333rem /* 88/75 */
      text-align center
      .title
        line-height 1.173333rem /* 88/75 */
        font-size $font-size-large
        color $color-text
      .close
        position absolute
        top 0
        right .213333rem /* 16/75 */
        .icon-shanchu
          display block
          padding .32rem /* 24/75 */
          font-size 20px
          color $color-text-m
    .search-box-wrapper
      margin .266667rem /* 20/75 */
    .shortcut
      .list-wrapper
        position absolute
        top 4.4rem /* 330/75 */
        bottom 0
        width 100%
        .list-scroll
          height 100%
          overflow hidden
          .list-inner
            padding .533333rem /* 40/75 */.8rem /* 60/75 */
    .search-result
      position fixed
      top 3.306667rem /* 248/75 */
      bottom 0
      width 100%
    .tip-title
      text-align center
      padding .48rem /* 36/75 */0
      font-size 0
      .icon-ok
        font-size $font-size-medium
        color $color-theme
        margin-right .106667rem /* 8/75 */
      .text
        font-size $font-size-medium
        color $color-text
</style>
