import { mapGetters, mapMutations, mapActions } from 'vuex'
import { playMode } from '@/common/js/config'
import { shuffle } from '@/common/js/utils'

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  mounted() {
    this.handlePlaylist(this.playList)
  },
  activated() {
    this.handlePlaylist(this.playList)
  },
  watch: {
    playList(newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlaylist() {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}

export const playerMixin = {
  computed: {
    ...mapGetters([
      // 控制播放器的渲染 歌曲数
      'playList',
      //   当前歌曲
      'currentSong',
      // 播放模式
      'mode',
      'sequenceList',
      'favoriteList'
    ]),
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-xunhuanbofang' : this.mode === playMode.loop ? 'icon-danquxunhuan' : 'icon-suijibofang01'
    },
    favoriteIcon() {
      return this.getFavoriteIcon(this.currentSong)
    }
  },
  methods: {
    // 点击按钮改变播放模式，提交mutations
    changeMode() {
      let nextMode = (this.mode + 1) % 3
      this.setPlayMode(nextMode)
      let list = []
      if (this.mode === playMode.random) {// 随机播放打乱播放列表
        list = shuffle(this.sequenceList)
      } else { //顺序播放
        list = this.sequenceList
      }
      // 改变歌曲顺序前先重设当前歌曲索引
      this.stayCurrentIndex(list)
      // 提交mutation改变歌曲顺序
      this.setPlayList(list)
    },
    // 改变播放模式时当前播放歌曲索引发生变化，需要重设索引防止播放列表不可控制
    stayCurrentIndex(list) {
      // findIndex是es6的数组方法，返回数组中满足条件的第一个元素的索引
      let stayIndex = list.findIndex(item => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(stayIndex)

    },
    toggleFavorite(song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song)
      } else {
        this.saveFavoriteList(song)
      }
    },
    getFavoriteIcon(song) {
      if (this.isFavorite(song)) {
        return 'current'
      }
      return ''
    },
    isFavorite(song) {
      const index = this.favoriteList.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1
    },
    ...mapMutations({
      setPlayingState: 'SET_PLSYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAY_lIST'
    }),
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList'
    ])
  }
}

export const searchMixin = {
  data() {
    return {
      query: '',
      refreshDelay: 120
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    onQueryChange(query) {
      this.query = query
    },
    blurInput() {
      this.$refs.searchBox.blur()
    },
    addQuery(query) {
      this.$refs.searchBox.setQuery(query)
    },
    saveSearch() {
      this.saveSearchHistory(this.query)
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ])
  }
}