<template>
  <div class="progress-bar" ref="progressBar">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper">
        <div class="progress-btn" ref="progressBtn" @touchstart.prevent="progressTouchStart" @touchmove.prevent="progressTouchMove" @touchend.prevent="progressTouchEnd"></div>
      </div>
    </div>
  </div>  
</template>
<script>
export default {
  props: {
    timePercent: {
      type: Number,
      default: 0
    }
  },
  create() {
    //这个对象用于存储拖动进度条时的信息
    // this.touch = {}
  },
  data() {
    return {
      touch: {}
    }
  },
  methods: {
    progressTouchStart(e) {
      console.log(e)
      this.touch.isInited  = true
      this.touch.startX = e.touchs[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },
    progressTouchMove(e) {
      if (!this.touch.isInited ) {
        return
      }
      const deltaX = e.touchs[0].pageX - this.touch.startX
      const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - this.$refs.progressBtn.clientWidth, Math.max(0, this.touch.left + deltaX))
      this._offset(offsetWidth)
    },
    progressTouchEnd() {
      this.touch.isInited  = false
      // this._triggerPercent()
    },
    _triggerPercent() {
      let btnWidth = this.$refs.progressBtn.clientWidth
      let barWidth = this.$refs.progressBar.clientWidth - btnWidth
      const percent = this.$refs.progress.clientWidth / barWidth
      // this.$emit('percentChange', percent)
    },
    _offset(offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`
      this.$refs.progressBtn.style['transform'] = `translate3d(${offsetWidth}px, 0, 0)`
    } 
  },
  watch: {
    timePercent(newTimePercent) {
      if (newTimePercent > 0 && !this.touch.isInited) {
        let btnWidth = this.$refs.progressBtn.clientWidth
        let barWidth = this.$refs.progressBar.clientWidth - btnWidth
        let offsetWidth = newTimePercent * barWidth
        this._offset(offsetWidth)
        // console.log(btnWidth)
      }
    }
  }
}
</script>
<style lang="stylus">
  @import "../../common/stylus/variable"
  .progress-bar
    height .8rem /* 60/75 */
    .bar-inner
      position relative
      top .346667rem /* 26/75 */
      height .106667rem /* 8/75 */
      background rgba(0, 0, 0, 0.3)
      .progress
        position absolute
        height 100%
        background $color-theme
      .progress-btn-wrapper
        position absolute
        left -.213333rem /* 16/75 */
        top -.346667rem /* 26/75 */
        width .8rem /* 60/75 */
        height .8rem /* 60/75 */
        .progress-btn
          position: relative
          top: .186667rem /* 14/75 */
          left: .186667rem /* 14/75 */
          box-sizing: border-box
          width: .426667rem /* 32/75 */
          height: .426667rem /* 32/75 */
          border-radius: 50%
          background: $color-theme
</style>
