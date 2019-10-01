<template>
  <div class="main-map-container">
    <div class="app-container">
      <div id="container"></div>
      <div class="input-card">
        <input
          id="removeAllOverlay"
          type="button"
          @click="removeAllOverlay"
          class="btn"
          value="清除所有覆盖物"
        />
      </div>
      <div class="main_bottom">234</div>
    </div>
    <div class="app_right_bar">
      <div class="app_right_title">用户列表</div>
    </div>
  </div>
</template>

<script lang="ts">
import { getIndexData } from '@/services/dtsRank/index'
import { Component, Vue } from 'vue-property-decorator'
import R from '@/utils/freePiont'
interface taskListState {
  count: number
  key: string
  name: string
}

@Component({
  name: 'home'
})
export default class extends Vue {
  // 地图对象实例
  private map: any
  // 默认中心点坐标
  private center: any[] = [119.428, 36]
  // //设置地图显示的缩放级别
  private zoom = 11

  // 轨迹坐标
  private testTrack = [
    ['119.368904', '35.913423'],
    ['119.382122', '35.901176'],
    ['119.387271', '35.912501'],
    ['119.398258', '35.904600']
  ]
  private testMarkerData = [
    {
      lnglat: [116.405285, 39.904989], //点标记位置
      name: 'beijing',
      id: 1
    },
    {
      lnglat: [116.505285, 38.904989], //点标记位置
      name: 'beijing',
      id: 2
    },
    {
      lnglat: [116.605285, 37.904989], //点标记位置
      name: 'beijing',
      id: 3
    },
    {
      lnglat: [116.705285, 36.904989], //点标记位置
      name: 'beijing',
      id: 4
    },
    {
      lnglat: [116.805285, 35.904989], //点标记位置
      name: 'beijing',
      id: 5
    },
  ]

  mounted() {
    this.map = this.initAMap()
    this.map.on('complete', () => {
      // 地图图块加载完成后触发
      console.log('地图加载完成')
    })
    this.addPolyLine(this.testTrack)
    this.drawMarker(this.testMarkerData)
  }

  /**
   * @message: 请求当前轨迹坐标
   * @parameter:
   * @Return:
   * @Date: 2019-09-30 18:58:06
   */
  private async requestCurTracks(id: number) {
    const resData = await getTracksData(id)
    const { ok, dataList, message } = resData
    if (!ok) return this.$elementMessage(message || '轨迹信息获取失败')
    this.removeAllOverlay()
    this.addPolyLine(dataList)
  }

  /**
   * @message: 请求设备坐标点
   * @parameter:
   * @Return:
   * @Date: 2019-09-30 18:58:06
   */
  private async requestMarkerData() {
    const resData = await getMarkerData()
    const { ok, dataList, message } = resData
    if (!ok) return this.$elementMessage(message || '轨迹信息获取失败')
    const massMarks = this.createMarkerStyObj()
    this.drawMarker(dataList)
  }

  /**
   * @message: 绘制坐地点
   * @parameter: 
   * @Return: 
   * @Date: 2019-09-30 19:26:08
   */
  private drawMarker(data:any[]){
    const massMarks = this.createMarkerStyObj()
    massMarks.setData(data);
    // 将海量点添加至地图实例
    massMarks.setMap(this.map);
  }
  
  /**
   * @message: 增加轨迹
   * @parameter:
   * @Return:
   * @Date: 2019-09-30 17:26:22
   */
  private addPolyLine(testTrack: any[]) {
    const fn = R.pipe(
      this.hanleTrakData,
      this.createPolyLine
    )
    const polyline = fn(testTrack)
    this.map.add(polyline)
    this.map.setFitView([polyline])
  }

  /**
   * @message: 清除地图上所有添加的覆盖物
   * @parameter:
   * @Return:
   * @Date: 2019-09-30 18:55:43
   */
  private removeAllOverlay(): void {
    this.map.clearMap()
  }

  /**
   * @message: 初始化地图
   * @parameter:
   * @Return:
   * @Date: 2019-09-30 16:49:23
   */
  private initAMap() {
    const map = new AMap.Map('container', {
      zoom: this.zoom,
      center: this.center
    })
    AMap.plugin(
      ['AMap.ToolBar', 'AMap.Scale', 'AMap.Geolocation', 'AMap.MapType'],
      () => {
        //异步同时加载多个插件
        const toolbar = new AMap.ToolBar()
        const scale = new AMap.Scale()
        const geolocation = new AMap.Geolocation()
        const mapType = new AMap.MapType()
        map.addControl(toolbar)
        map.addControl(scale)
        map.addControl(geolocation)
        map.addControl(mapType)
      }
    )
    return map
  }

  /**
   * @message: 创建 marker坐标 对象
   * @parameter: 
   * @Return: 
   * @Date: 2019-09-30 19:22:21
   */
  private createMarkerStyObj() {
    // 创建样式对象
    const styleObject = new AMap.StyleObject({
      url: '//vdata.amap.com/icons/b18/1/2.png', // 图标地址
      size: new AMap.Size(11, 11), // 图标大小
      anchor: new AMap.Pixel(5, 5) // 图标显示位置偏移量，基准点为图标左上角
    })
    return new AMap.MassMarks({
      zIndex: 5, // 海量点图层叠加的顺序
      zooms: [3, 19], // 在指定地图缩放级别范围内展示海量点图层
      style: styleObject // 设置样式对象
    })
  }

  /**
   * @message: 获取轨迹装换数据
   * @parameter:
   * @Return:
   * @Date: 2019-09-30 17:12:20
   */
  private hanleTrakData(arr: any[]) {
    const newArr = arr.map(item => {
      return new AMap.LngLat(...item)
    })
    return newArr
  }

  /**
   * @message: 绘制轨迹
   * @parameter:
   * @Return:
   * @Date: 2019-09-30 17:08:11
   */
  private createPolyLine(path: any[]) {
    var polyline = new AMap.Polyline({
      path: path,
      borderWeight: 2, // 线条宽度，默认为 1
      strokeColor: 'red', // 线条颜色
      lineJoin: 'round' // 折线拐点连接处样式
    })
    return polyline
  }

  // 删除 maker
  removeMarker(marker: any) {
    this.map.remove(marker)
  }
}
</script>

<style lang="scss" scoped>
.main-map-container {
  min-height: 100%;
  background-color: #ffffff;
  display: flex;
  .app-container {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
    #container {
      width: 100%;
      flex: 1;
    }
    .main_bottom {
      min-height: 100px;
      background: #2e4155;
      border-radius: 8px;
      color: white;
    }
  }
  .app_right_bar {
    width: 200px;
    background: #2e4155;
    .app_right_title {
      padding: 20px;
      color: white;
    }
  }
}
</style>
