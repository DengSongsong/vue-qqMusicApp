<template>
  <div class="loading">
    <img src="./images/loading.gif" width="24" height="24" alt="">
    <p class="desc">{{title}}</p>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: '正在载入...'
    }
  }
}
</script>
<style lang="stylus">
  @import "../../common/stylus/variable";
  .loading
    width 100%
    text-align center
    .desc
      line-height .266667rem /* 20/75 */
      font-size $font-size-small
      color: $color-text-l
</style>
