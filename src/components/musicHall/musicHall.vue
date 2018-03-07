<template>
  <div class="musicHall">
    <div class="musicHall-content">
      <div>
        <!-- 轮播图 -->
        <div v-if="musicHall.length" class="slider-wrapper">
          <slider>
            <div v-for="item in musicHall" :key="item.index">
              <a :href="item.linkUrl">
                <img :src="item.picUrl" alt="" class="needsclick">
              </a>
            </div>
          </slider>
        </div>
        <!-- 导航列表 -->
        <div class="radio-list">
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
      musicHall: []
    }
  },
  created() {
    // 获取轮播图数据
    this._getMusicHall()
  },
  methods: {
    // 获取轮播图数据 异步
    _getMusicHall() {
      getMusicHall().then(res => {
        if(res.code === ERR_OK) {
          // console.log(res)
          this.musicHall = res.data.slider
          // console.log(this.musicHall);
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
      .radio-list
        position fixed
        z-index 1
        margin-top -.066667rem /* 5/75 */
        margin-left .106667rem /* 8/75 */
</style>
