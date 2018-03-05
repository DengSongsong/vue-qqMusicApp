<template>
  <div id="app">
    <tab></tab>
    <search-box></search-box>
    <router-view/>
  </div>
</template>

<script>
import Tab from '@/components/tab/tab'
import SearchBox from '@/components/search-box/search-box'
export default {
  name: 'App',
  components: {
    Tab,
    SearchBox
  }
}
</script>

<style>

</style>
