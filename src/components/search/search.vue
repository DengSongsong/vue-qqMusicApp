<template>
  <div class="search">
    <div class="search-wrapper">
      <search-box2 ref="searchBox" @query="onQueryChange"></search-box2>
    </div>
    <div class="shortcut-wrapper" v-show="!query">
      <div class="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li @click="addQuery(item.k)" class="item" v-for="item in hotKey" :key="item.index">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="search-result" v-show="query">
      <suggest :query="query"></suggest>
    </div>
  </div>
</template>
<script>
import SearchBox2 from '@/base/search-box2/search-box2'
import Suggest from '@/components/suggest/suggest'
import { getHotKey } from '@/api/search'
import { ERR_OK } from '@/api/config'
export default {
  data() {
    return {
      hotKey: [],
      query: ''
    }
  },
  methods: {
    _getHotKey() {
      getHotKey().then((res) => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data.hotkey.slice(0, 10)
          // console.log(this.hotKey)
        }
      })
    },
    addQuery(query) {
      this.$refs.searchBox.setQuery(query)
    },
    onQueryChange(query) {
      this.query = query
    }
  },
  created() {
    this._getHotKey()
  },
  components: {
    SearchBox2,
    Suggest
  }
}
</script>
<style lang="stylus">
  @import "../../common/stylus/variable"
  .search
    position fixed
    width 100%
    top 0
    bottom 0
    background: $color-background
    .shortcut-wrapper
      width 100%
      // margin-top .266667rem /* 20/75 */
      top: 2.4rem /* 180/75 */
      bottom 0
      background-color #233846
      .shortcut
        height 100%
        overflow hidden
        .hot-key
          margin .533333rem /* 40/75 */
          .title
            margin-bottom .266667rem /* 20/75 */
            font-size $font-size-medium
            color: $color-text-l
          .item
            display inline-block
            padding .133333rem /* 10/75 */.266667rem /* 20/75 */
            margin 0 .533333rem /* 40/75 */.266667rem /* 20/75 */0
            border-radius .533333rem /* 40/75 */
            color: $color-text-m
            border 1px solid $color-text-m
    .search-result
      position: fixed
      width: 100%
      top: 2.4rem /* 180/75 */
      bottom: 0
</style>
