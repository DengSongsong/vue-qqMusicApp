<template>
  <div class="song-list">
    <div class="play-wrapper"  @click="random">
      <i class="icon iconfont icon-bofang1"></i>
      <span class="play">全部播放</span>
    </div>
    <ul>
      <li class="item" @click="selectItem(song, index)" v-for="(song, index) in songs" :key="index">
        <div class="rank-item" v-show="rank">
          <span class="text">{{index + 1}}</span>
        </div>
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
import { mapActions } from 'vuex'
export default {
  props: {
    songs: {
      type: Array,
      default: []
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getDesc(song) {
      return `${song.singer} · ${song.album}`
    },
    selectItem(item, index) {
      this.$emit('select', item, index)
    },
    random() {
      this.randomPlay({
        list: this.songs
      })
    },
    ...mapActions([
      'randomPlay'
    ])
  }
}
</script>
<style lang="stylus">
  @import "../../common/stylus/variable"
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
      .rank-item
        flex 0 0 .333333rem /* 25/75 */
        width .333333rem /* 25/75 */
        margin-right .4rem /* 30/75 */
        text-align center
        .text
          color $color-text
          font-size $font-size-large
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
        flex 0 0 .333333rem /* 25/75 */
        width .333333rem /* 25/75 */
        font-size $font-size-large-x

</style>
