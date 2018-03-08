<template>
  <div class="musicHall">
    <div class="musicHall-content">
      <div>
        <!-- 轮播图 -->
        <div v-if="carouselPic.length" class="slider-wrapper">
          <slider>
            <div v-for="item in carouselPic" :key="item.index">
              <a :href="item.linkUrl">
                <img :src="item.picUrl" alt="" class="needsclick">
              </a>
            </div>
          </slider>
        </div>
        <!-- 导航列表 -->
        <div class="radio-list-wrapper">
          <radio-list></radio-list>
        </div>
    </div>
    </div>
  </div>
</template>
<script>
import Slider from '@/base/slider/slider'
import { getMusicHall } from '@/api/musicHall'
import { ERR_OK } from '@/api/config'
import RadioList from '@/components/radio-list/radio-list'
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
    }
  },
  components: {
    Slider,
    RadioList
  }
}
</script>
<style lang="stylus">
  .musicHall
    position fixed
    top 2.453333rem /* 184/75 */
    width 100%
    bottom 0
    .musicHall-content
      height 100%
      overflow hidden
      .slider-wrapper
        width 100%
        overflow hidden
      .radio-list-wrapper
        position fixed
        z-index 1
        margin-top -.066667rem /* 5/75 */
        margin-left .213333rem /* 16/75 */
</style>
