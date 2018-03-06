<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" :class="{active: currentPageIndex === index}" v-for="(item, index) in dots" :key="index"></span>
    </div>
  </div>
</template>
<script>
import { addClass } from '@/common/js/dom'
import BScroll from 'better-scroll'
export default {
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    },
    threshold: {
      type: Number,
      default: 0.3
    },
    speed: {
      type: Number,
      default: 400
    }
  },
  data() {
    return {
      dots:[],
      currentPageIndex: 0
    }
  },
  mounted() {
    // dom渲染延时，浏览器刷新浏览17ms一次
    setTimeout(() => {
      this._setSliderWidth()
      this._initDots()
      this._initSlider()
      if (this.autoPlay) {
        this._play()
      }
    }, 20)
    // 监听视口大小，重新计算
    window.addEventListener('resize', () => {
      if (!this.slider) {
        return
      }
      this._setSliderWidth(true)
      this.slider.refresh()
    })
  },
  beforeDestroy() {
    clearTimeout(this.timer)
  },
  methods: {
    _setSliderWidth(isResize) {
      // 轮播图片元素
      this.children = this.$refs.sliderGroup.children
      // console.log(this.children)
      let width = 0
      let sliderWidth = this.$refs.slider.clientWidth
      // console.log(sliderWidth)
      for(let i = 0; i < this.children.length; i++) {
        let child = this.children[i]
        // 为每一个img的div添加class属性
        addClass(child, 'slider-item')
        child.style.width = sliderWidth + 'px'
        width += sliderWidth
      }
      if (this.loop && !isResize) {
        width += 2 * sliderWidth
      }
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    _initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        // 当快速在屏幕上滑动一段距离的时候，会根据滑动的距离和时间计算出动量，并生成滚动动画
        momentum: false,
        // 
        snap: {
          // 支持横向循环轮播，并不支持纵向 默认true
          loop: this.loop,
          // 表示可滚动到下一个的阈值
          threshold: this.threshold,
          speed: this.speed
        },
      })
      // dot移动 
      //scrollEnd 滚动结束
      this.slider.on('scrollEnd', () => {
        // 获取横向滚动当前页数
        let pageIndex = this.slider.getCurrentPage().pageX
        // console.log(pageIndex)
        this.currentPageIndex = pageIndex
        // 自动轮播
        if(this.autoPlay) {
          this._play()
        }
      })
      // 下张图轮播前清除setTimeout
      this.slider.on('beforeScrollStart', () => {
        if (this.autoPlay) {
          clearTimeout(this.timer)
        }
      })
    },
    _initDots() {
      this.dots = new Array(this.children.length)
    },
    // 自动轮播
    _play() {
      this.timer = setTimeout(() => {
        // 滚动到下一个页面
        this.slider.next()
      }, this.interval)
    }
  }
}
</script>
<style lang="stylus">
  @import "../../common/stylus/variable";
  .slider
    min-height 1px
    position relative
    .slider-group 
      overflow hidden
      white-space nowrap
      .slider-item
        float left
        box-sizing border-box
        overflow hidden
        text-align center
        a
          display block
          width 100%
          overflow hidden
          text-decoration none 
          img
            display block
            width 100%
    .dots 
      position absolute
      right 0
      left 0
      bottom .293333rem /* 22/75 */
      text-align center
      font-size 0
      .dot
        display inline-block
        margin 0 .053333rem /* 4/75 */
        width .213333rem /* 16/75 */
        height .213333rem /* 16/75 */
        border-radius 50%
        background $color-text-l
        &.active
          background $color-text-ll
</style>
