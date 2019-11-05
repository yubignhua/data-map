<template>
  <div class="school_radar_detail">
    <div class="title">
      <h2>{{ school_info.school_name }}</h2>
      <div style="margin-right:30px;font-size:14px">
        数据更新于:
        <span style="color:#3A71A8">{{ update }}</span>
      </div>
    </div>
    <div class="base_Info_box">
      <h3>基础信息</h3>
      <div class="content">
        <div class="bi_item">
          合作品牌:
          <span class="mkeyword">{{ school_info.school_brand || '--' }}</span>
        </div>
        <div class="bi_item">
          机构类型:
          <span class="mkeyword">{{ school_info.school_type || '--' }}</span>
        </div>
        <div class="bi_item">
          首次签约时间:
          <span class="mkeyword">{{ school_info.first_contract_date || '--' }}</span>
        </div>
        <div class="bi_item">
          累计签约教室数:
          <span class="mkeyword">{{ school_info.contract_classrooms || '--' }}</span>
        </div>
        <div class="bi_item">
          累计交付教室数:
          <span class="mkeyword">{{ school_info.can_use_classrooms || '--' }}</span>
        </div>
        <div class="bi_item">
          累计已排课教室数:
          <span class="mkeyword">{{ school_info.class_classrooms || '--' }}</span>
        </div>
        <div class="bi_item">
          机构地址:
          <span class="mkeyword">{{ school_info.address || '--' }}</span>
        </div>
      </div>
    </div>
    <div class="base_Info_box">
      <h3>账号情况</h3>
      <div class="content">
        <div class="bi_item">
          校长名称:
          <span class="mkeyword">{{ school_info.admin_user || '--' }}</span>
        </div>
        <div class="bi_item">
          校长联系方式:
          <span class="mkeyword">{{ school_info.admin_tel || '--' }}</span>
        </div>
        <div class="bi_item">
          功能权限:
          <span class="mkeyword">{{ school_info.fun_auth || '--' }}</span>
        </div>
      </div>
    </div>
    <div class="base_Info_box">
      <h3>合作历程</h3>
      <div class="content">
        <div class="bi_item">
          双师签约日期:
          <span class="mkeyword">{{ school_info.live_contract_date || '--' }}</span>
        </div>
        <div class="bi_item">
          内容签约日期:
          <span class="mkeyword">{{ school_info.content_contract_date || '--' }}</span>
        </div>
        <div class="bi_item">
          双师交付日期:
          <span class="mkeyword">{{ school_info.first_classroom_can_use_date || '--' }}</span>
        </div>
        <div class="bi_item">
          双师开课日期:
          <span class="mkeyword">{{ school_info.first_live_class_date || '--' }}</span>
        </div>
        <div class="bi_item">
          AI开课日期:
          <span class="mkeyword">{{ school_info.first_ai_class_date || '--' }}</span>
        </div>
        <div class="bi_item">
          最近开课时间:
          <span class="mkeyword">{{ school_info.last_class_date || '--' }}</span>
        </div>
        <div class="bi_item">
          开课学期数:
          <span class="mkeyword">{{ school_info.class_terms || '--' }}</span>
        </div>
        <div class="bi_item">
          最近一笔消费:
          <span class="mkeyword">{{ school_info.last_consume || '--' }}</span>
        </div>
      </div>
    </div>
    <!-- 双师业务 -->
    <div
      v-if="live_business.length"
      class="base_Info_box">
      <h3>魔法双师业务</h3>
      <div class="content">
        <TabTable :data-list="live_business">
          <template slot-scope="scope">
            <el-table
              :data="scope.row"
              style="width: 100%">
              <el-table-column
                prop="row_name"
                label="指标名称" />
              <el-table-column
                prop="spring"
                label="春" />
              <el-table-column
                prop="summer"
                label="暑" />
              <el-table-column
                prop="autumn"
                label="秋" />
              <el-table-column
                prop="winter"
                label="寒" />
            </el-table>
          </template>
        </TabTable>
      </div>
    </div>
    <!-- 双师学生人次-->
    <div
      v-if="live_student.length"
      class="base_Info_box">
      <h3>魔法双师学生人次</h3>
      <div class="content">
        <TabTable :data-list="live_student">
          <template slot-scope="scope">
            <el-table
              :data="scope.row"
              style="width: 100%">
              <!-- <el-table-column prop="row_name" label="指标名称" /> -->
              <el-table-column
                prop="subject"
                label="学科" />
              <el-table-column
                prop="grade"
                label="年级" />
              <el-table-column
                prop="spring"
                label="春" />
              <el-table-column
                prop="summer"
                label="暑" />
              <el-table-column
                prop="autumn"
                label="秋" />
              <el-table-column
                prop="winter"
                label="寒" />
            </el-table>
          </template>
        </TabTable>
      </div>
    </div>
    <!-- 双师续报率-->
    <div
      v-if="live_go_on.length"
      class="base_Info_box">
      <h3>魔法双师续报率</h3>
      <div class="content">
        <TabTable :data-list="live_go_on">
          <template slot-scope="scope">
            <el-table
              :data="scope.row"
              style="width: 100%">
              <el-table-column
                prop="subject"
                label="学科/续报期" />
              <el-table-column
                prop="spring"
                label="春续暑" />
              <el-table-column
                prop="summer"
                label="暑续秋" />
              <el-table-column
                prop="autumn"
                label="秋续寒" />
              <el-table-column
                prop="winter"
                label="寒续春" />
            </el-table>
          </template>
        </TabTable>
      </div>
    </div>
    <!-- Ai业务 -->
    <div
      v-if="ai_business.length"
      class="base_Info_box">
      <h3>魔法AI业务</h3>
      <div class="content">
        <TabTable :data-list="ai_business">
          <template slot-scope="scope">
            <el-table
              :data="scope.row"
              style="width: 100%">
              <el-table-column
                prop="row_name"
                label="指标名称" />
              <el-table-column
                prop="spring"
                label="春" />
              <el-table-column
                prop="summer"
                label="暑" />
              <el-table-column
                prop="autumn"
                label="秋" />
              <el-table-column
                prop="winter"
                label="寒" />
            </el-table>
          </template>
        </TabTable>
      </div>
    </div>
    <!-- 教材消耗 -->
    <div
      v-if="book_consume.length"
      class="base_Info_box">
      <h3>教材消耗</h3>
      <div class="content">
        <TabTable :data-list="book_consume">
          <template slot-scope="scope">
            <el-table
              :data="scope.row"
              style="width: 100%">
              <!-- <el-table-column prop="row_name" label="指标名称" /> -->
              <el-table-column
                prop="spring"
                label="春" />
              <el-table-column
                prop="summer"
                label="暑" />
              <el-table-column
                prop="autumn"
                label="秋" />
              <el-table-column
                prop="winter"
                label="寒" />
              <el-table-column
                prop="total_consume"
                label="累计" />
            </el-table>
          </template>
        </TabTable>
      </div>
    </div>
    <!-- 课程包消耗 -->
    <div
      v-if="bag_consume.length"
      class="base_Info_box">
      <h3>课程包消耗</h3>
      <div class="content">
        <TabTable :data-list="bag_consume">
          <template slot-scope="scope">
            <el-table
              :data="scope.row"
              style="width: 100%">
              <!-- <el-table-column prop="row_name" label="指标名称" /> -->
              <el-table-column
                prop="subjects"
                label="学科" />
              <el-table-column
                prop="grades"
                label="年级" />
              <el-table-column
                prop="total"
                label="总计" />
            </el-table>
          </template>
        </TabTable>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getRadarSchoolDetail } from '@/services/dtsRank/index'
