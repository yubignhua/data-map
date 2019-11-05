<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-10-03 14:12:01
 * @LastEditTime: 2019-11-04 23:05:08
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="device_item">
    <div class="device_name line_item">
      {{ data.device_name }} ({{ data.imei }})
      <div class="set_positon" @click="showPositin([data.lng, data.lat])">
        <svg-icon name="定位" width="20" height="20" />
      </div>
    </div>
    <div class="position_info line_item">
      <div class="address">{{ data.address }}</div>
    </div>
    <div
      class="device_info line_item">
      ( · |电量:{{ data.electricity }}%|信号:{{ data.signal_new }}%|更新时间:{{ data.dataTime }} )
    </div>
    <div class="btn_group_box">
      <el-button-group>
        <el-button size="mini" @click="showCurPolyline(data.imei)">实时追踪</el-button>
        <el-button size="mini" @click="showPolyline(data.device_name)">历史轨迹</el-button>
        <el-button size="mini">设备设置</el-button>
      </el-button-group>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from 'vue-property-decorator'

@Component({
  name: 'tabsTable'
})
export default class extends Vue {
  @Prop({ default: () => [] }) private data!: any

  @Watch('data', { immediate: true })
  private onMarkersListChange(newData: any) {
    // console.log('markers', newData)
    this.data = newData
  }

  @Emit()
  private showPositin(position: any[]) {
    return position
  }
  @Emit()
  private showPolyline(id: string) {
    return id
  }
  @Emit()
  private showCurPolyline(id: string) {
    return id
  }
}
</script>

<style lang="scss" scoped>
.device_item {
  background: #2e4155;
  margin: 5px;
  font-size: 12px;
  border-radius: 5px;
  padding-bottom: 1px;
  .device_name {
    padding-top: 10px;
    position: relative;
    .set_positon {
      position: absolute;
      padding: 5px;
      right: 10px;
      top: 5px;
      cursor: pointer;
    }
  }

  .device_info {
    font-size: 10px;
  }
  .line_item {
    margin: 8px;
    color: #a6d5d9;
    .address{
      width:80%;
    }
  }
  .btn_group_box {
    display: flex;
    margin: 5px;
    box-sizing: border-box;
    border-radius: 18px;
    text-align: center;
    margin-bottom: 10px;
    .btn {
      flex: 1;
      text-align: center;
      color: #2e4155;
      background: white;
      height: 30px;
      line-height: 30px;
    }
  }
}
</style>
