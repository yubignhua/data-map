<template>
  <div class="dts_rank_container">
    <div class="dts_title_box">
      <div class="dts_title">
        <h2 class="main_board_title">
          机构排名
        </h2>
        <el-select
          v-model="value2"
          placeholder="请选择"
          @change="onSelectChange2"
        >
          <el-option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select
          v-model="value"
          placeholder="请选择"
          @change="onSelectChange"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <el-button
        type="primary"
        @click="onExport"
      >
        导出Excel
      </el-button>
    </div>

    <div class="main_board_content">
      <template>
        <el-table
          ref="table"
          v-loading="loading"
          :data="tableData"
          :height="tableHeight"
          style="width: 100%"
          @sort-change="onSortChange"
        >
          <el-table-column
            prop="index"
            label="排名"
            align="center"
          />
          <el-table-column
            prop="school_name"
            label="机构名称"
            align="center"
          />
          <el-table-column
            prop="students"
            label="学员人次"
            sortable="custom"
            align="center"
          />
          <el-table-column
            prop="signup_students"
            label="报名人数"
            sortable="custom"
            align="center"
          />
          <el-table-column
            v-if="value2!=='live_ai'"
            prop="class_classrooms"
            label="上课教室数"
            sortable="custom"
            align="center"
          />
          <el-table-column
            v-if="value2!=='live_ai'"
            prop="students_div_classrooms"
            label="教室效率"
            sortable="custom"
            align="center"
          >
            <template slot-scope="scope">
              {{ Number(scope.row.students_div_classrooms).toFixed(2) }}
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 分液器 -->
      <div class="pagination_block">
        <el-pagination
          :page-size="20"
          :current-page.sync="currentPage"
          layout="prev, pager, next, jumper"
          :total="totalPage"
          @current-change="onCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/// <reference path="./index.d.ts" />

import { getDtsRankList, exportDtsRank } from '@/services/dtsRank/index'
import { getYearTerm } from '@/services/common'
import { Component, Vue, Watch } from 'vue-property-decorator'
import { stringify } from '@/utils/index'
import { ElTable } from 'element-ui/types/table'
@Component({
  name: 'dtsRank'
})
export default class extends Vue {
  private currentPage: number = 0
  private totalPage: number = 0
  private loading: boolean = true
  private options: any[] = []
  private options2: any[] = [
    {
      value: 'live',
      label: '双师'
    },
    {
      value: 'ai',
      label: 'AI'
    },
    {
      value: 'live_ai',
      label: '双师+AI'
    }
  ]
  private value: string = ''
  private value2: string = 'live'
  private tableHeight: string = '500px'
  private tableData: any = []
  // 双师排名, 请求参数
  private reqParams: IDtsRankParm = {
    year: '',
    term: '',
    per_page: 20,
    page: 1,
    sort_column: 'students_rank',
    sort_asc: '1',
    type: 'live'
  }

  created() {
    this.tableHeight = document.body.clientHeight - 220 + 'px'
    this.requestSelectList('live')
  }

  /**
   * @message: 获取筛选列表
   * @parameter:
   * @Return:
   * @Date: 2019-09-16 15:11:41
   */
  private async requestSelectList(type: string): Promise<any> {
    const configMap: any = {
      live: 'live_school_rank',
      ai: 'ai_school_rank',
      live_ai: 'live_ai_school_rank'
    }
    const resData = await getYearTerm<IResponseData>({
      // type: 'live_school_rank'
      type: configMap[type]
    })
    const { data, ok, message } = resData
    if (!ok) {
      return this.$message({
        message: message || '网络错误',
        type: 'error'
      })
    }
    this.value = JSON.stringify({
      term: data[0].term,
      year: data[0].year,
      term_id: data[0].term_id
    })
    this.reqParams.year = data[0].year
    this.reqParams.term = data[0].term_id
    this.requestTableList(this.reqParams)
    this.options = this.handleSelectedData(data)
  }

