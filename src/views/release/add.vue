<!--
新增灰度发布
@authors Root (root@mylonly.com)
@date    2018-05-14 17:34:42
@version 1.0.0
-->
<template>
  <div class="app-container">
       <el-form ref="form" :model="release" label-width="150px">
        <el-form-item :label="$t('release.appName')" prop="appName">
          <el-select v-model="release.appName" placeholder="请选择APP" @change="appChange">
            <el-option
              v-for="item in applist"
              :key="item.appName"
              :label="item.name"
              :value="item.appName"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('release.jsVersion')" prop="jsVersion">
          <el-select v-model="release.jsVersion" placeholder="请选择更新包" @change="package_change">
            <el-option
              v-for="item in packagelist"
              :key="item"
              :label="item.jsVersion"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('release.releaseType')" prop="filterType">
          <el-radio-group v-model="release.filterType" type="number">
            <el-radio :label="0" border >灰度值</el-radio>
            <el-radio :label="1" border >指定设备</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('release.grayscale')" prop="grayscale" v-if="release.filterType == 0">
          <el-slider v-model="release.grayScale" show-input :max="1" :step="0.01"></el-slider>
        </el-form-item>
        <el-form-item :label="$t('release.deviceIDs')" prop="deviceIDs" v-if="release.filterType == 1">
          <el-tag
            v-for="tag in release.deviceIDs"
            :key="tag"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)">
            {{tag}}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
        </el-form-item>
      </el-form>

      <el-row type="flex" justify="end">
          <el-button @click="upload_success = false">{{$t('table.cancel')}}</el-button>
          <el-button type="primary" @click="createRelease" v-loading.fullscreen.lock="creating">{{$t('table.confirm')}}</el-button>
      </el-row>
    </div>
</template>

<script>
  import { applist } from '@/api/app'
  import { fetchList } from '@/api/package'
  import { addRelease } from '@/api/release'
  export default {
    data() {
      return {
        applist: [],
        packagelist: [],
        release: {
          appName: undefined,
          jsVersion: undefined,
          filterType: 0,
          grayScale: 1,
          iOS: undefined,
          android: undefined,
          deviceIDs: []
        },
        inputVisible: false,
        inputValue: '',
        creating: false
      }
    },
    created() {
      this.getApplist()
    },
    methods: {
      getApplist() {
        applist().then(resData => {
          this.applist = resData.data
        })
      },
      getPackagelist(appName) {
        var query = {
          appName: appName
        }
        fetchList(query).then(resData => {
          this.packagelist = resData.data
        })
      },
      appChange(appName) {
        this.release.jsVersion = undefined
        this.getPackagelist(appName)
      },
      handleClose(tag) {
        this.deviceIDs.splice(this.dynamicTags.indexOf(tag), 1)
      },
      showInput() {
        this.inputVisible = true
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
      },
      handleInputConfirm() {
        const inputValue = this.inputValue
        if (inputValue) {
          this.release.deviceIDs.push(inputValue)
        }
        this.inputVisible = false
        this.inputValue = ''
      },
      package_change(item) {
        console.log('item:', item)
        this.release.jsVersion = item.jsVersion
        this.release.iOS = item.ios
        this.release.android = item.android
      },
      createRelease() {
        this.creating = true
        this.release.deviceIDs = this.release.deviceIDs.join(',')
        addRelease(this.release).then(response => {
          this.creating = false
          this.$router.push('/release/list')
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          })
        }).catch(error => {
          this.creating = false
          console.log('erros', error)
        })
      }
    }
  }
</script>

<style lang="css" scoped>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
