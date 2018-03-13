<template>
  <div class="musicHall">
    <scroll class="musicHall-content" ref="scroll">
      <div>
        <!-- 轮播图 -->
        <div v-if="carouselPic.length" class="slider-wrapper" :data="songList">
          <slider>
            <div v-for="item in carouselPic" :key="item.index">
              <a :href="item.linkUrl">
                <img @load="loadImage" :src="item.picUrl" alt="">
              </a>
            </div>
          </slider>
        </div>
        <!-- 导航列表 -->
        <div class="radio-list-wrapper">
          <radio-list></radio-list>
        </div>
        <div class="newRecommend-wrapper">
          <div class="personality-radio">
            <img v-lazy="radioList.picUrl" alt="">
            <span class="icon iconfont icon-bofang"></span>
            <span class="radio-mame">个性电台</span>
          </div>
          <div class="newRecommend-list">
            <div class="recommend-song">
              <span class="recommend-title">新歌推荐</span>
              <span class="recommend-decs">妈妈木陪你春暖花开</span>
              <img src="../../common/image/newSong.jpg" alt="">
            </div>
            <div class="recommend-album">
              <span class="recommend-title">数字专辑</span>
              <span class="recommend-decs">310“春”日快乐</span>
              <img src="../../common/image/newAlbum.jpg" alt="">
            </div>
          </div>
        </div>
        <div class="recommend-list-wrapper">
          <div class="list-title">
            <p class="title-name">为你推荐歌单</p>
            <span class="icon iconfont icon-bofang"></span>
          </div>
          <ul>
            <li v-for="item in songList" :key="item.index" class="item">
              <div class="list-media">
                <img v-lazy="item.picUrl" alt="">
                <span class="listen-count">
                  <i class="icon iconfont icon-diantai"></i>
                  {{item.accessnum}}
                </span>
                <span class="icon iconfont icon-bofang1"></span>
              </div>
              <div class="list-info">
                <p>{{item.songListDesc}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-wrapper" v-show="!carouselPic.length || !songList.length">
        <loading></loading>
      </div>
    </scroll>
    <!-- <router-view></router-view> -->
  </div>
</template>
<script>
import Slider from '@/base/slider/slider'
import { getMusicHall } from '@/api/musicHall'
import { ERR_OK } from '@/api/config'
import RadioList from '@/components/radio-list/radio-list'
import Scroll from '@/base/scroll/scroll'
import Loading from '@/base/loading/loading'
export default {
  data() {
    return {
      // 轮播图
      carouselPic: [],
      // 个性电台
      radioList: [],
      // 推荐歌单
      songList: []
    }
  },
  created() {
    // 获取轮播图数据
    this._getCarouselPic()
    // 个性电台数据
    this._getRadioList()
    // 推荐歌单数据
    this._getRecommendSongList()
  },
  methods: {
    // 获取轮播图数据 异步
    _getCarouselPic() {
      getMusicHall().then(res => {
        if(res.code === ERR_OK) {
          // console.log(res)
          this.carouselPic = res.data.slider
          // console.log(this.carouselPic);
        }
      })
    },
    // 个性电台数据
    _getRadioList() {
      getMusicHall().then(res => {
        if(res.code === ERR_OK) {
          // console.log(res)
          this.radioList = res.data.radioList[0]
          // console.log(this.radioList);
        }
      })
    },
    // 推荐歌单数据
    _getRecommendSongList() {
      getMusicHall().then(res => {
        if(res.code === ERR_OK) {
          // console.log(res)
          this.songList = res.data.songList
          // console.log(this.songList);
        }
      })
    },
    // 重新计算better-scroll
    loadImage() {
      if (!this.checkloaded) {
        this.checkloaded = true;
        this.$refs.scroll.refresh()
      }
    }
  },
  components: {
    Slider,
    RadioList,
    Scroll,
    Loading
  }
}
</script>
<style lang="stylus">
  @import "../../common/stylus/variable";
  .musicHall
    position fixed
    top 2.453333rem /* 184/75 */
    width 100%
    bottom 0
    .musicHall-content
      position relative
      height 100%
      overflow hidden
      .slider-wrapper
        width 100%
        overflow hidden
      .radio-list-wrapper
        position relative
        z-index 1
        margin-top -.133333rem /* 10/75 */
      .newRecommend-wrapper
        width 9.573333rem /* 718/75 */
        display flex
        margin 0 auto
        margin-top .533333rem /* 40/75 */
        .personality-radio
          position relative
          width 3.36rem /* 252/75 */
          height 3.36rem /* 252/75 */
          flex 0 0 3.36rem /* 252/75 */
          margin-right .346667rem /* 26/75 */
          font-size 0
          img
            width 100%
            display inline-block
          .icon
            position absolute
            font-size $font-size-large-x
            top: 45%;
            left 42%
          .radio-mame
            font-size $font-size-medium-x
            position absolute
            left .693333rem /* 52/75 */
            bottom .24rem /* 18/75 */
            color $color-text
        .newRecommend-list
          flex 1
          .recommend-song
            margin-bottom .133333rem /* 10/75 */
          .recommend-song, .recommend-album
            width 100%
            position relative
            box-sizing border-box
            height 1.6rem /* 120/75 */
            padding .373333rem 0 .373333rem .373333rem
            background #334753
            .recommend-title 
              font-size $font-size-medium-x
            .recommend-decs
              display block
              margin-top .106667rem /* 8/75 */
              color $color-text-ll
            img
              position absolute
              display inline-block
              height 100%
              right 0
              top 0
      .recommend-list-wrapper
        width 100%
        padding-top .826667rem /* 62/75 */
        .list-title
          width 100%
          position relative
          text-align center
          margin-bottom .48rem /* 36/75 */
          .title-name
            display inline-block
            margin 0
            font-size $font-size-large
            letter-spacing 4px
          .icon
            position absolute
            right .4rem /* 30/75 */
        ul
          margin 0
          padding 0
          display flex
          flex-wrap: wrap
          justify-content space-between
          li
            flex-basis 33%
            .list-media
              width 100%
              position relative
              img
                display block
                max-width 100%
                height auto
              .listen-count
                position absolute
                margin-top -.533333rem /* 40/75 */
                margin-left .186667rem /* 14/75 */
              .icon-bofang1
                position absolute
                right .266667rem /* 20/75 */
                width .32rem /* 24/75 */
                height .32rem /* 24/75 */
                margin-top -.533333rem /* 40/75 */
            .list-info
              padding .24rem .213333rem .48rem .133333rem
              p
                margin 0
                color $color-text-d
                font-size $font-size-small
                line-height .533333rem /* 40/75 */ 
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)

        
</style>
