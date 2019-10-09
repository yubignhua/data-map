<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import echarts from 'echarts';
import { debounce } from '@/utils/index.ts';
// echarts theme
require('echarts/theme/macarons');

@Component
export default class PieChart extends Vue {
  // @Prop({default: 'chart'}) className!: string;
  // @Prop({default: '100%'}) width!: string;
  // @Prop({default: '600px'}) height!: string;

  private className:string = 'chart'
  private width:string = '100%'
  private height:string = '400px'
  private chart: any = null;
  private resizeHandler = debounce(() => {
    if (this.chart) {
      this.chart.resize();
    }
  }, 100);

  mounted() {
    this.initChart();
    window.addEventListener('resize', this.resizeHandler);
  }

  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    window.removeEventListener('resize', this.resizeHandler);
    this.chart.dispose();
    this.chart = null;
  }

  initChart() {
    this.chart = echarts.init(this.$el as any, 'macarons');

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
            {value: 320, name: '在线'},
            {value: 240, name: '离线'},
            // {value: 149, name: 'Forex'},
            // {value: 100, name: 'Gold'},
            // {value: 59, name: 'Forecasts'}
          ],
          animationEasing: 'cubicInOut',
          animationDuration: 2600
        }
      ]
    });
  }
}
</script>

