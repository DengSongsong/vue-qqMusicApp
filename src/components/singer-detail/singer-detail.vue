<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :image="image"></music-list>
  </transition>
</template>
<script>
import MusicList from '@/components/music-list/music-list'
import { getSingerDetail_songs, getSingerDetail_albums } from '@/api/singer'
import { ERR_OK } from '@/api/config'
import { createSong } from '@/common/js/song'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      songs: [],
      albums: [],
    }
  },
  computed: {
    ...mapGetters([
      'singer'
    ]),
    title() {
      return this.singer.name
    },
    image() {
      return this.singer.avatar
    }
  },
  created() {
    this._getDetail_songs()
    this._getDetail_albums()
  },
  methods: {
    _getDetail_songs() {
      if (!this.singer.id) {
        this.$router.push('/singer')
        return
      }
      getSingerDetail_songs(this.singer.id).then(res => {
        if (res.code === ERR_OK) {
          // console.log(res)
          this.songs = this._normalizeSongs(res.data.list)
          // console.log(res.data.list)
          // console.log(this.songs)
        }
      })
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach(item => {
        let { musicData } = item
        // console.log(musicData)
        if (musicData.songid && musicData.albumid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
    _getDetail_albums() {
      if (!this.singer.id) {
        this.$router('/singer')
        return
      }
      getSingerDetail_albums(this.singer.id).then(res => {
        if (res.code === ERR_OK) {
          // console.log(res)
          this.albums = res.data.list
          // console.log(this.albums)
        }
      })
    },
  },
  components: {
    MusicList
  }
}
</script>
<style lang="stylus">
  .slide-enter-active, .slide-leave-active
    transition all 0.3s
  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
</style>
