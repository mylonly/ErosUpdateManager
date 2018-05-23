<!--
package upload
@authors root (root@mylonly.com)
@date    2018-04-27 15:39:25
@version 1.0.0
-->
<template>
  <div class="app-container calendar-list-container">
    <el-upload class="upload-demo" drag action="http://weex.1234tv.com/package/upload" with-credentials="true"
      :on-progress= "on_progress" :on-success= "on_success" :on-error= "on_error"
      :before-upload= "before_upload"
      v-if="!upload_success"
      v-loading="loading"
      element-loading-text="文件处理中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text" v-if="!showProgress">将文件拖到此处，或<em>点击上传</em></div>
      <el-progress :text-inside="true" :stroke-width="18" :percentage="percentage" status="success" v-if="showProgress"></el-progress>
      <div class="el-upload__tip" slot="tip">只能上传zip文件，且不超过10M</div>
    </el-upload>


    <div class="edit-package" v-if="upload_success">
       <el-form ref="form" :model="package" label-width="150px">
        <el-form-item :label="$t('package.jsVersion')" prop="jsVersion">
          <el-input v-model="package.jsVersion" placeholder="请输入更新包版本号"></el-input>
        </el-form-item>
        <el-form-item :label="$t('package.jsMD5')" prop="jsMD5">
          <el-input v-model="package.jsMD5" placeholder="请输入更新包版本号" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item :label="$t('package.appName')" prop="appName">
          <el-input v-model="package.appName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item :label="$t('package.ios')" prop="ios">
          <el-input v-model="package.ios" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item :label="$t('package.android')" prop="android">
          <el-input v-model="package.android" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item :label="$t('package.date')" prop="date">
          <el-input :value="computedDate(package.timestamp)" :disabled="true">{{}}</el-input>
        </el-form-item>
        <el-form-item :label="$t('package.jsPath')" prop="jsPath">
          <el-input v-model="package.jsPath" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item :label="$t('package.published')" prop="published">
          <el-switch v-model="package.published" active-color="#13ce66" inactive-color="#f2f2f2"></el-switch>
        </el-form-item>
        <el-form-item :label="$t('package.showUpdateAlert')">
          <el-switch v-model="package.showUpdateAlert" active-color="#13ce66" inactive-color="#f2f2f2"></el-switch>
        </el-form-item>
        <el-form-item :label="$t('package.changelog')">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入更新包改动日志" v-model="package.changelog">
          </el-input>
        </el-form-item>
      </el-form>

      <el-row type="flex" justify="end">
          <el-button @click="upload_success = false">{{$t('table.cancel')}}</el-button>
          <el-button type="primary" @click="createPackage" v-loading.fullscreen.lock="creating">{{$t('table.confirm')}}</el-button>
      </el-row>
    </div>

   


  </div>
</template>

<script>
  import { parseTime } from '@/utils'
  import { createPackage } from '@/api/package'

  export default {
    data() {
      return {
        showProgress: false,
        percentage: 0,
        package: {
          appName: undefined,
          jsVersion: undefined,
          jsMD5: undefined,
          android: undefined,
          ios: undefined,
          timestamp: undefined,
          isForceUpdate: false,
          published: false,
          changelog: undefined,
          jsPath: undefined
        },
        upload_success: false,
        loading: false,
        creating: false
      }
    },
    methods: {
      computedDate(timestamp) {
        return parseTime(timestamp, '{y}-{m}-{d} {h}:{i}')
      },
      on_progress(event, file, fileList) {
        this.percentage = event.percent
        if (this.percentage >= 100) {
          this.showProgress = false
          // this.loading = true
        }
      },
      on_success(response, file, fileList) {
        console.log('response:', response)
        if (response.resCode === 0) {
          this.loading = false
          this.upload_success = true
          this.package = Object.assign({}, response.data)
        } else {
          this.$notify({
            title: '上传失败',
            message: 'response.detail',
            type: 'error',
            duration: 2000
          })
          this.showProgress = false
          this.loading = false
        }
      },
      before_upload(file) {
        const isZip = file.type === 'application/zip'
        if (!isZip) {
          this.$message.error('只能上传ZIP格式的压缩包')
          return isZip
        }
        this.showProgress = true
        return isZip
      },
      on_error(err, file, fileList) {
        console.log('error:', err)
      },
      createPackage() {
        this.creating = true
        setTimeout(() => {
          createPackage(this.package).then(response => {
            this.creating = false
            this.upload_success = false
            this.$router.push('/package/package-list')
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }, 2000)
      }
    }
  }
</script>

<style lang="css" scoped>
  .footer{
    width: 200px;
    height: 100px;
    margin-right: 20px;
  }
</style>
