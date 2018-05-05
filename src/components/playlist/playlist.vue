<template>
  <transition name="list-fade">
    <div class="playlist" @click="hide" v-show="showFlag">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon iconfont" :class="iconMode" @click="changeMode"></i>
            <span class="text">{{modeText}}</span>
            <span class="clear" @click="showConfirm">
              <i class="icon iconfont icon-shanchu1"></i>
            </span>
          </h1>
        </div>
        <scroll :refreshDelay="refreshDelay" ref="listContent" class="list-content" :data="sequenceList">
          <transition-group name="list" tag="ul">
            <li ref="listItem" class="item" v-for="(item, index) in sequenceList" :key="index" @click="selectItem(item,index)">
              <i class="current icon iconfont" :class="getCurrentIcon(item)"></i>
              <span class="text" v-html="item.name"></span>
              <span class="like" @click.stop="toggleFavorite(item)">
                <i class="icon iconfont icon-shoucang" :class="getFavoriteIcon(item)"></i>
              </span>
              <span class="delete" @click.stop="deleteOne(item)">
                <i class="icon iconfont icon-shanchu"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div class="add" @click="addSong">
            <i class="icon iconfont icon-jia"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirm" @confirm="confirmClear" text="是否清空播放列表" confirmBtnText="清空"></confirm>
      <add-song ref="addSong"></add-song>
    </div>
  </transition>  
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { playMode } from '@/common/js/config'
import Scroll from '@/base/scroll/scroll'
import Confirm from '@/base/confirm/confirm'
import AddSong from '@/components/add-song/add-song'
import { playerMixin } from '@/common/js/mixin'
export default {
  mixins: [playerMixin],
  data() {
    return {
      showFlag: false,
      refreshDelay: 120
    }
  },
  computed: {
    modeText() {
      return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.random ? '随机播放' : '单曲循环'
    },
    ...mapGetters([
      'sequenceList',
      'currentSong',
      'playList',
      // 'mode'
    ])
  },
  methods: {
    show() {
      this.showFlag = true
      setTimeout(() => {
        this.$refs.listContent.refresh()
        this.scrollToCurrent(this.currentSong)
      }, 20)
    },
    hide() {
      this.showFlag = false
    },
    getCurrentIcon(item) {
      if (this.currentSong.id === item.id) {
        return 'icon-bofang'
      }
      return ''
    },
    selectItem(item, index) {
      if (this.mode === playMode.mode) {
        index = this.playList.findIndex((song) => {
          return song.id === item.id
        })
        this.setCurrentIndex(index)
        this.setPlayingState(true)
      }
    },
    scrollToCurrent(current) {
      const index = this.sequenceList.findIndex((song) => {
        return current.id === song.id
      })
      this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 300)
    },
    deleteOne(item) {
      this.deleteSong(item)
      if (!this.playList.length) {
        this.hide()
      }
    },
    showConfirm() {
      this.$refs.confirm.show()
    },
    confirmClear() {
      this.deleteSongList()
      this.hide()
    },
    addSong() {
      this.$refs.addSong.show()
    },
    ...mapMutations({
      'setCurrentIndex': 'SET_CURRENT_INDEX',
      'setPlayingState': 'SET_PLSYING_STATE'
    }),
    ...mapActions([
      'deleteSong',
      'deleteSongList'
    ])
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (!this.showFlag || newSong.id === oldSong.id) {
        return
      }
      setTimeout(() => {
        this.scrollToCurrent(newSong)
      }, 20)
    }
  },
  components: {
    Scroll,
    Confirm,
    AddSong
  }
}
</script>
<style lang="stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"
  .playlist
    position fixed
    left 0
    right 0
    top 0
    bottom 0
    z-index 200
    background-color $color-background-d
    &.list-fade-enter-active, &.list-fade-leave-active
      transition opacity 0.3s
      .list-wrapper
        transition all 0.3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity 0
      .list-wrapper
        transform translate3d(0, 100%, 0)
    &.list-fade-enter
    .list-wrapper
      position absolute
      left 0
      bottom 0
      width 100%
      background-color $color-highlight-background
      .list-header
        position relative
        padding .533333rem /* 40/75 */.8rem /* 60/75 */.266667rem /* 20/75 */.533333rem /* 40/75 */
        .title
          display flex
          align-items center
          .icon
            margin-right .266667rem /* 20/75 */
            font-size 30px
            color $color-theme-d
          .text
            flex 1
            font-size $font-size-medium
            color $color-text-l
          .clear
            extend-click()
            .icon-shanchu1
              font-size $font-size-medium
              columns $color-text-d
      .list-content
        max-height 6.4rem /* 480/75 */
        overflow hidden
        .item
          display flex
          align-items center
          height 1.066667rem /* 80/75 */
          padding 0 .8rem /* 60/75 */0 .533333rem /* 40/75 */
          overflow hidden
          &.list-enter-active, &.list-leave-active
            transition all 0.1s
          &.list-enter, &.list-leave-to
            height 0
          .current
            flex 0 0 .533333rem /* 40/75 */
            width .533333rem /* 40/75 */
            font-size $font-size-small
            color $color-theme-d
          .text
            flex 1
            no-wrap()
            font-size $font-size-medium
            color $color-text-d
          .like
            extend-click()
            margin-right .4rem /* 30/75 */
            // font-size $font-size-small
            // color $color-theme
            .icon-shoucang
              color $color-text-d
              &.current
                color: $color-theme
                font-size 16px
          .delete
            extend-click()
            font-size $font-size-small
            color $color-text-d
      .list-operate
        width 3.733333rem /* 280/75 */
        margin .533333rem /* 40/75 */auto .8rem /* 60/75 */ auto
        .add
          display flex
          align-items center
          padding .213333rem /* 16/75 */.426667rem /* 32/75 */
          border 1px solid $color-text-l
          border-radius 2.666667rem /* 200/75 */
          color $color-text-l
          .icon-jia
            margin-right .133333rem /* 10/75 */
            font-size $font-size-small-s
          .text
            font-size $font-size-small
      .list-close
        text-align center
        line-height 1.333333rem /* 100/75 */
        background $color-background
        font-size $font-size-medium-x
        color $color-text-l
</style>
