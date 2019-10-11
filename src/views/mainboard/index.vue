<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-10 15:28:27
 * @LastEditTime: 2019-10-11 20:06:53
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="main-map-container">
    <div class="app-container">
      <div id="container" />
      <div class="main_bottom">
        <div class="left">
          <svg-icon name="icon_sos" width="50" height="50" />
        </div>
        <div class="right">
          <div>日客则地区一号救援</div>
          <div>阿里地区二号救援</div>
        </div>
      </div>
    </div>
    <div class="app_right_bar">
      <div class="top_content_box">
        <div class="app_right_title">用户列表</div>
        <div class="search_box section">
          <el-input
            size="mini"
            v-model="keyword"
            class="search_btn"
            placeholder="请输入内容"
            prefix-icon="el-icon-search"
            clearable
            @keyup.enter.native="onSearch"
          />
          <el-button size="mini" type="primary" plain @click="onSearch">搜索</el-button>
        </div>
        <div class="device_group section">
          <el-select size="mini" v-model="groupValue" placeholder="设备分组">
            <template slot="prepend">Http://</template>
            <el-option
              v-for="item in options"
              :key="item.groupValue"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="line_state_box section">
          <el-radio-group @change="onHandleStateChange" v-model="lineState">
            <el-radio-button size="mini" label="1">在线</el-radio-button>
            <el-radio-button size="mini" label="2">离线</el-radio-button>
            <el-radio-button size="mini" label="3">全部</el-radio-button>
          </el-radio-group>
        </div>
        <div class="content_box">
          <DeviceInfo
            @show-cur-polyline="requestCurTracks"
            @show-polyline="addPolyLine"
            @show-positin="showMarkerPositin"
            :data="item"
            v-for="(item,index) in markers"
            :key="index"
          ></DeviceInfo>
        </div>
      </div>
      <div class="bottom_content_box">
        <div class="wran_title">报警列表</div>
        <div class="warn_box">
          <DeviceInfo :data="item" v-for="(item,index) in markers" :key="index"></DeviceInfo>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { getIndexData } from '@/services/dtsRank/index'
import { Component, Vue } from 'vue-property-decorator'
import { getAllUser } from '@/services/dataMap/index'
import R from '@/utils/freePiont'
import { dataList, massMarkes } from './data'
import DeviceInfo from '@/views/mainboard/components/deviceInfo.vue'
interface IMarkerParams {
  page: number
  perpage: number
  group: string
  state: number
  keyword: string
  alarm_type?: number
}

@Component({
  name: 'deviceInfo',
  components: { DeviceInfo }
})
export default class extends Vue {
  private timer:any = 0 // 定时器
  private lineState: string = '在线'
  private options: any[] = [
    {
      value: '选项1',
      label: '选项1'
    },
    {
      value: '选项2',
      label: '选项2'
    }
  ]
  private groupValue: string = ''
  private keyword: string = ''
  // 地图对象实例
  private map: any
  // 默认中心点坐标
  private center: any[] = [116.205467, 39.907761]
  // //设置地图显示的缩放级别
  private zoom = 11
  // 轨迹坐标
  private testTrack = [
    ['119.368904', '35.913423'],
    ['119.382122', '35.901176'],
    ['119.387271', '35.912501'],
    ['119.398258', '35.904600']
  ]
  private markers: any[] = this.createRealMarkerDate(dataList)
  private markerParams: IMarkerParams = {
    page: 1,
    perpage: 20,
    group: '',
    state: 1,
    keyword: ''
  }

  mounted() {
    this.map = this.initAMap()
    this.map.on('complete', () => {
      // 地图图块加载完成后触发
      console.log('地图加载完成')
    })
    this.drawMarker(this.markers)
    getAllUser().then(res => {
      console.log(res)
    })

    // const style = [
    //   {
    //     url: '../../assets/images/help_logo.png',
    //     anchor: new AMap.Pixel(6, 6),
    //     size: new AMap.Size(8, 8)
    //   },
    //   {
    //     url: '../../assets/images/help_logo.png',
    //     anchor: new AMap.Pixel(3, 3),
    //     size: new AMap.Size(8, 8)
    //   },
    //   {
    //     url: '../../assets/images/help_logo.png',
    //     anchor: new AMap.Pixel(4, 4),
    //     size: new AMap.Size(8, 8)
    //   }
    // ]

    // var mass = new AMap.MassMarks({
    //   opacity: 0.8,
    //   zIndex: 111,
    //   cursor: 'pointer',
    //   style: style
    // })

    // mass.setData(massMarkes);

    // mass.setMap(this.map)

    // var styleObject = new AMap.StyleObject({
    //   url: '//vdata.amap.com/icons/b18/1/2.png', // 图标地址
    //   size: new AMap.Size(11, 11), // 图标大小
    //   anchor: new AMap.Pixel(5, 5) // 图标显示位置偏移量，基准点为图标左上角
    // })
  }

