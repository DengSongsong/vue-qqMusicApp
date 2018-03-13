<template>
  <div class="song-list">
    <div class="play-wrapper">
      <i class="icon iconfont icon-bofang1"></i>
      <span class="play">全部播放</span>
    </div>
    <ul>
      <li class="item" v-for="(song, index) in songs" :key="index">
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
        <i class="icon iconfont icon-gengduo"></i>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    songs: {
      type: Array,
      default: []
    }
  },
  methods: {
    getDesc(song) {
      return `${song.singer} · ${song.album}`
    }
  }
}
</script>
<style lang="stylus">
  @import "../../common/stylus/variable";
  .song-list
    .play-wrapper
      display flex
      align-items center
      height 1.493333rem /* 112/75 */
      padding .32rem .4rem 
      box-sizing border-box
      font-size $font-size-medium-x
      border-bottom .013333rem solid $color-text-m
      .icon-bofang1
        margin-right .373333rem /* 28/75 */
        color $color-icon
    .item
      display flex
      align-items center
      box-sizing border-box
      height 1.493333rem /* 112/75 */
      padding .32rem .4rem
      font-size $font-size-medium-x
      border-bottom .013333rem solid $color-text-m
      .content
        flex 1
        overflow hidden
        .name
          color $color-text-ll
        .desc 
          color $color-text-l
          font-size $font-size-small
          margin-top .16rem /* 12/75 */
      .icon-gengduo
        font-size $font-size-large-x

</style>
