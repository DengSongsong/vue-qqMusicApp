<template>
  <div class="musicHall">
    <div class="musicHall-content">
      <div>
        <div class="slider-wrapper">
          <slider>
            <div v-for="item in musicHall" :key="item.index">
              <a :href="item.linkUrl">
                <img :src="item.picUrl" alt="" class="needsclick">
              </a>
            </div>
          </slider>
        </div>
    </div>
    </div>
  </div>
</template>
<script>
import Slider from '@/base/slider/slider'
import { getMusicHall } from '@/api/musicHall'
import { ERR_OK } from '@/api/config'
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
    // 获取轮播图数据
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
    Slider
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
</style>
