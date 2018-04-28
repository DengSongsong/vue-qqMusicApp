<template>
  <transition name="slide">
    <music-list :image="image"></music-list>
  </transition>
</template>
<script>
import MusicList from '@/components/music-list/music-list'
import { mapGetters } from 'vuex'
export default {
  computed: {
    title() {
      return this.disc.songListDesc
    },
    image() {
      return this.disc.picUrl
    },
    ...mapGetters([
      'disc'
    ])
  },
  components: {
    MusicList
  }
}
</script>
<style lang="stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
