<template>
  <div class="search-box" @click="search">
    <!-- <div class="search-box-inner"> -->
      <i class="icon iconfont icon-iconfontzhizuobiaozhun22"></i>
      <input type="text" class="box" :placeholder="placeholder">
      <i class="icon-dismiss"></i>
    <!-- </div> -->
  </div>
</template>
<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: '搜索'
    }
  },
  methods: {
    search() {
      // this.$router.push('/search')
      this.$emit('search')
    }
  }
}
</script>
<style lang="stylus">
@import "../../common/stylus/variable";
  .search-box
    display flex
    align-items center;
    position relative
    margin  0 .213333rem /* 16/75 */
    margin-bottom .213333rem /* 16/75 */
    height .853333rem /* 64/75 */
    line-height .853333rem /* 64/75 */
    background #233846
    .icon
      position absolute
      margin-left 4.08rem /* 306/75 */
      font-size 18px
      color $color-text-d
      text-align center
    .box
      width 100%
      height 100% 
      outline none
      border none
      background #233846
      &::placeholder
        font-size 16px
        text-align center
        padding-left .746667rem /* 56/75 */
        color $color-text-d
</style>
