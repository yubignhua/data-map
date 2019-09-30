<template>
  <div class="school_radar_container">
    <router-view />
    <template>
      <div class="table_header">
        <div class="left_box">
          <div class="title">
            <h2>机构雷达</h2>
          </div>
          <div class="selected_box">
            <div>数据更新于: {{ date || '0000-00-00' }}</div>
            <el-select
              v-model="value1"
              placeholder="请选择"
              @change="onSelectChange1"
            >
              <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
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
          <el-button
            type="defalut"
            @click="onSearch"
          >
            搜索
          </el-button>
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
        <el-table-column
          align="center"
          prop="school_name"
          label="机构名称"
        />
        <el-table-column
          v-if="[4].includes(redarParams.type)"
          v-show="false"
          align="center"
          label="规模"
        >
          <el-table-column
            align="center"
            prop="book_consume"
            label="当期教材消耗"
          />
        </el-table-column>
        <el-table-column
          v-if="[1,2].includes(redarParams.type)"
          align="center"
          label="规模"
        >
          <el-table-column
            align="center"
            prop="students"
            label="人次"
          />
          <el-table-column
            align="center"
            prop="org_classes"
            label="教学班"
          />
          <el-table-column
            v-if="[1,4].includes(redarParams.type)"
            align="center"
            prop="book_consume"
            :label="[1].includes(redarParams.type)?'当期教材消耗':'教材消耗'"
          />
        </el-table-column>
        <el-table-column
          v-if="redarParams.type !== 4"
          align="center"
          label="效率"
        >
          <el-table-column
            align="center"
            prop="full_class_rate"
            label="满班率(%)"
          />
          <el-table-column
            align="center"
            prop="classroom_rate"
            label="教室效率"
          />
        </el-table-column>
        <el-table-column
          align="center"
          label="业务丰富度"
        >
          <el-table-column
            align="center"
            prop="subject_list"
            :label="[1,2].includes(redarParams.type)?'开课学科分布':'教材学科分布'"
          />
          <el-table-column
            align="center"
            prop="grade_list"
            :label="[1,2].includes(redarParams.type)?'开课年级分布':'教材年级分布'"
          />
        </el-table-column>
        <el-table-column
          align="center"
          label="亲密度"
        >
          <el-table-column
            v-if="[1,4].includes(redarParams.type)"
            align="center"
            prop="contract_date"
            label="签约时间"
          />
          <el-table-column
            v-if="[2].includes(redarParams.type)"
            align="center"
            prop="contract_date"
            label="首次上课时间"
          />
          <el-table-column
            v-if="redarParams.type === 1"
            align="center"
            prop="contract_classrooms"
            label="累计签约教室"
          />
          <el-table-column
            v-if="redarParams.type === 2"
            align="center"
            prop="class_classrooms"
            label="上课教室数"
          />
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
        >
          <template slot-scope="scope">
            <router-link
              :to="{path: '/school_options/radar_detail', query: {schoolId: scope.row.school_id}}"
            >
              <el-button size="mini">
                详情
              </el-button>
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
  private tableData: any[] = []
  private options2: any[] = [
    {
      value: '1',
      label: '双师'
    },
    {
      value: '2',
      label: 'AI'
    },
    {
      value: '4',
      label: '内容'
    }
  ]
  private currentPage: number = 0
  private options1: any[] = []
  private value1: string = ''
  private value2: string = '双师'

  private totalPage: number = 0
  private date: string = ''
  private loading: boolean = true
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
    this.requestSelectList(1)
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

  /**
   * @message: 获取筛选列表
   * @parameter:
   * @Return:
   * @Date: 2019-09-16 15:11:41
   */
  private async requestSelectList(type: number): Promise<any> {
    const configMap: any = {
      1: 'school_radar_live',
      2: 'school_radar_ai',
      4: 'school_radar_content'
    }
    const resData = await getYearTerm<IResponseData>({
      type: configMap[type]
    })
    const { data, ok, message } = resData
    if (!ok) {
      return this.$message({
        type: 'error',
        message: message || '网络错误'
      })
    }
    this.value1 = JSON.stringify({
      term: data[0].term,
      year: data[0].year,
      term_id: data[0].term_id
    })
    this.options1 = this.handleSelectedData(data)
    this.redarParams.year = data[0].year
    this.redarParams.term = data[0].term_id
    this.requetRedarData(this.redarParams)
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
  // 业务 selecte
  private onSelectChange2(e: any): void {
    this.loading = true
    this.redarParams.page = 1
    this.currentPage = 0
    this.redarParams.keyword = ''
    this.requestSelectList(+e)
    this.redarParams.type = +e
  }

  // 监听查询按钮
  private onSearch(): void {
    this.requetRedarData(this.redarParams)
  }

  /**
   * @message: 处理 select s数据
   * @parameter:
   * @Return:
   * @Date: 2019-09-20 11:18:19
   */
  private handleSelectedData(dataList: any): ISelectItem[] {
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
