<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-30 11:39:44
 * @LastEditTime: 2019-10-09 08:05:43
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="school_radar_container">
    <router-view />
    <template>
      <div class="table_header">
        <div class="left_box">
          <div class="title">
            <h2>设备列表</h2>
          </div>
          <div class="selected_box">
            <el-select v-model="value1" placeholder="请选择" @change="onSelectChange1">
              <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </div>
        <div class="search_input_box">
          <el-input
            v-model="redarParams.keyword"
            placeholder="请输入内容"
            prefix-icon="el-icon-search"
            clearable
            @change="onInputChange"
            @keyup.enter.native="onSearch"
          />
          <el-button type="defalut" @click="onSearch">查询</el-button>
          <el-button type="defalut" @click="onAddDevice()">添加设备</el-button>
        </div>
      </div>
      <!-- 表单 -->
      <el-table
        ref="table"
        v-loading="loading"
        :height="tableHeight"
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column align="center" prop="device_name" label="设备名称" />
        <el-table-column align="center" prop="imei" label="设备码" />
        <el-table-column align="center" prop="address" label="设备所在地址" />
        <el-table-column align="center" prop="position" label="经纬度" />
        <el-table-column align="center" prop="electric" label="电量" />
        <el-table-column align="center" prop="signal" label="信号强度" />
        <el-table-column align="center" prop="online_state" label="在线状态" />
        <el-table-column align="center" prop="update_time" label="更新时间" />
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <router-link
              :to="{path: '/school_options/radar_detail', query: {schoolId: scope.row.school_id}}">
              <el-button size="mini">操作</el-button>
            </router-link>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分液器 -->
      <div class="pagination_block">
        <el-pagination
          :current-page.sync="currentPage"
          layout="prev, pager, next, jumper"
          :page-size="20"
          :total="totalPage"
          @current-change="onCurrentChange"
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { TestModule } from '@/store/modules/test'
import { AppModule } from '@/store/modules/app'
import { getRadarSchool } from '@/services/dtsRank/index'
import { getYearTerm } from '@/services/common'
import { setTimeout } from 'timers'
import { dataList } from '../../mainboard/data'

interface IReadarParams {
  year: number
  term: number
  type: number
  keyword: string
  page: number
  per_page: number
}

interface ISelectItem {
  value: string
  label: string
}

@Component({
  name: 'schoolRadar'
})
export default class extends Vue {
  private input2: string = ''
  private tableData: any[] = dataList

  private currentPage: number = 0
  private options1: any[] = []
  private value1: string = ''

  private totalPage: number = 0
  private date: string = ''
  private loading: boolean = false
  private tableHeight = '500px'
  private redarParams: IReadarParams = {
    year: 0,
    term: 0,
    type: 1,
    keyword: '',
    page: 1,
    per_page: 20
  }

  created() {
    const data = {}
    this.tableHeight = document.body.clientHeight - 230 + 'px'
  }

  /**
   * @message: 获取机构雷达列表
   * @parameter:
   * @Return:
   * @Date: 2019-09-20 11:16:47
   */
  private async requetRedarData(mdata: IReadarParams): Promise<any> {
    this.loading = true
    const resData = await getRadarSchool<IResponseData>(mdata)
    this.loading = false
    const {
      data: { data, total, date },
      ok,
      message
    } = resData
    if (!ok) {
      return this.$message({
        type: 'error',
        message: message || '网络错误'
      })
    }
    this.tableData = data
    this.totalPage = total
    this.date = date
    this.$nextTick(() => {
      (this.$refs.table as any).bodyWrapper.scrollTop = 0
    })
  }

  // 监听搜索输入框
  private onInputChange(e: string): void {
    this.redarParams.keyword = e.trim()
  }

  // 监听 page 变化
  private onCurrentChange(e: any): void {
    console.log('onCurrentChange e: ', e)
    this.redarParams.page = e
    this.requetRedarData(this.redarParams)
  }

  // 季度 select
  private onSelectChange1(e: any): void {
    const selectValue = JSON.parse(e)
    this.redarParams.year = selectValue.year
    this.redarParams.term = selectValue.term_id
    this.redarParams.term = selectValue.term_id
    this.redarParams.page = 1
    this.currentPage = 0
    this.redarParams.keyword = ''
    this.requetRedarData(this.redarParams)
  }

  // 监听查询按钮
  private onSearch(): void {
    this.requetRedarData(this.redarParams)
  }
  // 监听添加设备
  private onAddDevice(): void {
    // this.requetRedarData(this.redarParams)
  }
}
</script>

<style lang="scss" scoped>
.school_radar_container {
  margin-left: 10px;
  margin-top: 10px;
  background-color: #ffffff;
  padding: 20px;
  .el-table thead.is-group th {
    background: #48505a;
    color: white;
  }
  .table_header {
    height: 80px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left_box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title {
        margin-right: 100px;
      }

      .selected_box {
        color: #666;
        display: flex;
        justify-content: space-around;
        align-items: center;
        width: 600px;
      }
    }
    .search_input_box {
      display: flex;
    }
  }
}
</style>
