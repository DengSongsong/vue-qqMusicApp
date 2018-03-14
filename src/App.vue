<template>
  <div id="app">
    <tab></tab>
    <search-box></search-box>
    <keep-alive>
      <router-view/>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import Tab from '@/components/tab/tab'
import SearchBox from '@/components/search-box/search-box'
import Player from '@/components/player/player'
export default {
  name: 'App',
  components: {
    Tab,
    SearchBox,
    Player
  }
}
</script>

<style>

</style>
