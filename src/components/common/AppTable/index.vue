<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-22 15:26:13
 * @LastEditTime: 2019-08-22 17:46:34
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="app-table-con">
    <div class="top-head app-row v-center">
      <slot name="top" />
    </div>

    <div class="table-con">
      <el-table
        v-loading="loading"
        :data="tableData"
        :show-header="showHeader">
        <el-table-column
          v-if="showIndex"
          align="center"
          label="序号"
          type="index"
          show-overflow-tooltip />
        <el-table-column
          v-for="(column, index) in columns"
          :key="index"
          :label="column.label"
          :prop="column.prop"
          :width="column.width"
          :formatter="column.formatter"
          :align="column.align ? column.align : 'center'"
          show-overflow-tooltip>
          <template
            slot-scope="{row, $index}">
            <!-- 格式化行 -->

            <!-- 链接行 -->
            <router-link
              v-if="column.routLink"
              class="link-color"
              :to="column.routLink(row, column, row[column.prop], $index)">
              {{ column.formatter ? column.formatter(row, column, row[column.prop], $index) : (row[column.prop] ? row[column.prop] : column.defaultProp ? column.defaultProp : row[column.prop]) }}
            </router-link>
            <a
              v-else-if="column.link"
              class="link-color"
              target="__blank"
              :href="column.link(row, column, row[column.prop], $index)">
              {{ row[column.prop] ? row[column.prop] : column.defaultProp ? column.defaultProp : row[column.prop] }}
            </a>
            <!-- 自定义行 -->
            <slot
              v-else-if="column.custom"
              name="custom"
              :column="column"
              :row="row"
              :type="column.type"
              :value="column.formatter ? column.formatter(row, column, row[column.prop], $index) : row[column.prop]" />
            <span v-else-if="column.formatter">
              {{ column.formatter(row, column, row[column.prop], $index) }}
            </span>

            <span v-else>{{ row[column.prop] ? row[column.prop] : column.defaultProp ? column.defaultProp : row[column.prop] }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="hasOperate"
          align="center"
          fixed="right"
          label="操作"
          :width="optionWidth">
          <template slot-scope="scope">
            <slot
              name="operate"
              :operate="scope.row" />
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div
      v-if="pagenation && pagenation.total > 0"
      class="pagenation-con"
      style="margin-top: 10px;text-align: right;">
      <el-pagination
        :current-page.sync="pagenation.page"
        :page-size="pagenation.per_page"
        layout="total, prev, pager, next"
        :total="pagenation.total"
        @current-change="handleCurrentChange" />
    </div>

    <div class="foot-con">
      <slot name="foot" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
interface pageObj {
  page: number
  per_page: number
  total: number
}

interface columObj {
  label: string
  prop?: string
  defaultProp?: string
  width?: number
  formatter?: any
  align?: string
  routLink?: any
  link?: any
  type?: string
}

@Component({
  name: 'AppTable'
})
export default class extends Vue {
  @Prop({ default: true }) private showHeader!: boolean // 是否展示表头
  @Prop({ default: false }) private showIndex!: boolean // 是否展示索引
  @Prop({ default: false }) private loading!: boolean // 是否显示loading
  @Prop({ default: false }) private hasOperate!: boolean // 是否有操作列
  @Prop({ default: () => [] }) private tableData!: any[] // 表格数据
  @Prop({ default: () => [] }) private columns!: columObj[] // 列定义
  @Prop({ default: () => {} }) private pagenation!: pageObj // 是否要展示分页
  @Prop({ default: 60 }) private optionWidth!: number // 定义操作列的宽度

  // 分页回调
  private handleCurrentChange(val:any) {
    console.log(val, 'page change')
    this.$emit('pageChange', val)
  }
}
</script>

<style lang="scss" scoped>
.app-table-con {
  .link-color {
    color: $linkColor;
  }
}
</style>
