<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-30 11:39:44
 * @LastEditTime: 2019-11-17 16:39:59
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
        </div>
        <div class="search_input_box">
          <el-input v-model="redarParams.keyword" placeholder="请输入内容" prefix-icon="el-icon-search" clearable @change="onInputChange" @keyup.enter.native="onSearch" />
          <el-button type="defalut" @click="onSearch">查询</el-button>
          <el-button type="primary" @click="dialogVisible = true">添加设备</el-button>
        </div>
      </div>

      <!-- 表单 -->
      <el-table ref="table" v-loading="loading" :height="tableHeight" :data="tableData" style="width: 100%">
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
            <el-button class="btn_m" type="primary" size="mini" @click="onOpenEdit">编辑</el-button>
            <el-button class="btn_m" type="danger" size="mini" @click="onOpen">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分液器 -->
      <div class="pagination_block">
        <el-pagination :current-page.sync="currentPage" layout="prev, pager, next, jumper" :page-size="20" :total="totalPage" @current-change="onCurrentChange" />
      </div>
    </template>

    <!-- 添加设备 -->
    <el-dialog title="添加设备" :visible.sync="dialogVisible" width="60%">
      <el-form :model="form">
        <el-form-item label="设备名称" :label-width="formLabelWidth">
          <el-input v-model="form.device_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="imei" :label-width="formLabelWidth">
          <el-input v-model="form.imei" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onAddDeviceSubmit(form)">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑设备 -->
    <el-dialog title="编辑设备" :visible.sync="dialogVisible2" width="60%">
      <el-form :model="form">
        <el-form-item label="设备名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="自动定位时间" :label-width="formLabelWidth">
          <el-input v-model="form.automatic_positioning_time" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="休眠时段" :label-width="formLabelWidth">
          <el-input v-model="form.gps_sleep_time" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="深度休眠" :label-width="formLabelWidth">
          <el-input v-model="form.deep_sleep" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible2 = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { TestModule } from '@/store/modules/test'
import { AppModule } from '@/store/modules/app'
import { addDevice, getDeviceList } from '@/services/dataMap/index'
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
  private dialogVisible: boolean = false
  private dialogVisible2: boolean = false
  private tableData: any[] = dataList
  private currentPage: number = 0
  private totalPage: number = 0
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
  private formLabelWidth = '120px'
  private form = {
    name: '',
    imei: ''
  }

  created() {
    const data = {}
    this.tableHeight = document.body.clientHeight - 230 + 'px'
    this.requetDeviceList(this.redarParams)
  }

  /**
   * @message: 获取机构雷达列表
   * @parameter:
   * @Return:
   * @Date: 2019-09-20 11:16:47
   */
  private async requetCreateDevice(mdata: any): Promise<any> {
    const resData = await addDevice<IResponseData>(mdata)
    const {
      data,
      ok,
      message
    } = resData
    console.log('resData: ', resData)
    this.dialogVisible = false
    if (!ok) {
      return this.$message({
        type: 'error',
        message: message || '网络错误'
      })
    }
  }
  /**
   * @message: 获取设备列表
   * @parameter:
   * @Return:
   * @Date: 2019-09-20 11:16:47
   */
  private async requetDeviceList(mdata: any): Promise<any> {
    const resData = await getDeviceList<IResponseData>(mdata)
    const {
      data,
      ok,
      message
    } = resData
    console.log('resData: ', resData)
    if (!ok) {
      return this.$message({
        type: 'error',
        message: message || '网络错误'
      })
    }
  }

  /**
   * @message:
   * @parameter:
   * @Return:
   * @Date: 2019-10-09 22:58:06
   */
  private onOpen() {
    this.$confirm('此操作将永久删除该设备, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
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
  }

  // 监听查询按钮
  private onSearch(): void {}
  private onAddDeviceSubmit(form: any) {
    this.requetCreateDevice(form)
  }
  
}
</script>

<style lang="scss" scoped>
.school_radar_container {
  margin-left: 10px;
  margin-top: 10px;
  background-color: #ffffff;
  padding: 20px;
  .btn_m {
    margin: 5px;
  }
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
