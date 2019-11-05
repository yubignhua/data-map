<template>
  <div class="tabs_table_box">
    <el-tabs
      v-model="editableTabsValue"
      type="card">
      <el-tab-pane
        v-for="(item, index) in editableTabs"
        :key="index"
        :label="item.year+''"
        :name="item.year+''">
        <slot :row="item.rows" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
interface ITabData {
  year: string
  rows: any
}
@Component({
  name: 'tabsTable'
})
export default class extends Vue {
  @Prop({ default: () => [] }) private dataList!: any[]

  private editableTabsValue: string = '2019'
  private editableTabs: ITabData[] = []

  created() {
    console.log('242334234')
  }

  @Watch('dataList', { immediate: true })
  private onDataListChange(newData: any) {
    console.log('hahahahah')
    this.editableTabs = newData
    console.log('this.editableTabs: ', this.editableTabs)
  }
}
</script>

<style lang="scss" scoped>
.tabs_table_box {
  width: 800px;
  margin-top: 20px;
}
</style>
