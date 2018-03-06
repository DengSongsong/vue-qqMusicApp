<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
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
  mounted() {
    setTimeout(() => {
      this._setSliderWidth()
      this._initSlider()
    }, 20)
  },
  methods: {
    _setSliderWidth() {
      // 轮播图片元素
      this.children = this.$refs.sliderGroup.children
      // console.log(this.children)
      let width = 0
      let sliderWidth = this.$refs.slider.clientWidth
      console.log(sliderWidth)
      for(let i = 0; i < this.children.length; i++) {
        let child = this.children[i]
        // 为每一个img的div添加class属性
        addClass(child, 'slider-item')
        child.style.width = sliderWidth + 'px'
        width += sliderWidth
      }
      if (this.loop) {
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
    }
  }
}
</script>
<style lang="stylus">
  .slider
    min-height 1px
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
</style>
