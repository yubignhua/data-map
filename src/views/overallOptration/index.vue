<template>
  <div class="overallOptration">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({
  name: 'overallOptration'
})
export default class extends Vue {

}
</script>
