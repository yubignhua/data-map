<template>
  <div class="operationCockpit">
    <h2>业务驾驶舱</h2>
    <div class="content">
      <div class="data_item_box">
        <div class="data_left">
          <div class="item_title">未来魔法校</div>
          <div class="item_des">未来魔法校数据总览，包括双师业务、AI业务、内容业务数据概况</div>
        </div>
        <div class="data_right">
          <router-link :to="{path: 'iframe_overview'}">
            <el-button type="primary">进入</el-button>
          </router-link>
        </div>
      </div>
      <div class="data_item_box">
        <div class="data_left">
          <div class="item_title">双师业务</div>
          <div class="item_des">双师业务详情数据看板</div>
        </div>
        <div class="data_right">
          <router-link :to="{path: 'iframe_live'}">
            <el-button type="primary">进入</el-button>
          </router-link>
        </div>
      </div>
      <div class="data_item_box">
        <div class="data_left">
          <div class="item_title">AI业务</div>
          <div class="item_des">AI业务详情数据看板</div>
        </div>
        <div class="data_right">
          <router-link :to="{path: 'iframe_ai'}">
            <el-button type="primary">进入</el-button>
          </router-link>
        </div>
      </div>
      <div class="data_item_box">
        <div class="data_left">
          <div class="item_title">内容业务</div>
          <div class="item_des">内容业务详情数据看板</div>
        </div>
        <div class="data_right">
          <router-link :to="{path: 'iframe_content'}">
            <el-button type="primary">进入</el-button>
          </router-link>
        </div>
      </div>
      <div class="data_item_box">
        <div class="data_left">
          <div class="item_title">市场业务</div>
          <div class="item_des">市场业务详情数据看板</div>
        </div>
        <div class="data_right">
            <a href="http://101.201.76.246:8010/datav" target="_blank">
              <el-button type="primary">进入</el-button>
            </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
@Component({
  name: 'dtsRank'
})
export default class extends Vue {}
</script>

<style lang="scss" scoped>
@import url('//unpkg.com/element-ui@2.12.0/lib/theme-chalk/index.css');
.operationCockpit {
  margin-left: 40px;
  margin-top: 40px;
  width: 90%;
  background-color: #ffffff;
  padding: 20px;
  .content {
    margin-top: 50px;
    padding-bottom: 100px;
    .data_item_box {
      border-bottom: solid 1px #e9e9e9;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 80px;
      padding: 10px;
      .data_left {
        .item_title {
          font-size: 18px;
          font-weight: bold;
        }
        .item_des {
          color: #999;
          font-size: 12px;
          padding-top: 10px;
        }
      }
    }
  }
}
</style>
