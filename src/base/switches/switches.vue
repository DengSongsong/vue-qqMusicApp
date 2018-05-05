<template>
  <ul class="switches">
    <li class="switch-item" @click="switchItem(index)" v-for="(item,index) in switches" :key="index" :class="{'active':currentIndex === index}">
      <span>{{item.name}}</span>
    </li>
  </ul>
</template>
<script>
export default {
  props: {
    switches: {
      type: Array,
      default: []
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },
  methods: {
    switchItem(index) {
      this.$emit('switch', index)
    }
  }
}
</script>
<style lang="stylus">
  @import "../../common/stylus/variable"
  .switches
    display flex
    align-items center
    width 6.4rem /* 480/75 */
    margin 0 auto
    border 1px solid $color-highlight-background
    .switch-item
      flex 1
      padding .213333rem /* 16/75 */
      text-align center
      font-size $font-size-medium
      color $color-text-m
      &.active
        background $color-highlight-background
        color $color-text
</style>
