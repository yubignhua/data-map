<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-30 11:40:13
 * @LastEditTime: 2019-10-10 14:41:04
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div :class="className" :style="{height: height,width: width}" />
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import echarts from 'echarts'
import { debounce } from '@/utils/index.ts'
import { getAllUser } from '@/services/dataMap/index'
// echarts theme
require('echarts/theme/macarons')

interface IRes extends IResponseData {
  data: {
    dataList: any[],
    home: string,
    type: number,
    getData(param:number):void
  }
}

@Component
export default class PieChart extends Vue {

  private className: string = 'chart'
  private width: string = '100%'
  private height: string = '400px'
  private chart: any = null
  private data: IRes = {
    status_code: 1,
    ok: 1,
    data: {
      dataList: [],
      home: 'asdf',
      type: 1,
      getData(){}
    }
  }

  mounted() {
    this.getData()
    this.initChart()
    window.addEventListener('resize', this.resizeHandler)
  }

  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.resizeHandler)
    this.chart.dispose()
    this.chart = null
  }

   /**
   * @message: 获取数据
   * @params: 
   * @Return: 
   */
  private async getData():Promise<any>{
    const resData = await getAllUser<IRes>()
    console.log('resData: ', resData);

  }

  /**
   * @message: 监听窗口调整大小
   * @params: 
   * @Return: 
   */
  private resizeHandler = debounce(() => {
    if (this.chart) {
      this.chart.resize()
    }
  }, 100)

  /**
   * @message: 初始化 echart
   * @params: 
   * @Return: 
   */
  private initChart() {
    this.chart = echarts.init(this.$el as any, 'macarons')
    this.chart.setOption({
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        left: 'center',
        bottom: '10',
        data: ['在线', '离线', 'Forex', 'Gold', 'Forecasts']
      },
      calculable: true,
      series: [
        {
          name: '数据统计',
          type: 'pie',
          roseType: 'radius',
          radius: [15, 95],
          center: ['50%', '50%'],
          data: [
            { value: 320, name: '在线' },
            { value: 240, name: '离线' }
            // {value: 149, name: 'Forex'},
            // {value: 100, name: 'Gold'},
            // {value: 59, name: 'Forecasts'}
          ],
          animationEasing: 'cubicInOut',
          animationDuration: 2600
        }
      ]
    })
  }
}
</script>
