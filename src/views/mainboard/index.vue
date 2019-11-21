<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-10 15:28:27
 * @LastEditTime: 2019-11-22 00:21:06
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="main-map-container">
    <div class="app-container">
      <div class="top_img">
        <img src="@/assets/images/bg_top.jpg" alt />
        <div class="top_text">智慧救援系统</div>
      </div>
      <img class="border_right_top bg_border" src="@/assets/images/border_06.png" alt />
      <img class="border_right_bottom bg_border" src="@/assets/images/border_07.png" alt />
      <img class="border_left_top bg_border" src="@/assets/images/border_05.png" alt />
      <img class="border_left_bottom bg_border" src="@/assets/images/border_03.png" alt />
      <div id="container" />
      <div class="main_bottom">
        <div class="left">
          <!-- <svg-icon name="icon_sos" width="50" height="50" /> -->
          <img src="@/assets/images/helicoper.png" width="100" height="50" alt />
        </div>
        <div class="right">
          <div>日客则地区一号救援</div>
          <div>阿里地区二号救援</div>
        </div>
      </div>
    </div>
    <div class="app_right_bar">
      <div class="top_content_box">
        <img class="border_right_top bg_border" src="@/assets/images/border_06.png" alt />
        <img class="border_right_bottom bg_border" src="@/assets/images/border_07.png" alt />
        <img class="border_left_top bg_border" src="@/assets/images/border_05.png" alt />
        <img class="border_left_bottom bg_border" src="@/assets/images/border_03.png" alt />
        <div class="app_right_title">
          <img src="@/assets/images/border_08.png" alt />
          用户列表
        </div>
        <div class="search_box section">
          <el-input v-model="keyword" size="mini" class="search_btn" placeholder="请输入设备名称,IMEI或ICCID" prefix-icon="el-icon-search" clearable @keyup.enter.native="onSearch" />
          <el-button size="mini" type="primary" plain @click="onSearch">搜索</el-button>
        </div>
        <!-- <div class="device_group section">
          <div style="margin-right:10px">设备分组:</div>
          <el-select v-model="groupValue" size="mini" placeholder="设备分组">
            <el-option v-for="item in options" :key="item.groupValue" :label="item.label" :value="item.value" />
          </el-select>
        </div>-->
        <!-- <div class="line_state_box section">
          <el-radio-group v-model="lineState" @change="onHandleStateChange">
            <el-radio-button size="mini" label="1">在线</el-radio-button>
            <el-radio-button size="mini" label="2">离线</el-radio-button>
            <el-radio-button size="mini" label="3">全部</el-radio-button>
          </el-radio-group>
        </div>-->
        <div class="content_box">
          <DeviceInfo
            v-for="(item,index) in markers"
            :key="index"
            :data="item"
            :index="index"
            :type="1"
            @show-cur-polyline="requestCurTracks"
            @show-polyline="requestHistoryTrack"
            @show-positin="showMarkerPositin"
          />
        </div>
      </div>
      <div class="bottom_content_box">
        <div class="wran_title">
          <img src="@/assets/images/border_08.png" alt />
          报警列表
        </div>
        <div class="warn_box">
          <DeviceInfo
            v-for="(item,index) in warnMarkers"
            :key="index"
            :data="item"
            :index="index"
            :type="2"
            @show-cur-polyline="requestCurTracks"
            @show-polyline="requestHistoryTrack"
            @show-positin="showMarkerPositin"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { getIndexData } from '@/services/dtsRank/index'
