<template>
  <div class="search-box2">
    <div class="box-wrapper">
      <input ref="query" type="text" v-model="query" class="box" placeholder="搜索音乐、MV、歌单、用户">
      <i class="icon iconfont icon-shanchu" v-show="query" @click="clear"></i>
    </div>
    <span class="cancel" @click="cancel">取消</span>
  </div>
</template>
<script>
import { debounce } from '@/common/js/utils'
export default {
  data() {
    return {
      query: ''
    }
  },
  methods: {
    cancel() {
      this.$router.push('/musicHall');
    },
    clear() {
      this.query = ''
    },
    setQuery(query) {
      this.query = query
    },
    blur() {
      this.$refs.quert.blur()
    }
  },
  created() {
    this.$watch('query', debounce((newQuery) => {
      this.$emit('query', newQuery)
    }, 200))
  }
}
</script>
<style lang="stylus">
  @import "../../common/stylus/variable"
  .search-box2
      width 100%
      display flex
      align-items center
      box-sizing border-box
      height 1.066667rem /* 80/75 */
      padding 0 .32rem /* 24/75 */
      margin .533333rem /* 40/75 */ 0
      .box-wrapper
        flex 1
        display flex
        align-items center
        height 100%
        background #233846
        .box
          flex 1
          height 100% 
          padding-left .133333rem /* 10/75 */
          font-size 16px
          color #fff
          outline none
          background #233846
          &::placeholder
            font-size 16px
            color $color-text-m
        .icon-shanchu
          width 1.066667rem /* 80/75 */
          flex 0 0 1.066667rem /* 80/75 */
          text-align center
          font-size 24px
      .cancel
        width 1.6rem /* 120/75 */
        flex 0 0 1.6rem /* 120/75 */
        text-align center
        color $color-text-m
        font-size 16px
</style>