  beforeDestroy(){
    clearTimeout(this.timer)
  }

  /**
   * @message: 监听搜索按钮
   * @parameter:
   * @Return:
   * @Date: 2019-10-04 22:07:41
   */
  private onSearch(): void {
    this.markerParams.keyword = this.keyword
    this.requestMarkerData(this.markerParams)
  }

  /**
   * @message: 在线状态切换
   * @parameter:
   * @Return:
   * @Date: 2019-10-04 21:52:42
   */
  private onHandleStateChange(e: string) {
    this.markerParams.state = +e
    this.requestMarkerData(this.markerParams)
  }

  /**
   * @message: 生成渲染 markder 列表标记
   * @parameter:
   * @Return:
   * @Date: 2019-10-03 13:50:35
   */
  private createRealMarkerDate(dataList: any[]) {
    return dataList.map((item: any) => {
      const iconMap: any = {
        0: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png',
        1: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png'
      }
      const content = `<div class="custom-content-marker"><img src="${
        iconMap[item.type]
      }"></div>`
      item.content = content
      return item
    })
  }

  // 关闭信息窗体
  private closeInfoWindow() {
    this.map.clearInfoWindow()
  }

  /**
   * @message: 生成 infowindow 对象
   * @parameter:
   * @Return:
   * @Date: 2019-10-02 20:24:24
   */
  private createInfoWindow(title: string, content: any[]): any {
    var infoWindow = new AMap.InfoWindow({
      isCustom: true, // 使用自定义窗体
      content: this.createInfoDom(title, content.join('<br/>')),
      offset: new AMap.Pixel(16, -45)
    })
    return infoWindow
  }
  /**
   * @message: 生成弹窗 dom 元素
   * @parameter:
   * @Return:
   * @Date: 2019-10-02 20:59:35
   */
  private createInfoDom(title: string, content: string) {
    const info = document.createElement('div')
    info.className = 'custom-info input-card content-window-card'
    // 可以通过下面的方式修改自定义窗体的宽高
    // info.style.width = "400px";
    // 定义顶部标题
    const top = document.createElement('div')
    const titleD = document.createElement('div')
    const closeX = document.createElement('img')
    top.className = 'info-top'
    titleD.innerHTML = title
    closeX.src = 'https://webapi.amap.com/images/close2.gif'
    closeX.onclick = this.closeInfoWindow
    top.appendChild(titleD)
    top.appendChild(closeX)
    info.appendChild(top)
    // 定义中部内容
    var middle = document.createElement('div')
    middle.className = 'info-middle'
    middle.style.backgroundColor = 'white'
    middle.innerHTML = content
    info.appendChild(middle)
    // 定义底部内容
    const bottom = document.createElement('div')
    bottom.className = 'info-bottom'
    bottom.style.position = 'relative'
    bottom.style.top = '0px'
    bottom.style.margin = '0 auto'
    const sharp = document.createElement('img')
    sharp.src = 'https://webapi.amap.com/images/sharp.png'
    bottom.appendChild(sharp)
    info.appendChild(bottom)
    return info
  }

