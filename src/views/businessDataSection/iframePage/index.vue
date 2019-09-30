<template>
  <div class="iframe_container">
    <Iframe :url="mUrl" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import Iframe from '@/components/common/Iframe/index.vue'
import { AppModule } from '@/store/modules/app'
@Component({
  name: 'iframePage',
  components: { Iframe }
})
export default class extends Vue {
  private mUrl: string = ''

  beforeRouteEnter(to: any, from: any, next: any) {
    next((vm: any) => {
      const { link } = vm.$route.meta
      console.log('link: ', link)
      vm.mUrl = link
      if (link.startsWith('https://datavauth.mofaxiao.com/datav')) {
        AppModule.ToggleSideBar(false)
      }
      next()
    })
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  background-color: #ffffff;
  .iframe_container {
  }
}
</style>