  /**
   * @message: 获取双师排名列表
   * @parameter:
   * @Return:
   * @Date: 2019-09-16 15:12:34
   */
  private async requestTableList(param: IDtsRankParm): Promise<any> {
    this.loading = true
    const resData = await getDtsRankList<IResponseData>(param)
    const {
      ok,
      message,
      data: { total, current_page, data }
    } = resData
    if (!ok) {
      return this.$message({
        message: message || '网络错误',
        type: 'error'
      })
    }
    this.loading = false
    this.tableData = data
    this.totalPage = total
    this.$nextTick(() => {
      (this.$refs.table as any).bodyWrapper.scrollTop = 0
    })
  }

  /**
   * @message: 导出 excel
   * @parameter:
   * @Return:
   * @Date: 2019-09-19 17:41:01
   */
  private onExport() {
    window.open(
      process.env.VUE_APP_API_URL +
        '/data_center/export_school_rank' +
        stringify(this.reqParams)
    )
    // const resData = await exportDtsRank<IResponseData>(this.reqParams)
    // console.log(resData)
  }

  private onCurrentChange(e: any) {
    console.log('onCurrentChange e: ', e)
    this.reqParams.page = e
    this.requestTableList(this.reqParams)
  }
  // 监听 select 季度 动作
  private onSelectChange(e: any): void {
    const selectValue = JSON.parse(e)
    this.reqParams.year = selectValue.year
    this.reqParams.term = selectValue.term_id
    this.reqParams.page = 1
    this.currentPage = 0
    this.requestTableList(this.reqParams)
  }

  // 监听 select 业务动作
  private onSelectChange2(e: string): void {
    console.log('e: ', e)
    if (e === 'live_ai') {
      this.reqParams.sort_column = `students_rank`
    }
    this.reqParams.type = e
    this.reqParams.page = 1
    this.currentPage = 0
    this.requestTableList(this.reqParams)
    this.requestSelectList(e)
  }

  // 监听排序动作
  private onSortChange(e: any): void {
    this.handleTypeSort(e)
  }

  /**
   * @message: 处理排序
   * @parameter:
   * @Return:
   * @Date: 2019-09-17 11:25:44
   */
  private handleTypeSort(data: ISortParam): void {
    const orderConf: any = {
      ascending: 1,
      descending: 0
    }
    const selectValue = JSON.parse(this.value || '')
    if (!selectValue) return
    console.log('data==', data)
    const { prop, order, column } = data
    const nProp: string = `${prop}_rank`
    this.reqParams.sort_column = nProp
    this.reqParams.sort_asc = orderConf[order]
    this.reqParams.year = selectValue.year
    this.reqParams.term = selectValue.term_id
    this.requestTableList(this.reqParams)
  }

  /**
   * @message: 处理下拉框数据
   * @parameter:
   * @Return:
   * @Date: 2019-09-17 11:24:49
   */
  private handleSelectedData(dataList: any): [] {
    return dataList.map((item: any) => {
      const data = {
        value: JSON.stringify({
          term: item.term,
          year: item.year,
          term_id: item.term_id
        }),
        label: item.year + item.term + ''
      }
      return data
    })
  }
}
</script>

<style lang="scss" scoped>
@import url('//unpkg.com/element-ui@2.12.0/lib/theme-chalk/index.css');
.dts_rank_container {
  margin-left: 10px;
  margin-top: 10px;
  background-color: #ffffff;
  padding: 20px;
  .dts_title_box {
    display: flex;
    justify-content: space-between;
    .dts_title {
      display: flex;
      align-items: center;
      .main_board_title {
        margin-right: 20px;
      }
    }
  }

  .main_board_content {
    margin-top: 30px;
    .section {
      margin-top: 30px;
      .card_box {
        margin-top: 10px;
        display: flex;
        .el-card {
          width: 180px;
          height: 100px;
          cursor: pointer;
          margin: 10px;
        }
      }
    }
  }
}
</style>
