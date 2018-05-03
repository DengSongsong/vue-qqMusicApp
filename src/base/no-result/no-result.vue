<template>
  <div class="no-result">
    <div class="no-result-icon"></div>
    <p class="no-result-text">{{title}}</p>
  </div>  
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>
<style lang="stylus">
  @import "../../common/stylus/variable"
  .no-result
    text-align center
    .no-result-icon
      width 2.826667rem /* 212/75 */
      height 2.8rem /* 210/75 */
      margin 0 auto
      background-image url('https://y.gtimg.cn/mediastyle/mobile/yqq_v5/img/search_null.png?max_age=19830212&d=20151105145423')
      background-size 2.826667rem /* 212/75 */2.8rem /* 210/75 */
    .no-result-text
      margin-top .8rem /* 60/75 */
      font-size $font-size-medium
      color: $color-text-d
</style>
