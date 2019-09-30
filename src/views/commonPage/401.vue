<template>
  <div class="errPage-container">
    <!--<el-button @click="back" icon='arrow-left' class="pan-back-btn">返回</el-button>-->
    <el-row>
      <el-col :span="12">
        <h1 class="text-jumbo text-ginormous">
          Oops! 401
        </h1>
        <h2>你没有权限去该页面</h2>
        <h3 style="margin-top:5px">
          如有不满请联系曹逾老师
        </h3>
        <ul class="list-unstyled">
          <li class="link-type">
            <router-link to="/mainboard/mainboard">
              返回
            </router-link>
          </li>
        </ul>
      </el-col>
      <el-col :span="12">
        <img
          :src="errGif"
          width="313"
          height="428"
          alt="Girl has dropped her ice cream."
        >
      </el-col>
    </el-row>
    <el-dialog
      title="随便看"
      :visible.sync="dialogVisible"
    />
  </div>
</template>

<script>
import errGif from '@/assets/images/401.gif'

export default {
  name: 'Page401',
  data() {
    return {
      errGif: errGif + '?' + +new Date(),
      ewizardClap: '//wpimg.wallstcn.com/007ef517-bafd-4066-aae4-6883632d9646',
      dialogVisible: false
    }
  },
  methods: {
    back() {
      if (this.$route.query.noGoBack) {
        this.$router.push({ path: '/crm/v_ihmp/' })
      } else {
        this.$router.go(-1)
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .errPage-container {
    width: 800px;
    padding: 30px;
    // min-height: 100%;
    background-color: #ffffff;
    margin: 100px auto;
    .pan-back-btn {
      background: #008489;
      color: #fff;
    }
    .pan-gif {
      margin: 0 auto;
      display: block;
    }
    .pan-img {
      display: block;
      margin: 0 auto;
    }
    .text-jumbo {
      font-size: 60px;
      font-weight: 700;
      color: #484848;
      margin-bottom: 10px;
    }
    .list-unstyled {
      font-size: 14px;
      padding-left:0;
      li {
        padding-bottom: 5px;
      }
      a {
        color: #008489;
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
</style>
