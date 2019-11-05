<template>
  <div id="areaComponent">
    <el-select
      v-model="address.province"
      filterable
      placeholder="请选择省"
      @change="selectCity">
      <el-option
        v-for="item in provinceOptions"
        :key="item.id"
        :label="item.name"
        :value="item.id" />
    </el-select>
    <el-select
      v-model="address.city"
      filterable
      placeholder="请选择市"
      @change="selectArea">
      <el-option
        v-for="item in cityOptions"
        :key="item.id"
        :label="item.name"
        :value="item.id" />
    </el-select>
    <el-select
      v-model="address.area"
      filterable
      placeholder="请选择区"
      @change="getAreaId">
      <el-option
        v-for="item in areaOptions"
        :key="item.id"
        :label="item.name"
        :value="item.id" />
    </el-select>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator'
const Area = require('./area.json')
@Component({
  name: 'Apparea'
})
export default class extends Vue {
    private address:any = {}
    private provinceOptions:[] = []
    private cityOptions:[] = []
    private areaOptions:[] = []
    private info:any = {
      province: '',
      province_id: '',
      city: '',
      city_id: '',
      area: '',
      area_id: ''
    }
    created() {
      this.getArea()
    }
    getArea() {
      this.provinceOptions = Area
    }
    // 获取城市
    selectCity(value:any) {
      this.cityOptions = []
      this.areaOptions = []
      this.$set(this.address, 'city', '')
      this.$set(this.address, 'area', '')
      this.info.city = ''
      this.info.city_id = ''
      this.info.area = ''
      this.info.area_id = ''
      this.provinceOptions.forEach((item:any) => {
        if (item.id === value) {
          this.info.province_id = item.id
          this.info.province = item.name
          this.cityOptions = item.children
        }
      })
      this.$emit('select', this.info)
    }
    //  获取区
    selectArea(value:any) {
      this.areaOptions = []
      this.$set(this.address, 'area', '')
      this.info.area = ''
      this.info.area_id = ''
      this.cityOptions.forEach((item:any) => {
        if (item.id === value) {
          this.info.city_id = item.id
          this.info.city = item.name
          this.areaOptions = item.children
        }
      })
      this.$emit('select', this.info)
    }
    // hidden 校验
    getAreaId(value:any) {
      this.areaOptions.forEach((item:any) => {
        if (item.id === value) {
          this.info.area_id = item.id
          this.info.area = item.name
        }
      })
      this.$emit('select', this.info)
    }
}
</script>
