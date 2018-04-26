<template>
  <scroll class="list-view" :data="data" @scroll="scroll" :listenScroll="listenScroll" :probeType="probeType" ref="listview">
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
            <li @click="selectItem(item)" v-for="item in group.items" :key="item.index" class="list-group-item">
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
        <li v-for="(item, index) in shortcutList" :key="index" class="item" :class="{'current':currentIndex===index}" :data-index="index">
          {{item}}
        </li>
      </ul>
    </div>
  </scroll>
</template>
<script>
import BScroll from 'better-scroll'
import Scroll from '@/base/scroll/scroll'
import { getData } from '@/common/js/dom'
// 每个字母高度
const ANCHOR_HEIGHT = 18
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
      ],
      scrollY: -1,
      currentIndex: 0,
      diff: -1
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
      // console.log(this)
      this._initSorts()
      // this._calculateHeight() 
    })
  },
  created() {
    // 数据函数之间共享，数据不定义在data()中，在data中数据会被监听值得变化，用于数据绑定
    // 而在create()中，不需要监听数据值的变化
    this.touch = {}
    // 监听滚动时的位置
    this.listenScroll = true
    // 滑动的过程中，而且在 momentum 滚动动画运行过程中实时派发 scroll 事件
    this.probeType = 3
    // 字母块的高度
    this.listHeight = []
  },
  methods: {
    selectItem(item) {
      this.$emit('select', item)
    },
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
      // console.log(e)
      // console.log(e.target.dataset.index)
      
      // 点击时当前字母的索引
      let anchorIndex = getData(e.target, 'index')
      // console.log(anchorIndex)

      // 手指第一次点触时手指位置的相关信息
      let firstTouch = e.touches[0]
      // console.log(firstTouch)
      
      // 手指y方向的位置值
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = anchorIndex
      // console.log(this.touch)
      // 点击字母跳到指定区域
      this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove(e) {
      // console.log(e)
      // 获取手指移动时的位置
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      // this.touch.y2 - this.touch.y1 为第一次点击某个字母后再滑动到某个字母之间y方向之间的差值
      // ANCHOR_HEIGHT 为一个字母的高度
      // delta为滑动后滑动字母的个数
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
      // 滑动到“最后”一个字母时的索引
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta
      // 滑到指定的歌手列表区域
      this._scrollTo(anchorIndex)

    },
    // 监听滚动时y方向位置
    scroll(pos) {
      this.scrollY = pos.y
      // console.log(this.scrollY)
    },
    _scrollTo(index) {
      // console.log(index)
      if (!index && index !== 0) {
        return
      }
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      this.scrollY = -this.listHeight[index]
      // 滑到指定的歌手列表区域
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
    },
    // 计算每个字母块的高度
    _calculateHeight() {
      this.listHeight = []
      const sort = this.$refs.singerSort
      // console.log(sort.clientHeight)  //38
      const list = this.$refs.listGroup
      let height = sort.clientHeight * 3
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
      // console.log(this.listHeight)
    },
    refresh() {
      this.$refs.listview.refresh()
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY(newY) {
      // console.log(newY);
      // console.log(this.scrollY)
      const listHeight = this.listHeight
      for (let i = 0; i < listHeight.length - 1; i++) {
        // 单个字母块的上限
        const height1 = listHeight[i]
        // 单个字母块的下限
        const height2 = listHeight[i + 1]
        // 
        if (!height2 || (-newY >= height1 && -newY < height2)) {
          this.currentIndex = i
          // console.log(this.currentIndex)
          return 
        }
        this.currentIndex = 0  
      }
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
