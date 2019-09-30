<template>
  <div class="schoolOperationSection">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({
  name: 'schoolOperationSection'
})
export default class extends Vue {

}
</script>
