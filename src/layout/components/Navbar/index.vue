<template>
  <div class="navbar">
    <el-dialog
      title="请钉钉联系"
      :append-to-body="true"
      :visible.sync="centerDialogVisible"
      width="30%"
      center
    >
      <div>
        <!-- <div>请钉钉联系:</div> -->
        <div class="s_header_box">
          <img class="avatar" src="https://haoweilai-tob-pro-video.oss-cn-beijing.aliyuncs.com/img/Snipaste_2019-09-27_18-14-32.png" alt="">
                    <div style="font-size:16px">曹逾</div>

        </div>
        <div class="s_qr_code">
          <img
            src="https://haoweilai-tob-pro-video.oss-cn-beijing.aliyuncs.com/img/Snipaste_2019-09-27_18-14-10.png"
            alt
          />
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    <div class="right-menu">
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <span class="el-dropdown-link">
          {{ userName }}
          <i class="el-icon-caret-bottom" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <span style="display:block;" @click="logout">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-button type="primary" @click="centerDialogVisible = true" class="help_me">
      <i class="el-icon-s-custom" /> 需要帮助?
    </el-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'
import { getUserName, removeToken, removeUserName } from '@/utils/cookies'
import Breadcrumb from '@/components/common/Breadcrumb/index.vue'
import Hamburger from '@/components/common/Hamburger/index.vue'

@Component({
  name: 'Navbar',
  components: {
    Breadcrumb,
    Hamburger
  }
})
export default class extends Vue {
  private centerDialogVisible = false
  get sidebar() {
    return AppModule.sidebar
  }

  get device() {
    return AppModule.device.toString()
  }

  get userName() {
    return getUserName()
  }

  private toggleSideBar() {
    AppModule.ToggleSideBar(false)
  }

  private async logout() {
    this.$confirm('是否退出登录?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        removeToken()
        removeUserName()
        this.$router.push({ path: '/login' })
      })
      .catch(() => {})
  }
}
</script>

<style lang="scss" scoped>
.s_qr_code {
  display: flex;
  justify-content: center;
  align-items: ceneter;
}
.s_header_box {
  display: flex;
  justify-content: center;
  align-items: center;;
  .avatar{
    width:50px;
    height:38px;
    margin-right: 1px;
    font-size: 16px;
  }
}
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    padding: 0 15px;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .help_me {
    float: right;
    margin-right: 60px;
    margin-top: 7px;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    padding-right: 20px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .el-dropdown-link {
      font-size: 16px;
    }

    .avatar-container {
      margin-right: 30px;

      .user-avatar {
        cursor: pointer;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: #ececec;
      }

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
