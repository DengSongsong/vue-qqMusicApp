<template>
  <div class="rank">
    <div class="list-header">
      <span class="icon iconfont icon-fanhui"></span>
      <span class="list-title">排行</span>
    </div>
    <div class="toplist" ref="toplist">
      <ul>
        <li class="item">
          <div class="icon">
            <img src="" alt="" width="100" height="100">
          </div>
          <ul class="songlist">
            <li class="song">
              <span></span>
              <span></span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>  
</template>
<script>
import { getTopList } from '@/api/rank'
import { ERR_OK } from '@/api/config'
export default {
  data() {
    return {
      topList: []
    }
  },
  created() {
    this._getTopList()
  },
  methods: {
    _getTopList() {
      getTopList().then((res) => {
        if (res.code === ERR_OK) {
          this.topList = res.data.topList
          console.log(this.topList)
        }
      })
    }
  }
}
</script>
<style lang="stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"
  .rank
    position fixed
    width 100%
    top 0
    bottom 0
    background: $color-background
    .list-header
      width 100%
      padding .24rem .266667rem 10px .4rem 
      display flex
      .icon, .list-title
        font-size $font-size-large
      .icon
        flex 0 0 18px
      .list-title
        flex .8
        display inline-block
        text-align center
    .toplist
      height 100%
      overflow hidden
      .item
        display flex
        margin 0 20px
        padding-top 20px
        height 100px
        &:last-child
          padding-bottom 20px
        .icon
          flex 0 0 100px
          width 100px
          height 100px
        .songlist
          flex 1
          display flex
          flex-direction column
          justify-content center
          padding 0 20px
          height 100px
          overflow hidden
          background $color-highlight-background
          color $color-text-d
          font-size $font-size-small
          .song
            no-wrap()
            line-height 26px
</style>
