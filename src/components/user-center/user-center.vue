<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back" @click="back">
        <i class="icon iconfont icon-fanhui"></i>
      </div>
      <div class="switches-wrapper">
        <switches @switch="switchItem" :switches="switches" :currentIndex="currentIndex"></switches>
      </div>
      <div class="play-btn">
        <i class="icon iconfont icon-bofang1"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <scroll ref="favoriteList" class="list-scroll" v-if="currentIndex===0" :data="favoriteList">
          <div class="list-inner">
            <song-list :songs="favoriteList" :playFlag="playFlag" @select="selectSong"></song-list>
          </div>
        </scroll>
        <scroll ref="playList" class="list-scroll" v-if="currentIndex===1" :data="playHistory">
          <div class="list-inner">
            <song-list :songs="playHistory" :playFlag="playFlag" @select="selectSong"></song-list>
          </div>
        </scroll>
      </div>
      <div class="no-result-wrapper" v-show="noResult">
        <no-result :title="noResultDesc"></no-result>
      </div>
    </div>
  </transition>
</template>
<script>
import Switches from '@/base/switches/switches'
import Scroll from '@/base/scroll/scroll'
import SongList from '@/base/song-list/song-list'
import NoResult from '@/base/no-result/no-result'
import { playlistMixin } from '@/common/js/mixin'
import { mapGetters, mapActions } from 'vuex'
export default {
  mixins: [playlistMixin],
  data() {
    return {
      currentIndex: 0,
      switches: [
        {
          name: '我喜欢的'
        },
        {
          name: '最近听的'
        }
      ],
      playFlag: false
    }
  },
  computed: {
    noResult() {
      if (this.currentIndex === 0) {
        return !this.favoriteList.length
      } else {
        return !this.playHistory.length
      }
    },
    noResultDesc() {
      if (this.currentIndex === 0) {
        return '暂无收藏歌曲'
      } else {
        return '你还没有听过歌曲'
      }
    },
    ...mapGetters([
      'favoriteList',
      'playHistory'
    ])
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.listWrapper.style.bottom = bottom
      this.$refs.favoriteList && this.$refs.favoriteList.refresh()
      this.$refs.playList && this.$refs.playList.refresh()
    },
    switchItem(index) {
      this.currentIndex = index
    },
    selectSong(song) {
      this.insertSong(song)
    },
    back() {
      this.$router.back()
    },
    random() {
      let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory
      if (list.length === 0) {
        return
      }
      this.randomPlay({
        list
      })
    },
    ...mapActions([
      'insertSong',
      'randomPlay'
    ])
  },
  components: {
    Switches,
    Scroll,
    SongList,
    NoResult
  }
}
</script>
<style lang="stylus">
  @import "../../common/stylus/variable"
  .user-center
    position fixed
    top 0
    bottom 0
    z-index 100
    width 100%
    background $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .back
      position absolute
      top 0
      left .16rem /* 12/75 */
      z-index 50
      .icon-fanhui
        display block
        padding .266667rem /* 20/75 */
        font-size $font-size-large-x
        color $color-text
    .switches-wrapper
      margin .266667rem /* 20/75 */0 .8rem /* 60/75 */0
    .play-btn
      box-sizing border-box
      width 3.6rem /* 270/75 */
      padding .186667rem 0
      margin 0 auto
      text-align center
      border 1px solid $color-text-l
      border-radius 2.666667rem /* 200/75 */
      font-size: 0
      .icon-bofang1
        display inline-block
        vertical-align middle
        margin-right .16rem /* 12/75 */
        font-size $font-size-medium-x
      .text
        display inline-block
        vertical-align middle
        font-size $font-size-small
    .list-wrapper
      position absolute
      top 2.933333rem /* 220/75 */
      bottom 0
      width 100%
      .list-scroll
        height 100%
        overflow hidden
        .list-inner
          padding .533333rem /* 40/75 */.8rem /* 60/75 */
      .no-result
        position absolute
        width 100%
        top 50%
        transform translateY(-50%)
</style>
