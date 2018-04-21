<template>
  <div class="progress-circle">
    <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent"></circle>
      <circle class="progress-bar" r="50" cx="50" fill="transparent" :stroke-dasharray="dashArray" :stroke-dashoffset="dashOffset"></circle>
    </svg>
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: {
    radius: {
      type: Number,
      default: 100
    },
    timePercent: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      dashArray: Math.PI * 100
    }
  },
  computed: {
    dashOffset() {
      return (1 - this.timePercent) * this.dashArray
    }
  }
}
</script>
<style lang="stylus">
  @import "../../common/stylus/variable";
  .progress-circle
    position relative
    circle 
      stroke-width .106667rem /* 8/75 */
      transform-origin center 
      &.progress-background
        transform: scale(0.9)
        stroke: $color-theme
      &.progress-bar
        transform: scale(0.9) rotate(-90deg)
        stroke: $color-theme
</style>
