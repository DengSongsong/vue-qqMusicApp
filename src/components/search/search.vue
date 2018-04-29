<template>
  <div class="search">
    <div class="search-wrapper">
      <div class="box-wrapper">
        <input type="text" class="box" placeholder="搜索音乐、MV、歌单、用户">
        <i class="icon iconfont icon-shanchu"></i>
      </div>
      <span class="cancel" @click="cancel">取消</span>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    cancel() {
      this.$router.push('/musicHall');
    }
  }
}
</script>
<style lang="stylus">
  @import "../../common/stylus/variable"
  .search
    position fixed
    width 100%
    top 0
    bottom 0
    background: $color-background
    .search-wrapper
      width 100%
      display flex
      align-items center
      box-sizing border-box
      height 1.066667rem /* 80/75 */
      padding 0 .32rem /* 24/75 */
      margin-top .266667rem /* 20/75 */
      .box-wrapper
        flex 1
        display flex
        align-items center
        height 100%
        background #233846
        .box
          flex 1
          height 100% 
          padding-left .133333rem /* 10/75 */
          font-size 16px
          color #fff
          outline none
          background #233846
          &::placeholder
            font-size 16px
            color $color-text-m
        .icon-shanchu
          width 1.066667rem /* 80/75 */
          flex 0 0 1.066667rem /* 80/75 */
          text-align center
          font-size 24px
      .cancel
        width 1.6rem /* 120/75 */
        flex 0 0 1.6rem /* 120/75 */
        text-align center
        color $color-text-m
        font-size 16px
</style>
