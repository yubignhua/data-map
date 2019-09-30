<template>
  <div class="large-img">
    <div class="img__wrap">
      <img :src="imgUrl">
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  name: 'LargeImg'
})
export default class extends Vue {
  @Prop({ default: '' }) private imgUrl!:string
}
</script>

<style lang="scss" scoped>
.img__wrap{
  max-width: 100%;
  max-height: 100%;
  overflow: hidden;
  text-align: center;
  margin: 0 auto;
}
.img__wrap img{
  width: 100%;
  height: 100%;
}
</style>
