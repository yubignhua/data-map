<template>
  <div class="app-container">
    <h1 class="main_board_title">未来魔法校商业智能平台</h1>
    <div class="main_board_content">
      <section v-for="(item,index) in dataList" :key="index" class="section">
        <h3>{{ item.name }}</h3>
        <div class="card_box">
          <div class="mcard_box" v-for="(mItem,index) in item.items" :key="index" @click="onChangeTo(mItem)" >
            <el-card class="box-card">
              <div>
                <div class="title">
                  <svg-icon name="班课详情" color="#00b992" width="20" height="20" />
                  {{ mItem.title }}
                </div>
                <div class="content">{{ mItem.des }}</div>
              </div>
            </el-card>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { getIndexData } from '@/services/dtsRank/index'
import { Component, Vue } from 'vue-property-decorator'

interface taskListState {
  count: number
  key: string
  name: string
}

@Component({
  name: 'home'
})
export default class extends Vue {
  private dataList: any[] = []
  private loading: any
  created() {
    // this.$elementMessage('234234')
    this.loading = this.$loading({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading'
    })
    this.requestIndexData()
  }

  /**
   * @message: 跳转权限页面
   * @parameter:
   * @Return:
   * @Date: 2019-09-23 14:23:41
   */
  private onChangeTo(mItem: any) {
    console.log(mItem.type)
    if (mItem.is_allow) {
      this.handleRouterConf(mItem.type)
    } else {
      this.$router.push({ path: '/mainboard/401' })
    }
  }

  /**
   * @message: 处理路由配置
   * @parameter:
   * @Return:
   * @Date: 2019-09-24 17:52:57
   */
  private handleRouterConf(type: string): void {
    const conf: any = {
      bi: '/overallOptration/operationCockpit', //业务驾驶舱
      radar: '/school_options/school_radar', // 机构雷达
      school_rank: '/school_options/dts_rank', // 机构排名
      live_business: '/businessDataSection/iframePage', // title: "双师业务数据"
      ai_business: '/businessDataSection/iframePage1', // title: "AI业务数据"
      content_business: '/businessDataSection/iframePage6', // title: "内容业务数据"
      train_business: '/businessDataSection/iframePage4', // title: "师训业务数据"
      finance_data: '/financeData/financeData_detal', // title: "财务数据"
      teaching_product: '/teachingData/teaching_prod_data', // title: "产品数据"
      teaching_business: '/teachingData/teaching_option_data', // title: "业务数据"
      lwj_business: '/foreign_teacher/foreign_teacher-data' // title: "乐外教数据"
    }
    if (!conf[type]) return
    this.$router.push({ path: conf[type] })
  }

  private createAuthMap(arr:any[]){
    let authMap:any = {}
    for( let item of arr){
      for (let i of item.items){
        console.log(i)
        authMap[i.type] = i.is_allow
      }

    }
    return authMap
  }

  /**
   * @message: 获取信息
   * @parameter:
   * @Return:
   * @Date: 2019-09-17 10:30:31
   */
  private async requestIndexData() {
    const resData = await getIndexData<IResponseData>()
    const { ok, data, message } = resData
    if (!ok) {
      this.loading.close()
      return this.$message({
        type: 'error',
        message: message || '网络错误获取失败'
      })
    }
    this.loading.close()
    this.dataList = data
    console.log('data: ', data);
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  min-height: 100%;
  background-color: #ffffff;
  .main_board_content {
    .section {
      margin-top: 30px;
      .mcard_box{
         cursor: pointer;
      }
      .card_box {
        margin-top: 10px;
        display: flex;
        .el-card {
          width: 200px;
          height: 100px;
          margin: 10px;
          border-radius: 12px;
          .svg-icon {
            position: relative;
            top: 2px;
            border-radius: 50%;
            margin-right: 5px;
          }
          .content {
            margin-left: 25px;
            margin-top: 10px;
            font-size: 12px;
            color: #999;
          }
        }
      }
    }
  }
}
</style>