  /**
   * @message: 显示地图的某个点
   * @parameter:
   * @Return:
   * @Date: 2019-10-02 14:35:51
   */
  showMarkerPositin(position: any[]) {
    console.log('position: ', position)
    // this.map.setCenter([116.305467, 39.807761]) // 设置中心点
    this.handleConverGps(position).then((res: any) => {
      const marker = new AMap.Marker({
        position: [res.lng, res.lat]
      })
      this.map.setFitView([marker])
      this.map.setZoom(15)
    })
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
  private async requestMarkerData(data: IMarkerParams) {
    const resData = await getMarkerData(data)
    const { ok, dataList, message } = resData
    if (!ok) {
      clearTimeout(this.timer)
      return this.$elementMessage(message || '轨迹信息获取失败')
    }
    this.timer = setTimeout(() => {
      this.requestMarkerData(this.markerParams)
    }, 5000)
    this.drawMarker(dataList)
  }

  /**
   * @message: gps 坐标转换高德坐标
   * @parameter:
   * @Return:
   * @Date: 2019-10-03 10:37:33
   */
  private handleConverGps(gps: number[]) {
    return new Promise(resolve => {
      AMap.convertFrom(gps, 'gps', (status: number, result: any) => {
        if (result.info === 'ok') {
          const lnglats = result.locations // Array.<LngLat>
          resolve(lnglats[0])
        }
      })
    })
  }


  

  

  /**
   * @message: 绘制坐地点
   * @parameter:
   * @Return:
   * @Date: 2019-09-30 19:26:08
   */
  private drawMarker(markers: any[]) {
    markers.forEach(marker => {
      const lnglats = this.handleConverGps([
        marker.position[0],
        marker.position[1]
      ]).then((res: any) => {
        const marke = new AMap.Marker({
          map: this.map,
          // icon: marker.icon,
          content: marker.content,
          position: [res.lng, res.lat],
          // position: [marker.position[0], marker.position[1]],
          offset: new AMap.Pixel(-13, -30)
        })
        // 设置点标记的动画效果，此处为弹跳效果
        if (marker.type === 0) marke.setAnimation('AMAP_ANIMATION_BOUNCE')
        // 实例化信息窗体
        const title = `${marker.device_name}<span style="font-size:11px;color:#F00;">报警</span>`
        const content: any[] = []
        content.push(`地址：${marker.address}`)
        content.push(`位置更新于：${marker.update_time}`)
        content.push(
          `设备信息: | 电量:${marker.electric} | 信号:${marker.signal} | 更新时间 ${marker.update_time}`
        )
        // content.push("<a href='https://ditu.amap.com/detail/B000A8URXB?citycode=110105'>详细信息</a>")
        // 鼠标点击marker弹出自定义的信息窗体
        AMap.event.addListener(marke, 'click', () => {
          const infoWindow = this.createInfoWindow(title, content)
          infoWindow.open(this.map, marke.getPosition())
        })
      })
    })
  }

  /**
   * @message: 增加轨迹
   * @parameter:
   * @Return:
   * @Date: 2019-09-30 17:26:22
   */
  private addPolyLine(testTrack: any[]) {
    console.log('addPolyLine: ')
    testTrack = this.testTrack
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
        // 异步同时加载多个插件
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
    map.setMapStyle('amap://styles/whitesmoke')
    // map.setFeatures(['road','point']); // 多个种类要素显示
    return map
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
<style>
.el-radio-button--medium .el-radio-button__inner {
  padding: 5px 20px;
}
</style>
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
    padding-bottom: 10px;
    #container {
      width: 100%;
      flex: 1;
    }
    .main_bottom {
      width: 100%;
      min-height: 100px;
      background: #2e4155;
      border-radius: 8px;
      color: white;
      font-size: 20px;
      font-weight: 600;
      display: flex;
      align-items: center;
      .left {
        width: 150px;
        text-align: center;
      }
      .right {
        line-height: 40px;
      }
    }
  }
  .app_right_bar {
    width: 300px;
    color: white;
    position: relative;
    margin-right: 15px;
    .top_content_box {
      border-radius: 16px;
      background: #2e4155;
      padding: 15px;
      height: 70%;
      position: relative;
      .app_right_title {
        padding: 20px;
        color: white;
        font-size: 18px;
        font-weight: 600;
        text-align: center;
      }
      .section {
        margin-bottom: 10px;
      }
      .search_box {
        display: flex;
        .search_btn {
          margin-right: 10px;
        }
      }
      .device_group {
        // display: flex;
        align-items: center;
        margin-bottom: 20px;
      }
      .line_state_box {
        text-align: center;
      }
      .content_box {
        background: white;
        border-radius: 8px;
        background: white;
        border-radius: 8px;
        position: absolute;
        top: 210px;
        margin-right: 20px;
        bottom: 20px;
        width: 90%;
        overflow-y: scroll;
        scrollbar-arrow-color: #ffffff;
        .device_item {
          cursor: pointer;
          background: #2e4155;
          margin: 5px;
          font-size: 12px;
          border-radius: 5px;
          padding-bottom: 1px;
          .device_name {
            padding-top: 10px;
          }
          .position_info {
          }
          .device_info {
            font-size: 10px;
          }
          .line_item {
            margin: 8px;
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
      }
    }
    .bottom_content_box {
      position: absolute;
      bottom: 0;
      height: 28%;
      background: #2e4155;
      padding: 15px;
      width: 100%;
      border-radius: 16px;
      margin-bottom: 10px;
      .wran_title {
        padding: 3px;
        color: white;
        font-size: 18px;
        font-weight: 600;
        text-align: center;
      }
      .warn_box {
        background: white;
        border-radius: 8px;
        background: white;
        border-radius: 8px;
        position: absolute;
        top: 50px;
        margin-right: 20px;
        bottom: 10px;
        width: 90%;
        overflow-y: scroll;
        scrollbar-arrow-color: #ffffff;
        .device_item {
          cursor: pointer;
          background: #2e4155;
          margin: 5px;
          font-size: 12px;
          border-radius: 5px;
          padding-bottom: 1px;
          .device_name {
            padding-top: 10px;
          }
          .position_info {
          }
          .device_info {
            font-size: 10px;
          }
          .line_item {
            margin: 8px;
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
      }
    }
  }
}
</style>
