<template>
  <div class="financeDataSection">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({
  name: 'financeDataSection'
})
export default class extends Vue {

}
</script>
