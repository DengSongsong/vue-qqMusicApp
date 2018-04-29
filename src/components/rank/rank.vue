<template>
  <div class="rank" ref="rank">
    <div class="list-header">
      <span class="icon iconfont icon-fanhui"></span>
      <span class="list-title">排行</span>
    </div>
    <scroll :data="topList" class="toplist" ref="topList">
      <ul>
        <li @click="selectItem(item)" class="item" v-for="item in topList" :key="item.index">
          <div class="icon">
            <img v-lazy="item.picUrl" alt="" width="100" height="100">
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song, index) in item.songList" :key="index">
              <span>{{index + 1}}</span>
              <span>{{song.songname}}-{{song.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!topList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>  
</template>
<script>
import { getTopList } from '@/api/rank'
import { ERR_OK } from '@/api/config'
import Scroll from '@/base/scroll/scroll'
import Loading from '@/base/loading/loading'
import { playlistMixin } from '@/common/js/mixin'
import { mapMutations } from 'vuex'
export default {
  mixins: [playlistMixin],
  data() {
    return {
      topList: []
    }
  },
  created() {
    this._getTopList()
  },
  methods: {
    handlePlaylist(playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.rank.style.bottom = bottom
      this.$refs.topList.refresh()
    },
    _getTopList() {
      getTopList().then((res) => {
        if (res.code === ERR_OK) {
          this.topList = res.data.topList
          // console.log(this.topList)
        }
      })
    },
    selectItem(item) {
      this.$router.push({
        path: `/rank/${item.id}`
      })
      this.setTopList(item)
    },
    ...mapMutations({
      setTopList: 'SET_TOP_LIST'
    })
  },
  components: {
    Scroll,
    Loading
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
      padding .24rem .266667rem .266667rem .4rem 
      display flex
      .icon, .list-title
        font-size $font-size-large
      .icon
        flex 0 0 .48rem /* 36/75 */
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
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
