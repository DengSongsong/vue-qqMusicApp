<template>
  <div class="tab">
    <div class="tab-left">
      <span class="icon iconfont icon-liebiao-copy"></span>
    </div>
    <div class="tab-center">
      <router-link tag="div" class="center-item" to="/mine">
        <span class="tab-link">我的</span>
      </router-link>
      <router-link tag="div" class="center-item" to="/musicHall">
        <span class="tab-link">音乐馆</span>
      </router-link>
      <router-link tag="div" class="center-item" to="/find">
        <span class="tab-link">发现</span>
      </router-link>
    </div>
    <div class="tab-right" @click="userPage">
      <span class="icon iconfont icon-jia"></span>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    userPage() {
      this.$router.push({
        path: '/user'
      })
    }
  }
}
</script>
<style lang="stylus">
  @import "../../common/stylus/variable";
  .tab
    display flex
    padding .48rem .346667rem .4rem .346667rem 
    flex-direction row
    justify-content space-between
    font-size 19px
    font-weight 400
    .tab-left
      .icon
        color #fff
        // font-size 24px
    .tab-center
      display flex
      margin 0 1.786667rem /* 134/75 */
      .center-item
        display inline-block
        flex 1
        margin-right  .64rem /* 48/75 */
        text-align center
        &:last-child
          margin-right 0
        .tab-link
          height .533333rem /* 40/75 */
          line-height .533333rem /* 40/75 */
          text-overflow: ellipsis
          white-space: nowrap
          color #EBF7FE
          vertical-align bottom
        &.router-link-active
          .tab-link
            color #fff
    .tab-right
      .icon
        color #fff
        // font-size 24px
</style>
