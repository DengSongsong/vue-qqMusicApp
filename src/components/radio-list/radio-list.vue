<template>
  <div class="radio-list">
    <ul>
      <router-link tag="li" to="/singer">
        <span class="icon iconfont icon-geshou"></span>
        <span class="name">歌手</span>
      </router-link>
      <router-link tag="li" to="/rank">
        <span class="icon iconfont icon-paihangbang"></span>
        <span class="name">排行</span>
      </router-link>
      <router-link tag="li" to="/video">
        <span class="icon iconfont icon-leimupinleifenleileibie2"></span>
        <span class="name">分类歌单</span>
      </router-link>
      <router-link tag="li" to="/songList">
        <span class="icon iconfont icon-diantai"></span>
        <span class="name">电台</span>
      </router-link>
      <router-link tag="li" to="/radioStation">
        <span class="icon iconfont icon-shipin"></span>
        <span class="name">视频</span>
      </router-link>
    </ul>
  </div>
</template>
<script>
export default {
  
}
</script>
<style lang="stylus">
  @import "../../common/stylus/variable";
  .radio-list
    width 9.573333rem /* 718/75 */
    background #213B47
    margin 0 auto  
    ul
      list-style none
      display flex
      align-items center
      margin 0
      padding .533333rem .453333rem /* 34/75 */
      li
        display inline-block
        flex 1
        justify-content space-between
        display flex
        flex-direction column
        align-items center
        font-size 0
        .icon
          margin-bottom .24rem /* 18/75 */
          color $color-icon
          font-size $font-size-large
        .name
          font-size $font-size-small
        
</style>
