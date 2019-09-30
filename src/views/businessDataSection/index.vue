<template>
  <div class="businessDataSection">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({
  name: 'businessDataSection'
})
export default class extends Vue {

}
</script>
