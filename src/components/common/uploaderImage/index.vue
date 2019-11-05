<template>
  <div class="addImg">
    <el-progress
      v-if="isUploading"
      type="circle"
      :percentage="uploadProgress" />
    <div
      v-else
      class="images__item__wrap img"
      @mouseover="showMask()"
      @mouseout="hideMask()">
      <div
        v-show="maskVisible"
        class="images__item__edit">
        <i
          class="el-icon-zoom-in"
          @click="enlarge()" />
        <i
          class="el-icon-delete"
          @click="doDelete()" />
      </div>
      <img
        v-if="!addVisible"
        class="images__item"
        :src="pictureUrl">
      <div
        v-if="addVisible"
        class="images__item__wrap upload">
        <i class="el-icon-plus upload__wrap" />
        <input
          ref="inputRef"
          type="file"
          class="upload__input"
          accept=".png,.jpg"
          @change="addImg">
      </div>
    </div>
    <el-dialog
      title="图片详情"
      :visible.sync="dialogTableVisible">
      <large-img :img-url="pictureUrl" />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { getFilePrefix, getFileSuffix } from '@/utils/getFileInfo'
import { queryOss } from '../../../services/common'
import largeImg from '../largeImg/index.vue'

interface UploadParams {
  name: string
  content: string
  size: number
  index: number
  fileName: string
  multiUpload?: boolean
}

@Component({
  name: 'UploadImage',
  components: {
    largeImg
  }
})
export default class extends Vue {
  @Prop({ default: 2 }) private maxSize!: number
  @Prop({ default: 0 }) private index!: number
  @Prop({ default: '' }) private imgUrl!: string
  @Prop({ default: '', required: true }) private store!: string
  @Prop({ default: false }) private multiUpload!: boolean // 是否是列表渲染

  private loading: boolean = false
  private isUploading:boolean = false
  private uploadProgress: number = 0

  private uploadParams: UploadParams = {
    name: '',
    content: '', // 上传之后的url
    size: 0,
    fileName: '',
    index: 0
  }
  private pictureUrl: string = ''
  private maskVisible: boolean = false
  private dialogTableVisible: boolean = false
  private enlargeImgUrl: string = ''
  private addVisible: boolean = true

  @Watch('imgUrl', { immediate: true })
  private handler() {
    this.pictureUrl = this.imgUrl
    this.addVisible = !this.pictureUrl
  }
  private beforeImgUpload(file:any) {
    const isIMG = file.type === 'image/jpeg' || file.type === 'image/png'
    const isLt2M = file.size / 1024 / 1024 < this.maxSize
    if (!isIMG) {
      this.$message.error('上传图片必须是 JPG/PNG 格式!')
    }
    if (!isLt2M) {
      this.$message.error('上传图片大小不能超过 2MB!')
    }
    return isIMG && isLt2M
  }
  private addImg(e: any) {
    console.log(e)
    const file = e.target.files[0]
    if (this.beforeImgUpload(file)) {
      if (file === undefined) {
        return false
      }
      this.startLoading()
      // 文件名后缀
      const prefix = getFilePrefix(file.name)
      const suffix = getFileSuffix(file.name)
      this.uploadParams.size = file.size
      this.uploadParams.fileName = prefix + '.' + suffix
      let OSS = require('ali-oss')
      let params = {
        type: this.store
      }
      queryOss(params).then(res => {
        const access = res.data
        let client = new OSS({
          accessKeyId: access.access_key_id,
          accessKeySecret: access.access_key_secret,
          stsToken: access.security_token,
          endpoint: access.endpoint,
          bucket: access.bucket
        })
        this.uploadParams.name = new Date().getTime() + '.' + suffix
        let storeAs = access.prefix + this.uploadParams.name
        let self = this
        function asyncProgress(p:any, cpt:any, res:any) {
          self.emitProgress(p * 100)
        }
        let options = {
          headers: {
            'Content-Disposition': 'attachment'
          },
          progress: asyncProgress
        }
        client.multipartUpload(storeAs, file, options).then((result:any) => {
          if (result.res.status === 200) {
            this.uploadProgress = 100
            this.addVisible = false
            this.pictureUrl = this.uploadParams.content
            this.uploadParams.content = 'https://' + access.bucket + '.' + access.endpoint + '/' + result.name
            this.emitComplete(this.uploadParams)
          } else {
            console.log('failed')
            this.failUploading()
          }
        })
      }).catch((err) => {
        console.log(err)
        this.failUploading()
      })
    } else {
      // this.$refs.input.value = '' vue 写法，下面是typescript写法
      (this.$refs.inputRef as HTMLInputElement).value = ''
    }
  }
  // 开始loading
  private startLoading() {
    this.$emit('loading', this.loading)
    this.isUploading = true
  }
  private failUploading() {
    this.loading = false
    this.isUploading = false
    this.uploadProgress = 0
    this.$message({
      message: '上传失败!',
      type: 'warning'
    })
    this.$emit('uploadError', this.loading)
  }
  // 上传进度
  private emitProgress(progress: number) {
    this.uploadProgress = progress
    this.$emit('progress', Math.ceil(progress))
  }
  // 上传完成
  private emitComplete(params: UploadParams) {
    params.index = this.index
    params.multiUpload = this.multiUpload
    this.isUploading = false

    this.$message({
      message: '上传成功!',
      type: 'success'
    })
    console.log(params)
    this.$emit('completed', params)
  }
  private showMask() {
    this.maskVisible = true
  }
  private hideMask() {
    this.maskVisible = false
  }
  private enlarge() {
    this.enlargeImgUrl = this.pictureUrl
    this.dialogTableVisible = true
  }
  private doDelete() {
    this.uploadParams.content = ''
    this.addVisible = true
    let params = {
      index: this.index,
      multiUplaod: this.multiUpload
      // labelName: this.labelName
    }
    this.$emit('deleteImg', params)
  }
}
</script>

<style lang="scss" scoped>
.addImg {
    display: inline-block;
    height: 124px;
  }
  .images__item__wrap {
    border: 1px dashed #c0ccda;
    background-color: #fbfdff;
    border-radius: 5px;
    width: 122px;
    height: 122px;
    position: relative;
    float: left;
    margin-right: 10px;
    overflow: hidden;
  }
  .images__item__wrap.img:hover {
    background-color: #000;
  }
  .images__item__wrap.upload:hover {
    border: 1px dashed rgba(32, 117, 255, 0.815);
  }
  .images__item {
    width: 120px;
    height: 120px;
  }
  .images__item__edit {
    text-align: center;
    position: absolute;
    width: 120px;
    height: 120px;
    font-size: 24px;
    color: rgba(32, 117, 255, 0.815);
    background-color: rgba(0, 0, 0, 0.7);
    padding-top: 40px;
  }
  .images__item__edit i {
    cursor: pointer;
    margin: 0 10px;
  }
  .upload__wrap {
    font-size: 24px;
    margin: 50% 0 0 50%;
    position: absolute;
    top: -12px;
    left: -12px;
  }
  .upload__input {
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 120px;
    height: 120px;
    cursor: pointer;
  }
</style>

<style>
  .addImg .el-icon-plus {
    color: #666;
  }
</style>
