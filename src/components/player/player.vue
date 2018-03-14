<template>
  <div class="player" v-show="playList.length > 0">
    <transition name="normal">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img :src="currentSong.image" alt="" width="100%" height="100%">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon iconfont icon-fanhui4"></i>
          </div>
          <h1 class="title">{{currentSong.name}}</h1>
          <h2 class="subtitle">{{currentSong.singer}}</h2>
          <div class="more">
            <i class="icon iconfont icon-gengduo"></i>
          </div>
        </div>
        <div class="middle">
          <div class="middle-l">
            <div class="cd-wrapper">
              <div class="cd" >
                <img :src="currentSong.image" alt="" :class="cdRotate" class="image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">aaaa</div>
            </div>
          </div>
          <div class="middle-r">
            <div class="lyric-wrappe">
              <div>
                <p class="text"></p>
              </div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot">a</span>
            <span class="dot">a</span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{formatTime(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar></progress-bar>
            </div>
            <span class="time time-r">{{formatTime(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon-mode icon-type">
              <i class="icon iconfont icon-suijibofang01"></i>
            </div>
            <div class="icon-pre icon-type">
              <i @click="prev" class="icon iconfont icon-shangyishou"></i>
            </div>
            <div class="icon-play icon-type">
              <i @click="togglePlaying" class="icon iconfont" :class="playIcon"></i>
            </div>
            <div class="icon-next icon-type">
              <i @click="next" class="icon iconfont icon-xiayishou"></i>
            </div>
            <div class="icon-list icon-type">
              <i class="icon iconfont icon-liebiao-copy"></i>
            </div>
          </div>
          <div class="operators2">
            <div class="icon-favorite icon-type">
              <i class="icon iconfont icon-shoucang"></i>
            </div>
            <div class="icon-download icon-type">
              <i class="icon iconfont icon-xiazai"></i>
            </div>
            <div class="icon-share icon-type">
              <i class="icon iconfont icon-fenxiang"></i>
            </div>
            <div class="icon-comment icon-type">
              <i class="icon iconfont icon-iconfontpinglun"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-play" v-show="!fullScreen" @click="openPlayer">
        <div class="icon-image" :class="cdRotate">
          <img :src="currentSong.image" width="40" height="40" alt="">
        </div>
        <div class="text">
          <h2 class="name">{{currentSong.name}}</h2>
          <p class="desc">{{currentSong.singer}}</p>
        </div>
        <div class="control">
          <div>
            <i @click.stop="togglePlaying" class="icon iconfont icon-mini" :class="miniIcon"></i>
          </div>
        </div>
        <div class="control">
          <i class="icon iconfont icon-liebiao-copy"></i>
        </div>
      </div>
    </transition>
    <audio :src="currentSong.url" ref="audio" @play="ready" @error="error" @timeupdate="timeUpdate"></audio>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import ProgressBar from '@/base/progress-bar/progress-bar'
export default {
  data() {
    return {
      songReady: false,
    //   歌曲当前播放时间
      currentTime: 0
    }
  },
  computed: {
    ...mapGetters([
      // 控制播放页面显示或隐藏
      'fullScreen',
      // 控制播放器的渲染 歌曲数
      'playList',
    //   当前歌曲
      'currentSong',
    //   当前歌曲播放状态
      'playing',
    //   当前歌曲索引
      'currentIndex'
    ]),
    // 播放页面 播放按钮切换
    playIcon() {
      return this.playing ? 'icon-pause' : 'icon-bofang1'
    },
    miniIcon() {
      return this.playing ? 'icon-pause' : 'icon-bofang1'
    },
    // 图片旋转
    cdRotate() {
      return this.playing ? 'play' : 'pause'
    }
  },
  watch: {
    currentSong() {
      this.$nextTick(() => {
        this.$refs.audio.play()
      })
    },
    // 监听播放状态
    playing(newPlaying) {
      console.log(newPlaying)
      const audio = this.$refs.audio
      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause()
      })
    }
  },
  methods: {
    // 返回上页
    back() {
      this.setFullScreen(false)
    },
    // 打开播放页面
    openPlayer() {
      this.setFullScreen(true)
    },
    // 播放按钮切换
    togglePlaying() {
      if (!this.songReady) {
        return
      }
      this.setPlayingState(!this.playing)
    },
    // 切换到下一首歌
    next() {
      if (!this.songReady) {
        return
      }
      let index = this.currentIndex + 1
      if (index === this.playList.length) {
        index = 0
      }
      this.setCurrentIndex(index)
    //   若当前歌曲处于暂停状态，切换到下一首歌时歌曲为播放状态
      if (!this.playing) {
        this.togglePlaying()
      }
      this.songReady = false
    },
    // 切换到上一首
    prev() {
      if (!this.songReady) {
        return
      }
      let index = this.currentIndex - 1
      if (index === -1) {
        index = this.playList.length - 1
      }
      this.setCurrentIndex(index)
      //   若当前歌曲处于暂停状态，切换到上一首歌时歌曲为播放状态
      if (!this.playing) {
        this.togglePlaying()
      }
      this.songReady = false
    },
    ready() {
      this.songReady = true
    },
    error() {
      this.songReady = true
    },
    timeUpdate(e) {
    //   console.log(e)
      this.currentTime = e.target.currentTime
    },
    // 时间戳转换
    formatTime(interval) {
        // 向下取整
      interval = interval | 0
      const minute = interval / 60 | 0
      const second = this._pad(interval % 60)
      return `${minute}:${second}`
    },
    _pad(num, n = 2) {
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len ++
      }
      return num
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLSYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX'
    })
  }
}
</script>
<style lang="stylus">
  @import "../../common/stylus/variable";
  .player
    .normal-player
      position fixed
      left 0
      top 0
      right 0
      bottom 0
      z-index 150
      background $color-background
      .background
        position absolute
        left 0
        top 0
        width 100%
        height 100%
        z-index -1
        opacity 0.6
        filter blur(20px)
      .top
        position relative
        margin-bottom .933333rem /* 70/75 */
        .back
          position absolute
          top .266667rem /* 20/75 */
          left .4rem /* 30/75 */
          z-index 50
          .icon-fanhui4
            display block 
            padding .12rem /* 9/75 */
            font-size $font-size-large-x
        .title
          width 70%
          margin 0 auto
          line-height 1.066667rem /* 80/75 */
          font-size $font-size-large
          text-align center
        .subtitle
          line-height .266667rem /* 20/75 */
          text-align center
          font-size $font-size-medium
        .more
          position absolute
          top .266667rem /* 20/75 */
          right .426667rem /* 32/75 */
          z-index 50
          .icon-gengduo
            display block 
            padding .12rem /* 9/75 */
            font-size $font-size-large-x
      .middle
        position fixed
        width 100%
        top 2.266667rem /* 170/75 */
        bottom 6rem /* 450/75 */
        white-space nowrap
        font-size 0
        .middle-l
          display inline-block
          vertical-align top
          position relative
          width 100%
          height 0
          padding-top 80%
          .cd-wrapper
            position absolute
            left 10%
            top 0
            width 80%
            height 100%
            .cd
              width 100%
              height 100%
              box-sizing border-box
              border 10px solid rgba(255, 255, 255, 0.1)
              border-radius 50%
              .image
                position absolute
                left 0
                top 0
                width 100%
                height 100%
                border-radius 50%
                box-sizing border-box
                border 10px solid rgba(255, 255, 255, 0.1)
                &.play
                  animation rotate 20s linear infinite 
                &.puase
                  animation-play-state paused
          .playing-lyric-wrapper
            width 80%
            margin .4rem auto 0 auto 
            overflow hidden
            text-align center
            .playing-lyric
              height .533333rem /* 40/75 */
              line-height .533333rem /* 40/75 */
              font-size: $font-size-medium 
        .middle-r
          display inline-block
          vertical-align top
          width 100%
          height 100%
          overflow hidden
          .lyric.wrapper
            width 80%
            margin 0 auto 
            overflow hidden
            text-align center
            .text
              line-height .853333rem /* 64/75 */
              font-size $font-size-medium
      .bottom
        position absolute
        bottom .666667rem /* 50/75 */
        width 100%
        top 65%
        .dot-wrapper
          text-align center
          font-size 0
          .dot
            display inline-block
            vertical-align middle
            margin 0 .106667rem /* 8/75 */
            width .213333rem /* 16/75 */
            height .213333rem /* 16/75 */
            border-radius 50%
            background: $color-text-l
            &.active
              background: $color-text-ll
        .progress-wrapper
          display flex
          align-items center
          width 80%
          margin 0 auto
          padding .266667rem 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
            .progress-bar-wrapper
              flex: 1
        .operators
          display flex
          align-items center 
          margin-top .293333rem /* 22/75 */
          .icon-type
            flex 1
            height 1.493333rem /* 112/75 */
            line-height 1.493333rem /* 112/75 */
            text-align center
            .icon
              font-size 40px
              text-align center
              color $color-icon
              &.icon-suijibofang01
                font-size 30px
                color $color-text
              &.icon-pause
                font-size 60px
              &.icon-bofang1
                font-size 52px
              &.icon-liebiao-copy
                font-size 30px
                color $color-text
        .operators2
          display flex
          align-items center 
          margin-top .293333rem /* 22/75 */
          .icon-type
            flex 1
            height 1.493333rem /* 112/75 */
            line-height 1.493333rem /* 112/75 */
            text-align center
            .icon
              font-size 30px
      &.normal-enter-active, &.normal-leave-active
        transition all 0.4s
        .top, .bottom
          transition all 0.4 cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity 0
        .top
          transform translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-play
      position fixed
      left 0
      bottom 0
      z-index 160
      width 100%
      height 1.6rem /* 120/75 */
      background #202330
      display flex
      align-items center
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon-image
        flex 0 0 .933333rem
        width .933333rem /* 70/75 */
        padding 0 .266667rem 0 .266667rem 
        img
          border-radius 50%
          &.play
            animation rotate 20s linear infinite 
          &.puase
            animation-play-state paused
      .text
        display flex
        flex-direction column
        justify-content center
        flex 1
        line-height .533333rem /* 40/75 */
        overflow hidden
        .name
          margin-bottom .026667rem /* 2/75 */
          font-size $font-size-medium
        .desc
          font-size $font-size-small
          color $color-text-d
      .control
        flex 0 0 .8rem /* 60/75 */
        width .8rem /* 60/75 */
        padding 0 .333333rem /* 25/75 */
        .icon-liebiao-copy, .icon-pause
          font-size: 30px
          color: $color-icon
        .icon-bofang1
          font-size: 26px
          color: $color-icon
  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)

</style>