import TabTable from './components/tabsTable.vue'
@Component({
  name: 'schoolRadarDetail',
  components: { TabTable }
})
export default class extends Vue {
  private update: string = '--'
  private school_info: object = {}
  private ai_business: object = {}
  private live_business: object = {}
  private live_go_on: object = {}
  private live_student: object = {}
  private bag_consume: object = {}
  private book_consume: object = {}
  private loading: any

  created() {
    this.loading = this.$loading({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading'
    })
    const { schoolId } = this.$router.currentRoute.query
    this.requsetSchDetail(+schoolId)
  }

  /**
   * @message: 情感求机构详细信息
   * @parameter:
   * @Return:
   * @Date: 2019-09-18 11:08:02
   */
  private async requsetSchDetail(id: number): Promise<any> {
    const resData = await getRadarSchoolDetail<IResponseData>({ school_id: id })
    const {
      ok,
      message,
      data: {
        ai_business,
        bag_consume,
        book_consume,
        live_business,
        live_go_on,
        live_student,
        school_info,
        date
      }
    } = resData
    if (!ok) {
      return this.$message({
        message: '网络请求失败' || message,
        type: 'error'
      })
    }
    this.loading.close()
    this.school_info = school_info
    this.ai_business = ai_business
    this.live_business = live_business
    this.live_go_on = live_go_on
    this.live_student = live_student
    this.bag_consume = bag_consume
    this.book_consume = book_consume
    this.update = date
  }
}
</script>

<style scoped lang="scss">
.school_radar_detail {
  h3 {
    color: #202428;
  }
  margin-left: 10px;
  margin-top: 10px;
  background-color: #ffffff;
  padding: 20px;
  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 80px;
    border-bottom: solid 1px #999999;
  }
  .base_Info_box {
    margin-top: 30px;
    color: #666;
    .content {
      margin-top: 10px;
      display: flex;
      flex-wrap: wrap;
      //   justify-content: space-around
      .bi_item {
        margin: 10px 20px;
      }
    }
  }
}
</style>
