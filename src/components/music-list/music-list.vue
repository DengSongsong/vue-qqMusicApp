<template>
  <div class="music-list">
    <div class="header">
      <i class="icon iconfont icon-fanhui" @click="back"></i>
      <i class="icon iconfont icon-gengduo"></i>
    </div>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <span class="title">{{title}}</span>
      <div class="fliter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll class="list" @scroll="scroll" :data="songs" ref="list" :listenScroll="listenScroll" :probeType="probeType">
      <div class="song-list-wrapper">
        <song-list :songs="songs"></song-list>
      </div>
      <div v-show="!songs.length" class="loading">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>
<script>
import SongList from '@/base/song-list/song-list'
import Scroll from '@/base/scroll/scroll'
import Loading from '@/base/loading/loading'
const RESERVED_HEIGHT = 40
export default {
  props: {
    image: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default: []
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      scrollY: 0
    }
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.image})`
    }
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight
    // 滚动的最高距离
    this.minTanslateY = -this.imageHeight + RESERVED_HEIGHT
    this.$refs.list.$el.style.top = `${this.imageHeight}px`
  },
  created() {
    this.probeType = 3
    this.listenScroll = true
  },
  methods: {
    scroll(pos) {
      this.scrollY = pos.y
    },
    back() {
      this.$router.back()
    }
  },
  watch: {
    scrollY(newVal) {
      // console.log(newVal)
      let translateY = Math.max(this.minTanslateY, newVal)
      this.$refs.layer.style['transform'] = `translate3d(0, ${translateY}px,0)`
      let zIndex = 0
      let scale = 1
      let blur = 0
      const percent = Math.abs(newVal / this.imageHeight)
      if (newVal > 0) {
          scale = 1 + percent
          zIndex = 10
        } else {
          blur = Math.min(20, percent * 20)
      }
      this.$refs.filter.style['backdrop-filter'] = `blur(${blur}px)`
      if (newVal < this.minTanslateY) {
        zIndex = 10
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
      } else {
        this.$refs.bgImage.style.paddingTop = '70%'
        this.$refs.bgImage.style.height = 0
      }
      this.$refs.bgImage.style.zIndex = zIndex
      this.$refs.bgImage.style['transform'] = `scale(${scale})`
    }
  },
  components: {
    SongList,
    Scroll,
    Loading
  }
}
</script>
<style lang="stylus">
@import "../../common/stylus/variable";
  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .header
      position absolute
      top 0
      z-index 50
      padding .426667rem .426667rem .266667rem .506667rem
      width 100%
      box-sizing border-box
      display flex
      justify-content space-between
      font-size $font-size-medium-x
      .icon-fanhui
        height .533333rem /* 40/75 */
        line-height .533333rem /* 40/75 */
      .icon-gengduo
        height .533333rem /* 40/75 */
        line-height .533333rem /* 40/75 */
    .bg-image
      position relative
      width 100%
      height 0
      padding-top 70%
      transform-origin: top
      background-size: cover
      .title
        position absolute
        bottom 1.733333rem /* 130/75 */
        width 100%
        text-align center
        line-height .533333rem /* 40/75 */
        font-size $font-size-large-x
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position relative
      height 100%
      background: $color-background
    .list
      position fixed
      top 0
      bottom 0
      width 100%
      background: $color-background
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
        
</style>