import { Component, Vue } from 'vue-property-decorator'
import {
  getAllUser,
  getWarnDeviceMarkerList,
  getUserList,
  // getTracksData,
  getTimeTracks,
  getDeviceTracks,
  getWarnDeviceMarkers,
  getDeviceMarkerList
} from '@/services/dataMap/index'
import R from '@/utils/freePiont'
import { dataList, massMarkes } from './data'
import DeviceInfo from '@/views/mainboard/components/deviceInfo.vue'
import { formatCurDate } from '@/utils/index'
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
  private timer: any = 0 // 定时器
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
  // 点对象
  private marker: any = null
  private polyline: any = null
  // 默认中心点坐标
  // private center: any[] = [116.205467, 39.907761]
  private center: any[] = [91.171961, 29.653482]
  // //设置地图显示的缩放级别
  private zoom = 5
  // 轨迹坐标
  private testTrack = [['119.368904', '35.913423'], ['119.382122', '35.901176'], ['119.387271', '35.912501'], ['119.398258', '35.904600']]
  private markers: any[] = []
  // 非报警 点对象列表
  private markObjList: any[] = []
  private markWarnObjList: any[] = []
  private warnMarkers: any[] = []
  private markerParams: IMarkerParams = {
    page: 1,
    perpage: 20
    // group: '',
    // state: 1,
    // keyword: ''
  }

  mounted() {
    this.map = this.initAMap()
    this.map.on('complete', () => {
      // 地图图块加载完成后触发
      console.log('地图加载完成')
    })
    this.requestUserData(this.markerParams)
    this.showSomeCity()
  }

  beforeDestroy() {
    clearTimeout(this.timer)
  }

  private showSomeCity() {
    const cityList = [
      { lng: 91.171961, lat: 29.653482 }, // 拉萨市
      { lng: 88.885148, lat: 29.267519 }, // 日客则
      { lng: 97.178452, lat: 31.136875 }, // 昌都
      { lng: 94.36149, lat: 29.649128 }, // 林芝市
      { lng: 91.773134, lat: 29.237137 }, // 山南市
      { lng: 92.051746, lat: 31.478148 }, // 那曲市
      { lng: 80.105498, lat: 32.503187 } // 阿里地区
    ]

    cityList.forEach(item => {
      this.painPosition(item)
    })

    // this.painPosition({ lng: 91.171961, lat: 29.653482 })
  }

  private painPosition(position: any) {
    const { lng, lat } = position
    // let mIcon = '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png'
    let mIcon = ''
    this.getMarkAdress(lng, lat).then(address => {
      const lnglats = this.handleConverGps([lng, lat]).then((res: any) => {
        const marke = new AMap.Marker({
          map: this.map,
          icon: mIcon,
          // content: marker.content,
          position: [res.lng, res.lat],
          offset: new AMap.Pixel(-13, -30)
        })
        // 实例化信息窗体
        // marke.setAnimation('AMAP_ANIMATION_BOUNCE')
        const title = `${address}`

        const content: any[] = []
        content.push(`地址：${address}`)
        // content.push("<a href='https://ditu.amap.com/detail/B000A8URXB?citycode=110105'>详细信息</a>")
        // 鼠标点击marker弹出自定义的信息窗体
        // AMap.event.addListener(marke, 'click', () => {
        //   const infoWindow = this.createInfoWindow(title, content)
        //   infoWindow.open(this.map, marke.getPosition())
        // })
      })
    })
  }

  /**
   * @message: 获取用户列表
   * @parameter:
   * @Return:
   * @Date: 2019-09-30 18:58:06
   */
  private async requestUserData(mData: IMarkerParams) {
    this.markObjList = []
    this.markWarnObjList = []
    const resData = await getUserList<IResponseData>(mData)
    const {
      status_code,
      data: { list },
      message
    } = resData
    console.log('requestUserData resData: ', resData)
    if (+status_code !== 200) {
      return this.$elementMessage(message || '轨迹信息获取失败')
      clearTimeout(this.timer)
    }
    clearTimeout(this.timer)
    // 渲染正常设备
    const fn = R.pipe(
      this.createUserIdList,
      this.requestDeviceList
    )
    // 渲染报警设备
    const fn2 = R.pipe(
      this.createUserIdList,
      this.requestWarnMarkerData
    )
    fn(list)
    fn2(list)
    this.showSomeCity()

    this.timer = setTimeout(() => {
      this.requestUserData(this.markerParams)
    }, 60000)
  }

  /**
   * @message: 递归请求请求设备坐标点列表
   * @parameter:
   * @Return:
   */
  private async requestDeviceList(list: any[]): Promise<any> {
    const paramData = {
      imei: JSON.stringify({
        imeis: list
      })
    }
    const resData = await getDeviceMarkerList<IResponseData>(paramData)
    const { status_code, data, message } = resData
    if (+status_code !== 200) return this.$elementMessage(message || '轨迹信息获取失败')
    this.removeAllOverlay()
    this.drawMarker(data)
    this.createRealMarkerDate(data)
  }

  /**
   * @message: 递归请求请求设备坐标点列表
   * @parameter:
   * @Return:
   * @Date: 2019-09-30 18:58:06
   */
  private async requestWarnMarkerData(list: any[]) {
    const paramData = {
      imei: JSON.stringify({ imeis: list }),
      // TODO
      // time: formatCurDate('yyyy-MM-dd HH:mm:ss')
      time: '2019-11-04 20:04:16'
    }
    const resData = await getWarnDeviceMarkerList<IResponseData>(paramData)
    const { status_code, data, message } = resData
    console.log('requestWarnMarkerData: ', resData)
    if (+status_code !== 200) return this.$elementMessage(message || '轨迹信息获取失败')
    // this.warnMarkers = data
    this.drawMarker(data, 2)
    this.createRealMarkerDate(data, 2)
  }

  /**
   * @message: 获取历史轨迹
   * @parameter:
   * @Return:
   * @Date: 2019-11-03 18:33:52
   */
  private async requestHistoryTrack(imei: number): Promise<any> {
    const resData = await getDeviceTracks<IResponseData>(imei)
    const { status_code, data, message } = resData
    if (+status_code !== 200) {
      return this.$elementMessage(message || '轨迹信息获取失败')
    }
    // this.removeAllOverlay()
    this.removePolyline(this.polyline)
    this.getPolyLineData(data)
  }

  /**
   * @message: 请求当前轨迹坐标
   * @parameter:
   * @Return:
   * @Date: 2019-09-30 18:58:06
   */
  private async requestCurTracks(obj: any) {
    const { id, type, index } = obj
    const paramData =
      type === 2
        ? {
            imei: JSON.stringify({ imeis: [{ imei: id }] }),
            // TODO
            // time: formatCurDate('yyyy-MM-dd HH:mm:ss')
            time: '2019-11-04 20:04:16'
          }
        : {
            imei: JSON.stringify({ imeis: [{ imei: id }] })
          }
    const requestApi = type === 2 ? getWarnDeviceMarkerList : getDeviceMarkerList
    const resData = await requestApi<IResponseData>(paramData)
    const { status_code, data, message } = resData
    console.log('请求当前轨迹坐标 requestCurTracks data-----: ', data)
    if (+status_code !== 200) {
      return this.$elementMessage(message || '轨迹信息获取失败')
    }

    const { lat, lng } = data[0]
    this.handleConverGps([lng, lat]).then((res: any) => {
      const curMarkObj = type === 2 ? this.markWarnObjList[index] : this.markObjList[index]
      // 更新点标记位置
      curMarkObj.setPosition([res.lng, res.lat])
      // 将坐标点设置为可视区域
      this.map.setFitView([curMarkObj])
      // 设置显示比例尺
      // this.map.setZoom(15)
    })
  }

  /**
   * @message: 显示地图的某个点
   * @parameter:
   * @Return:
   * @Date: 2019-10-02 14:35:51
   */
  showMarkerPositin(position: any) {
    console.log('position: ', position)
    const { index, lt, id, nType, state } = position
    this.handleConverGps(lt).then((res: any) => {
      const curMarkObj = nType === 2 ? this.markWarnObjList[index] : this.markObjList[index]
      // 更新点标记位置
      curMarkObj.setPosition([res.lng, res.lat])
      // 将坐标点设置为可视区域
      if (!state) {
        curMarkObj.hide()
      } else {
        curMarkObj.show()
      }
      // this.map.setFitView([curMarkObj])
      // 设置显示比例尺
      // this.map.setZoom(15)
    })
  }

  // 创建用户列表的 设备 imei 数组
  private createUserIdList(list: any[]): any[] {
    return list.map(item => {
      return { imei: item.imei }
    })
  }

  /**
   * @message: 监听搜索按钮
   * @parameter:
   * @Return:
   * @Date: 2019-10-04 22:07:41
   */
  private onSearch(): void {
    this.markerParams.keyword = this.keyword
    this.requestUserData(this.markerParams)
  }

  /**
   * @message: 在线状态切换
   * @parameter:
   * @Return:
   * @Date: 2019-10-04 21:52:42
   */
  private onHandleStateChange(e: string) {
    this.markerParams.state = +e
    this.requestUserData(this.markerParams)
  }

  /**
   * @message: 生成渲染 markder 列表标记
   * @parameter:
   * @Return:
   * @Date: 2019-10-03 13:50:35
   */
  private async createRealMarkerDate(dataList: any[], type?: number) {
    const madta = await Promise.all(
      dataList.map((item: any) => {
        return this.getAddAddressMark(item)
      })
    )
    if (type === 2) {
      this.warnMarkers = madta
      console.log('this.warnMarkers: ', this.warnMarkers)
    } else {
      this.markers = madta
    }
  }

  /**
   * @message: 获取地址
   * @params:
   * @Return:
   */
  private getAddAddressMark(item: any) {
    const { lng, lat } = item
    return new Promise((resolve, reject) => {
      AMap.service('AMap.Geocoder', function() {
        const iconMap: any = {
          1: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png',
          2: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png'
        }
        const content = `<div class="custom-content-marker"><img src="${iconMap[item.dataType]}"></div>`
        item.content = content
        item.isShow = true
        // 回调函数
        // 实例化Geocoder
        const geocoder = new AMap.Geocoder({
          city: '' // 城市，默认：“全国”
        })
        const lnglatXY = [lng, lat] // 地图上所标点的坐标
        let address = ''
        geocoder.getAddress(lnglatXY, function(status: any, result: any) {
          if (status === 'complete' && result.info === 'OK') {
            // console.log('result: ', result);
            // 获得了有效的地址信息:
            address = result.regeocode.formattedAddress
            item.address = address
            resolve(item)
          } else {
            // 获取地址失败
            address = '获取失败'
            item.address = address
            reject(item)
          }
        })
      })
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
  private drawMarker(markers: any[], type?: number) {
    console.log('markers:------ ', markers)
    this.markObjList = []
    let mIcon = '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png'
    if (type === 2) {
      mIcon = '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png'
    }
    markers &&
      markers.forEach(marker => {
        const { lng, lat, imei } = marker
        this.getMarkAdress(lng, lat).then(address => {
          const lnglats = this.handleConverGps([lng, lat]).then((res: any) => {
            const marke = new AMap.Marker({
              map: this.map,
              icon: mIcon,
              // content: marker.content,
              position: [res.lng, res.lat],
              offset: new AMap.Pixel(-13, -30)
            })
            // 实例化信息窗体
            let warnDiv = ''
            if (type === 2) {
              // 设置点标记的动画效果，此处为弹跳效果
              marke.setAnimation('AMAP_ANIMATION_BOUNCE')
              warnDiv = '<span style="font-size:11px;color:#F00;">报警</span>'
              this.markWarnObjList.push(marke)
            } else {
              this.markObjList.push(marke)
            }
            const title = `${marker.device_name}(${marker.imei})${warnDiv}`

            const content: any[] = []
            content.push(`地址：${address}`)
            content.push(`位置更新于：${marker.dataTime}`)
            content.push(`设备信息: | 电量:${marker.electricity}% | 信号:${marker.signal_new}% | 更新时间 ${marker.dataTime}`)
            // content.push("<a href='https://ditu.amap.com/detail/B000A8URXB?citycode=110105'>详细信息</a>")
            // 鼠标点击marker弹出自定义的信息窗体
            AMap.event.addListener(marke, 'click', () => {
              const infoWindow = this.createInfoWindow(title, content)
              infoWindow.open(this.map, marke.getPosition())
            })
          })
        })
      })
    console.log('-正常设备列表: markObjList---', this.markObjList)
    console.log('--报警设备列表: markWarnObjList--', this.markWarnObjList)
  }

  /**
   * @message: 获取转换过后的轨迹列表
   * @parameter:
   * @Return:
   */
  private async getPolyLineData(dataList: any) {
    if (!dataList) return
    const resData = await Promise.all(
      dataList.map((item: any) => {
        return this.handleConverGps([item.lng, item.lat])
      })
    )
    this.addPolyLine(resData)
    return resData
  }

  /**
   * @message: 增加轨迹
   * @parameter:
   * @Return:
   * @Date: 2019-09-30 17:26:22
   */
  private addPolyLine(promiseData: any) {
    const fn = R.pipe(
      this.hanleTrakData,
      this.createPolyLine
    )
    this.polyline = fn(promiseData)
    this.map.add(this.polyline)
    this.map.setFitView([this.polyline])
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
   * @message: 清除地图上所有添加的覆盖物
   * @parameter:
   * @Return:
   * @Date: 2019-09-30 18:55:43
   */
  private removePolyline(polyline: any): void {
    if (!polyline) return
    this.map.remove(polyline)
  }

  /**
   * @message: 初始化地图
   * @parameter:
   * @Return:
   * @Date: 2019-09-30 16:49:23
   */
  private initAMap() {
    const map = new AMap.Map('container', {
      zoom: this.zoom, // 地图显示的缩放级别
      center: this.center
    })
    AMap.plugin(['AMap.ToolBar', 'AMap.Scale', 'AMap.Geolocation', 'AMap.MapType'], () => {
      // 异步同时加载多个插件
      const toolbar = new AMap.ToolBar()
      const scale = new AMap.Scale()
      const mapType = new AMap.MapType()
      const geolocation = new AMap.Geolocation({
        enableHighAccuracy: true, // 是否使用高精度定位，默认:true
        timeout: 10000, // 超过10秒后停止定位，默认：无穷大
        buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        zoomToAccuracy: true, // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        buttonPosition: 'RB'
      })
      map.addControl(toolbar)
      map.addControl(scale)
      map.addControl(geolocation)
      map.addControl(mapType)
      // 获取当前位置信息
      // this.getCurrentPosition(geolocation)
    })
    // 设置地图主题样式
    map.setMapStyle('amap://styles/whitesmoke')
    // map.setFeatures(['road','point']); // 多个种类要素显示
    // this.map.setMap()
    // this.map.setCenter([116.305467, 39.807761]) // 设置中心点
    return map
  }

  /**
   * @message: 根据经纬度获取位置信息
   * @parameter:
   * @Return:
   * @Date: 2019-11-03 19:19:33
   */
  private getMarkAdress(lng: number, lat: number) {
    return new Promise((resolve, reject) => {
      AMap.service('AMap.Geocoder', function() {
        // 回调函数
        // 实例化Geocoder
        const geocoder = new AMap.Geocoder({
          city: '' // 城市，默认：“全国”
        })
        const lnglatXY = [lng, lat] // 地图上所标点的坐标
        // console.log('lnglatXY: ', lnglatXY)
        let address = ''
        geocoder.getAddress(lnglatXY, function(status: any, result: any) {
          if (status === 'complete' && result.info === 'OK') {
            // console.log('result: ', result);
            // 获得了有效的地址信息:
            address = result.regeocode.formattedAddress
            resolve(address)
          } else {
            // 获取地址失败
            address = '获取失败'
            reject(address)
          }
        })
      })
    })
  }

  /**
   * @message: 获取当前位置信息
   * @parameter:
   * @Return:
   * @Date: 2019-11-03 17:55:00
   */
  private getCurrentPosition(geolocation: any) {
    geolocation.getCurrentPosition()
    AMap.event.addListener(geolocation, 'complete', this.onComplete) // 返回定位信息
    AMap.event.addListener(geolocation, 'error', this.onError) // 返回定位出错信息
  }

  /**
   * @message: 解析定位结果
   * @parameter:
   * @Return:
   * @Date: 2019-11-03 17:34:33
   */
  private onComplete(data: any) {
    console.log('data: ', data)
    var str = ['定位成功']
    str.push('经度：' + data.position.getLng())
    str.push('纬度：' + data.position.getLat())
    const lnglatXY = [data.position.getLng(), data.position.getLat()] // 已知点坐标
    this.regeocoder(lnglatXY)
    if (data.accuracy) {
      str.push('精度：' + data.accuracy + ' 米')
    } // 如为IP精确定位结果则没有精度信息
    str.push('是否经过偏移：' + (data.isConverted ? '是' : '否'))
    console.log('---===位置信息', str.join('<br>'))
    // document.getElementById('tip').innerHTML = str.join('<br>')
  }

  /**
   * @message: 处理定位错误信息
   * @parameter:
   * @Return:
   * @Date: 2019-11-03 17:34:49
   */
  private onError(data: any) {
    console.log('定位失败: ', data)
  }

  /**
   * @message: 逆地理编码
   * @parameter:
   * @Return:
   * @Date: 2019-11-03 17:33:20
   */
  private regeocoder(loc: any) {
    // 逆地理编码
    var geocoder = new AMap.Geocoder({
      radius: 1000,
      extensions: 'all'
    })
    geocoder.getAddress(loc, (status: any, result: any) => {
      if (status === 'complete' && result.info === 'OK') {
        console.dir(result)
        this.geocoder_CallBack(result)
      }
    })
    var marker = new AMap.Marker({
      // 加点
      map: this.map,
      position: loc
    })
    this.map.setFitView()
  }
  /**
   * @message: 获取地址
   * @parameter:
   * @Return:
   * @Date: 2019-11-03 18:30:22
   */
  private geocoder_CallBack(data: any) {
    const address = data.regeocode.formattedAddress // 返回地址描述
    console.log('address: ', address)
    // document.getElementById('result').innerHTML = address
  }

  /**
   * @message: 获取轨迹装换数据
   * @parameter:
   * @Return:
   * @Date: 2019-09-30 17:12:20
   */
  private hanleTrakData(arr: any[]) {
    console.log('hanleTrakData: ')
    const newArr = arr.map(item => {
      return new AMap.LngLat(item.lng, item.lat)
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
.el-input--mini .el-input__inner {
  background: #32667c;
  border: none;
}
.el-radio-group {
  width: 100%;
}
.el-radio-button {
  width: 33.33%;
}
.el-radio-button__inner {
  width: 100%;
}
.el-button-group {
  width: 100%;
}
.el-button--default.el-button--mini {
  background: #025172;
  border-color: #025172;
  color: #a6d5d9;
  width: 33.33%;
}
.el-button-group > .el-button:not(:first-child):not(:last-child) {
  border-left: solid 1px #01415c;
}
.el-button-group > .el-button:last-child {
  border-left: solid 1px #01415c;
}
.el-radio-button--medium .el-radio-button__inner {
  background: #025172;
  border: none;
  color: #a6d5d9;
}
.el-radio-button__orig-radio:checked + .el-radio-button__inner {
  background: #a6d5db;
  color: #40a8ac;
}
</style>
<style lang="scss" scoped>
.main-map-container {
  min-height: 100%;
  background-color: #011236;
  display: flex;
  min-width: 1400px;

  .el-button--primary.is-plain {
    background: #009b9b;
    border: none;
    color: white;
  }

  .bg_border {
    position: absolute;
  }
  .border_right_top {
    top: 40px;
    right: 0;
  }
  .border_right_bottom {
    right: 0;
    bottom: 120px;
  }
  .border_left_top {
    top: 40px;
    left: 0;
  }
  .border_left_bottom {
    left: -25px;
    bottom: 120px;
  }

  .app-container {
    padding: 20px 40px;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
    margin-right: 80px;
    padding-bottom: 10px;
    position: relative;

    .top_img {
      text-align: center;
      margin-bottom: 10px;
      position: relative;
      .top_text {
        width: 900px;
        text-align: center;
        @include center;
        font-size: 18px;
        color: #ffffff;
        margin-left: 40px;
        font-weight: 600;
      }
      img {
        width: 900px;
      }
    }
    #container {
      width: 100%;
      flex: 1;
      border-radius: 15px;
      border: solid 1px #006c83;
      padding: 40px;
    }
    .main_bottom {
      width: 100%;
      min-height: 112px;
      background: #01405b;
      border-radius: 8px;
      color: #a6d5d9;
      font-size: 20px;
      font-weight: 600;
      display: flex;
      align-items: center;
      border: solid 1px #006c83;
      margin-top: 40px;
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
    width: 470px;
    color: #01405b;
    position: relative;
    right: 30px;
    top: 15px;
    .device_item {
      cursor: pointer;
      background: #01405b;
      border-bottom: solid 1px #205e75;

      margin: 5px;
      font-size: 14px;
      padding-bottom: 1px;
      .device_name {
        padding-top: 10px;
      }
      .position_info {
      }
      .device_info {
        font-size: 12px;
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
    .top_content_box {
      border-radius: 16px;
      background: #01405b;
      padding: 0 30px;
      height: 62%;
      border: solid 1px #006c83;
      position: relative;
      top: 50px;
      .bg_border {
        position: absolute;
      }
      .border_right_top {
        top: -25px;
        right: -30px;
      }
      .border_right_bottom {
        right: -30px;
        bottom: -30px;
      }
      .border_left_top {
        top: -25px;
        left: -30px;
      }
      .border_left_bottom {
        left: -55px;
        bottom: -30px;
      }
      // top: 55px;
      .app_right_title {
        padding: 20px;
        padding-top: 10px;
        color: #00f5fd;
        font-size: 18px;
        font-weight: 600;
        text-align: center;
        position: relative;
        margin-top: 10px;
        margin-bottom: 20px;
        img {
          @include center;
          width: 100%;
          margin-top: 15px;
        }
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
        display: flex;
        color: #a6d5d9;
        font-size: 14px;
        align-items: center;
        margin-bottom: 20px;
      }
      .line_state_box {
        text-align: center;
      }
      .content_box {
        border-radius: 8px;
        border-radius: 8px;
        position: absolute;
        top: 110px;
        margin-right: 20px;
        bottom: 20px;
        width: 90%;
        overflow-y: scroll;
        scrollbar-arrow-color: #ffffff;
      }
    }
    .bottom_content_box {
      position: absolute;
      bottom: 10px;
      height: 25%;
      padding: 30px;
      box-sizing: border-box;
      width: 100%;
      border-radius: 16px;
      margin-bottom: 10px;
      border: solid 1px #006c83;
      margin-right: 15px;
      background: #01405b;
      padding-top: 10px;
      .app_right_title {
        padding: 20px;
        padding-top: 10px;
        color: #00f5fd;
        font-size: 18px;
        font-weight: 600;
        text-align: center;
        position: relative;
        margin-top: 10px;
        margin-bottom: 20px;
        img {
          @include center;
          width: 100%;
          margin-top: 15px;
        }
      }

      .wran_title {
        padding: 3px;
        color: #00f5fd;
        font-size: 18px;
        font-weight: 600;
        text-align: center;
        position: relative;
        img {
          @include center;
          width: 100%;
          margin-top: 15px;
        }
      }
      .warn_box {
        background: #01405b;
        border-radius: 8px;
        position: absolute;
        top: 50px;
        bottom: 10px;
        width: 90%;
        overflow-y: scroll;
        scrollbar-arrow-color: #ffffff;
      }
    }
  }
}
</style>
