<template>
  <div class="player" v-show="playList.length > 0">
    <transition name="normal">
      <!-- 展开的播放器 -->
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img :src="currentSong.image" alt="" width="100%" height="100%">
        </div>
        <!-- 头部 标题以及返回按钮-->
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
        <!-- 中间部分 唱片&歌词 -->
        <div  class="middle" 
              @touchstart.prevent="middleTouchStart"
              @touchmove.prevent="middleTouchMove"
              @touchend="middleTouchEnd"
        >
        <!-- 唱片页面 -->
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper">
              <div class="cd">
                <img :src="currentSong.image" alt="" :class="cdRotate" class="image">
              </div>
            </div>
            <!-- 唱片底部小歌词 -->
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <!-- 歌词滚动组件 初始化时候currentLyric是Null 所以需要判断一下-->
          <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p class="text" :class="{'current': currentLineNum === index}" ref="lyricLine" v-for="(line,index) in currentLyric.lines" :key="index">
                  {{line.txt}}
                </p>
              </div>
            </div>
          </scroll>
        </div>
        <!-- 底部按钮 操作 -->
        <div class="bottom">
          <!-- 左右切换点 -->
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow==='cd'}"></span>
            <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
          </div>
          <!-- 取整当前播放的时长 -->
          <div class="progress-wrapper">
            <span class="time time-l">{{formatTime(currentTime)}}</span>
             <!-- 进度条 -->
            <div class="progress-bar-wrapper">
              <!-- percentChange 监听基础组件派发出来的进度条轨迹 -->
              <progress-bar :timePercent="timePercent" @percentChange="onProgressBarChange"></progress-bar>
            </div>
             <!-- 确证歌曲总时长 -->
            <span class="time time-r">{{formatTime(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <!-- 切换模式 -->
            <div class="icon-mode icon-type" @click="changeMode">
              <i class="icon iconfont icon-suijibofang01" :class="iconMode"></i>
            </div>
            <!-- 上一首 -->
            <div class="icon-pre icon-type">
              <i @click="prev" class="icon iconfont icon-shangyishou"></i>
            </div>
            <!-- 播放暂停 -->
            <div class="icon-play icon-type">
              <i @click="togglePlaying" class="icon iconfont" :class="playIcon"></i>
            </div>
            <!-- 下一首 -->
            <div class="icon-next icon-type">
              <i @click="next" class="icon iconfont icon-xiayishou"></i>
            </div>
            <div class="icon-list icon-type">
              <i class="icon iconfont icon-liebiao-copy"></i>
            </div>
          </div>
          <div class="operators2">
            <!-- 收藏 -->
            <div class="icon-favorite icon-type">
              <i @click="toggleFavorite(currentSong)" class="icon iconfont icon-shoucang" :class="favoriteIcon"></i>
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
    <!-- 收起的播放器 -->
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
          <!-- 利用SVG实现圆形进度条 把大小和当前播放的时间传递进去-->
          <progress-circle :radius="radius" :timePercent="timePercent">
            <!-- .stop 因为父元素有点击事件 所以添加stop阻止冒泡 -->
            <i @click.stop="togglePlaying" class="icon iconfont icon-mini" :class="miniIcon"></i>
          </progress-circle>
        </div>
        <div class="control" @click.stop="showPlaylist">
          <i class="icon iconfont icon-liebiao-copy"></i>
        </div>
      </div>
    </transition>
    <!-- 歌曲列表 -->
    <playlist ref="playlist"></playlist>
     <!-- @error 从加载到加载失败的钩子函数 -->
     <!-- @ended 歌曲播放完成 -->
    <audio :src="currentSong.url" ref="audio" @play="ready" @error="error" @timeupdate="timeUpdate" @ended="end"></audio>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import ProgressBar from '@/base/progress-bar/progress-bar' // 进度条
import ProgressCircle from '@/base/progress-circle/progress-circle' // 圆形进度条
import { playMode } from '@/common/js/config' // 播放模式
// import { shuffle } from '@/common/js/utils'
import Lyric from 'lyric-parser' // 获取歌词解析器
import Scroll from '@/base/scroll/scroll' // 使用scroll组件使得歌曲可以滚动
import Playlist from '@/components/playlist/playlist' // 歌曲列表
import { playerMixin } from '@/common/js/mixin' // 模式公共模块
export default {
  mixins: [playerMixin],
  data() {
    return {
      songReady: false, // 判断歌曲是否加载完成
      currentTime: 0, // 歌曲当前播放时间
      radius: 32, // 小mini进度条大小
      currentLyric: null, // 歌词
      currentLineNum: 0, // 当前歌词所在解析器中第几行
      currentShow: 'cd', // 左右切换界面
      playingLyric: '' // cd页面歌词
    }
  },
  computed: {
    ...mapGetters([
      // 控制播放页面显示或隐藏
      'fullScreen',
      // 控制播放器的渲染 歌曲数
      // 'playList',
    //   当前歌曲
      // 'currentSong',
    //   当前歌曲播放状态
      'playing',
    //   当前歌曲索引
      'currentIndex',
      // 播放模式
      // 'mode',
      // 'sequenceList',
    ]),
    // 播放页面 播放按钮切换
    playIcon() {// 根据this.playing改变播放按钮icon
      return this.playing ? 'icon-pause' : 'icon-bofang1'
    },
    miniIcon() {
      return this.playing ? 'icon-pause' : 'icon-bofang1'
    },
    // CD图片旋转
    cdRotate() {
      return this.playing ? 'play' : 'play pause'
    },
    // 歌曲播放时间比例
    timePercent() {
      return this.currentTime / this.currentSong.duration
    },
    // iconMode() {
    //   return this.mode === playMode.sequence ? 'icon-xunhuanbofang' : this.mode === playMode.loop ? 'icon-danquxunhuan' : 'icon-suijibofang01'
    // }
  },
  created() {
    // 这个对象用于存储左右滑动时的信息
    this.touch = {}
  },
  watch: {
    currentSong(newSong, oldSong) { //在currentSong变化时执行播放 在currentSong变化时执行播放，注意在dom ready后才能执行play方法
      if(!newSong.id || newSong.id === oldSong.id) {
        return
      }
      //lyricBug:修复切歌时歌词跳动BUG，实际上是在歌词改变前清除旧的定时器
      if (this.currentLyric) {
        this.currentLyric.stop()
      }
      this.$nextTick(() => {
        this.$refs.audio.play()
      })
      // 歌词
      this._getLyric()
      // this.currentSong.getLyric()
      // console.log(this.currentSong)
      // console.log(this.currentSong.getLyric())
    },
    // 监听播放状态
    playing(newPlaying) {
      // console.log(newPlaying)
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
      // 点击提交mutations改变playing状态，通过watch这个playing的状态来播放暂停歌曲
      this.setPlayingState(!this.playing)
      // lyricBug：修复歌曲暂停是歌词继续滚动BUG
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    // 切换到下一首歌
    next() {
      // 歌曲未加载完毕 禁止跳转
      if (!this.songReady) {
        return
      }
      //特殊情况：如果不判断则不能watch到currentSong的变化
      // 如果播放列表只有一条数据 切换成单曲循环
      if (this.playList.length === 1) {
        this.loop()
        return
      } else {
        let index = this.currentIndex + 1
        // 判断是否到了最后一首歌
        if (index === this.playList.length) {
          index = 0 // 顺序播放 最后一首歌就返回第一首歌的下标
        }
        // 根据下标切换歌曲
        this.setCurrentIndex(index)
        //   若当前歌曲处于暂停状态，切换到下一首歌时歌曲为播放状态
        if (!this.playing) {
          this.togglePlaying()
        }
      } 
      // 已经点击过一次下一首歌 设置songReady回默认值
      this.songReady = false
    },
    // 切换到上一首
    prev() {
      if (!this.songReady) {
        return
      }
      //特殊情况：如果不判断则不能watch到currentSong的变化
      if (this.playList.length === 1) {
        this.loop()
        return
      } else {
        let index = this.currentIndex - 1
        if (index === -1) {
          index = this.playList.length - 1
        }
        this.setCurrentIndex(index)
        //   若当前歌曲处于暂停状态，切换到上一首歌时歌曲为播放状态
        if (!this.playing) {
          this.togglePlaying()
        }
      }
      this.songReady = false
    },
    ready() {
      this.songReady = true
      this.savePlayHistory(this.currentSong)
    },
    //防止加载歌曲出错时播放器挂起
    error() {
      this.songReady = true
    },
    // 当前歌曲播放事件进度
    timeUpdate(e) {
      // console.log(e)
      this.currentTime = e.target.currentTime
      // console.log(this.currentTime)
    },
    // 时间戳转换 把时间统一变为两位数
    formatTime(interval) {
        // 向下取整
      interval = interval | 0
      const minute = interval / 60 | 0
      const second = this._pad(interval % 60)
      return `${minute}:${second}`
    },
    // 把时间统一变为两位数
    _pad(num, n = 2) {
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len ++
      }
      return num
    },
    // 接收progress组件派发的拉动进度条事件，这时改变歌曲播放进度
    onProgressBarChange(percent) {
      const currentTime = this.currentSong.duration * percent
      this.$refs.audio.currentTime = currentTime
      // 拖动进度条时如果歌曲是暂停的，那么还是可以播放
      if (!this.playing) {
        this.togglePlaying()
      }
      // lyricBug: 修复拉动进度条时歌词不跟随BUG
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
      }
    },
    // 点击按钮改变播放模式，提交mutations
    // changeMode() {
    //   let nextMode = (this.mode + 1) % 3
    //   this.setPlayMode(nextMode)
    //   let list = []
    //   if (this.mode === playMode.random) {// 随机播放打乱播放列表
    //     list = shuffle(this.sequenceList)
    //   } else { //顺序播放
    //     list = this.sequenceList
    //   }
    //   // 改变歌曲顺序前先重设当前歌曲索引
    //   this.stayCurrentIndex(list)
    //   // 提交mutation改变歌曲顺序
    //   this.setPlayList(list)
    // },
    // 改变播放模式时当前播放歌曲索引发生变化，需要重设索引防止播放列表不可控制
    // stayCurrentIndex(list) {
    //   // findIndex是es6的数组方法，返回数组中满足条件的第一个元素的索引
    //   let stayIndex = list.findIndex(item => {
    //     return item.id === this.currentSong.id
    //   })
    //   this.setCurrentIndex(stayIndex)

    // },
    // 歌曲播放结束时的逻辑
    end() {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next()
      }
    },
    loop() {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      if (this.currentLyric) {
        this.currentLyric.seek(0)
      }
    },
    // 歌词
    _getLyric() {
      this.currentSong.getLyric().then((lyric) => {
        //lyricBug:修复快速切歌歌词错乱
        if (this.currentSong.lyric !== lyric) {
          return
        }
        // 创建歌词实例
        this.currentLyric = new Lyric(lyric, this.handleLyric)
        // console.log(this.currentLyric)
        if (this.playing) {
          this.currentLyric.play()
        }
      }).catch(() => {
        this.currentLyric = null
        this.currentLineNum = 0
      })
      // this.currentSong.getLyric()
      // console.log(this.currentSong)
    },
    // 歌词改变时调用这个回调，lineNum表示当前歌词所在行数
    handleLyric({lineNum, txt}) {
      // 根据设置当前行 高亮
      this.currentLineNum = lineNum
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5]
        this.$refs.lyricList.scrollToElement(lineEl, 1000)
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
      this.playingLyric = txt
    },
    // 切换cd与歌词
    middleTouchStart(e) {
      this.touch.initiated = true
      // 用来判断是否一次移动
      this.touch.moved = false
      const touch = e.touches[0]
      this.touch.startX = touch.pageX
      this.touch.startY = touch.pageY
    },
    middleTouchMove(e) {
      if (!this.touch.initiated) {
        return
      }
      const touch = e.touches[0]
      const deltaX = touch.pageX - this.touch.startX
      const deltaY = touch.pageY - this.touch.startY
      // 纵向滚动歌词
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return
      }
      if (!this.touch.moved) {
        this.touch.moved = true
      }
      // 歌词区到屏幕右边的静态距离
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
      const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
      //记录滑动比例
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
      this.$refs.lyricList.$el.style['transform'] = `translate3d(${offsetWidth}px,0,0)`
      // 滑动时需要关闭TransitionDuration
      this.$refs.lyricList.$el.style['transitionDuration'] = 0
      this.$refs.middleL.style.opacity = 1 - this.touch.percent
      this.$refs.middleL.style['transitionDuration'] = 0
    },
    middleTouchEnd() {
      if (!this.touch.moved) {
        return
      }
      let offsetWidth
      let opacity
      if (this.currentShow === 'cd') {
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth
          opacity = 0
          this.currentShow = 'lyric'
        } else {
          offsetWidth = 0
          opacity = 1
        }
      } else {
        if (this.touch.percent < 0.9) {
          offsetWidth = 0
          this.currentShow = 'cd'
          opacity = 1
        } else {
          offsetWidth = -window.innerWidth
          opacity = 0
        }
      }
      const time = 300
      this.$refs.lyricList.$el.style['transform'] = `translate3d(${offsetWidth}px,0,0)`
      this.$refs.lyricList.$el.style['transitionDuration'] = `${time}ms`
      this.$refs.middleL.style.opacity = opacity
      this.$refs.middleL.style['transitionDuration'] = `${time}ms`
      this.touch.initiated = false
    },
    showPlaylist() {
      this.$refs.playlist.show()
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      // setPlayingState: 'SET_PLSYING_STATE',
      // setCurrentIndex: 'SET_CURRENT_INDEX',
      // setPlayMode: 'SET_PLAY_MODE',
      // setPlayList: 'SET_PLAY_lIST'
    }),
    ...mapActions([
      'savePlayHistory'
    ])
  },
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll,
    Playlist
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
                &.pause
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
          .lyric-wrapper
            width 80%
            margin 0 auto 
            overflow hidden
            text-align center
            .text
              line-height .853333rem /* 64/75 */
              font-size $font-size-medium
              &.current
                color: $color-theme
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
            .current
              color $color-icon
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
        .icon-mini
          font-size 32px
          position absolute
          left 0
          top 3px
  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)

</style>
