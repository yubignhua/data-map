<template>
  <div class="iframe-container">
    <iframe
      :src="src"
      scrolling="auto"
      frameborder="0"
      class="frame" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
@Component({
  name: 'iframe'
})

export default class extends Vue {
  @Prop({ default: '' }) private url!:string
  private src:string = ''

  @Watch('url', { immediate: true })
  private onUrlChange(newValue:string) {
    this.resetSrc(newValue)
  }
  private resetSrc(url:string):void {
    this.src = url
  }
}
</script>

<style lang="scss">
.iframe-container {
  position: absolute;
  top: 80px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  margin-top: -29px;
  .frame {
    position: relative;
    top: 0px;
    width: 100%;
    height: 100%;
  }
}
</style>
