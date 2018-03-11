<template>
  <scroll class="list-view" :data="data">
    <div>
      <div class="singer-sort">
        <ul class="sort-list">
          <li v-for="item in areaSorts" :key="item.index" class="sort-item">{{item}}</li>
        </ul>
      </div>
      <div class="singer-sort">
        <ul class="sort-list">
          <li v-for="item in sexSorts" :key="item.index" class="sort-item">{{item}}</li>
        </ul>
      </div>
      <div class="singer-sort" ref="singerSort">
        <ul class="sort-list" ref="sortList">
          <li v-for="item in musicSorts" :key="item.index" class="sort-item" ref="sortItem">{{item}}</li>
        </ul>
      </div>
      <ul>
        <li v-for="group in data" :key="group.index" class="list-group" ref="listGroup">
          <h2 class="list-group-title">{{group.title}}</h2>
          <ul>
            <li v-for="item in group.items" :key="item.index" class="list-group-item">
              <img v-lazy="item.avatar" alt="" class="avatar">
              <div class="content">
                <span class="name">{{item.name}}</span>
                <span class="icon iconfont icon-fanhui"></span>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="list-shortcut" @touchstart.stop.prevent="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove" @touchend.stop>
      <ul>
        <li v-for="(item, index) in shortcutList" :key="index" class="item" :data-index="index">
          {{item}}
        </li>
      </ul>
    </div>
  </scroll>
</template>
<script>
import BScroll from 'better-scroll'
import Scroll from '@/base/scroll/scroll'
export default {
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      areaSorts: [
        '全部','内地','港台','欧美','日本','韩国','其它'
      ],
      sexSorts: [
        '全部','男','女','组合'
      ],
      musicSorts: [
        '全部','流行','嘻哈','摇滚','电子','民谣','R&B','民歌','轻音乐','爵士','古典','乡村','蓝调'
      ]
    }
  },
  computed: {
    shortcutList() {
      return this.data.map(item => {
        return item.title.substr(0, 1)
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      this._initSorts()
    })
  },
  methods: {
    _initSorts() {
      if(this.musicSorts) {
        let padding = 13
        let margin = 26
        let children = this.$refs.sortList.children
        // console.log(children)
        let width = 0
        for(let i = 0; i < children.length; i++) {
          let child = children[i]
          let liWidth = child.clientWidth
        //   console.log(liWidth)
          width += liWidth
        }
        // console.log(width)
        this.$refs.sortList.style.width = width + padding + margin * this.musicSorts.length + 'px'
        this.$nextTick(() => {
          if (!this.sortScroll) {
            this.sortScroll = new BScroll(this.$refs.singerSort, {
              scrollX: true,
              eventPassthrough: 'vertical'
            })
          } else {
            this.sortScroll.refresh()
          }
        })
      }
    },
    onShortcutTouchStart(e) {
      console.log(e)
    },
    onShortcutTouchMove(e) {
      console.log(e)
    }
  },
  components: {
    Scroll
  }
}
</script>
<style lang="stylus">
  @import "../../common/stylus/variable";
  .list-view
    position relative
    width 100%
    height 100%
    overflow hidden
    .singer-sort
      width 100%
      overflow hidden
      border-bottom .013333rem solid $color-text-ll
      .sort-list
        margin-top .453333rem /* 34/75 */
        margin-bottom 0
        padding-bottom .266667rem /* 20/75 */
        padding-left .346667rem /* 26/75 */
        white-space nowrap
        .sort-item
          display inline-block
          margin-right .693333rem /* 52/75 */
          font-size $font-size-small
          color $color-text-m
    .list-group
      padding-bottom .4rem /* 30/75 */
      list-style none
      .list-group-title
        width 100%
        height .4rem /* 30/75 */
        line-height .4rem /* 30/75 */
        padding .24rem .213333rem .266667rem
        border-bottom .013333rem solid $color-text-ll
        font-size: $font-size-small
        color: $color-text-l
        background: #203c4a
      .list-group-item
        position relative
        display flex
        align-items center
        padding .266667rem 0 0 .4rem 
        .avatar
          width 1.013333rem /* 76/75 */
          height 1.013333rem /* 76/75 */
          border-radius 50%
          flex 0 0 1.013333rem
        .content
          flex 1
          height 1.013333rem /* 76/75 */
          line-height 1.013333rem /* 76/75 */
          border-bottom .013333rem solid $color-text-ll
          margin-left .32rem /* 24/75 */
          .name
            color $color-text-ll
            font-size: $font-size-medium
          .icon
            position absolute
            right .346667rem /* 26/75 */
            color $color-text-m
    .list-shortcut
      position: absolute
      z-index: 30
      right: .293333rem /* 22/75 */
      top: 50%
      transform: translateY(-50%)
      width: .533333rem /* 40/75 */
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
</style>
