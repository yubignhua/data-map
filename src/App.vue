<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-22 15:26:13
 * @LastEditTime: 2019-08-22 15:26:13
 * @LastEditors: your name
 -->
<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'App'
})
export default class extends Vue {}
</script>
<style lang="scss" scoped>

</style>
