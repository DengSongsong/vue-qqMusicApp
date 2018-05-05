<template>
  <div class="search">
    <div class="search-wrapper">
      <search-box2 ref="searchBox" @query="onQueryChange" placeholder="搜索音乐、MV、歌单、用户"></search-box2>
    </div>
    <div class="shortcut-wrapper" v-show="!query" ref="shortcutWrapper">
      <scroll :refreshDelay="refreshDelay" :data="shortcut" ref="shortcut" class="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li @click="addQuery(item.k)" class="item" v-for="item in hotKey" :key="item.index">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="icon iconfont icon-shanchu1"></i>
              </span>
            </h1>
            <search-list @select="addQuery" @delete="deleteSearchHistory" :searches="searchHistory"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" v-show="query" ref="searchResult">
      <suggest ref="suggest" @listScroll="blurInput" :query="query" @select="saveSearch"></suggest>
    </div>
    <confirm ref="confirm" @confirm="clearSearchHistory" text="是否清空所有搜索历史" confirmBtnText="清空"></confirm>
    <router-view></router-view>
  </div>
</template>
<script>
import Scroll from '@/base/scroll/scroll'
import SearchBox2 from '@/base/search-box2/search-box2'
import Suggest from '@/components/suggest/suggest'
import SearchList from '@/base/search-list/search-list'
import Confirm from '@/base/confirm/confirm'
import { getHotKey } from '@/api/search'
import { ERR_OK } from '@/api/config'
import { mapActions, mapGetters } from 'vuex'
import { playlistMixin } from '@/common/js/mixin'
export default {
  mixins: [playlistMixin],
  data() {
    return {
      hotKey: [],
      query: '',
      refreshDelay: 120
    }
  },
  computed: {
    shortcut() {
      return this.hotKey.concat(this.searchHistory)
    },
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''

      this.$refs.searchResult.style.bottom = bottom
      this.$refs.suggest.refresh()

      this.$refs.shortcutWrapper.style.bottom = bottom
      this.$refs.shortcut.refresh()
    },
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
    },
    blurInput() {
      this.$refs.searchBox.blur()
    },
    saveSearch() {
      this.saveSearchHistory(this.query)
    },
    showConfirm() {
      this.$refs.confirm.show()
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory',
      'clearSearchHistory'
    ])
  },
  created() {
    this._getHotKey()
  },
  watch: {
    query(newQuery) {
      if (!newQuery) {
        setTimeout(() => {
          this.$refs.shortcut.refresh()
        }, 20)
      }
    }
  },
  components: {
    SearchBox2,
    Suggest,
    SearchList,
    Confirm,
    Scroll
  }
}
</script>
<style lang="stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"
  .search
    position fixed
    width 100%
    top 0
    bottom 0
    background: $color-background
    .shortcut-wrapper
      width 100%
      // margin-top .266667rem /* 20/75 */
      position: fixed
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
      .search-history
        position relative
        margin 0 .533333rem /* 40/75 */
        .title
          display flex
          align-items center
          height 1.066667rem /* 80/75 */
          font-size: $font-size-medium
          color: $color-text-l
          .text
            flex 1
          .clear
            extend-click()
            .icon-shanchu1
              font-size: $font-size-medium
              color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 2.4rem /* 180/75 */
      bottom: 0
</style>
