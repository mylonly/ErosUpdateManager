<!--
发布记录
@authors Root (root@mylonly.com)
@date    2018-05-15 10:12:44
@version 1.0.0
-->
<!--
package list
@authors root (root@mylonly.com)
@date    2018-04-27 15:39:05
@version 1.0.0
-->
<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('release.appName')" v-model="listQuery.appName">
      </el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('release.jsVersion')" v-model="listQuery.jsVersion">
      </el-input>
      <el-select @change='handleFilter' style="width: 140px" class="filter-item" v-model="listQuery.ordering">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%">
      <el-table-column align="center" :label="$t('release.id')" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('release.appName')" width="200">
        <template slot-scope="scope">
          <span>{{scope.row.appName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('release.jsVersion')" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.jsVersion}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('release.iOS')" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.iOS}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('release.android')" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.android}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('release.releaseType')" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.releaseType ? '指定设备' : '灰度值'}}</span>
        </template>
      </el-table-column> 
      <el-table-column width="150px" align="center" :label="$t('release.date')">
        <template slot-scope="scope">
          <span>{{scope.row.createtime}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" :label="$t('release.showUpdateAlert')">
        <template slot-scope="scope">
          <span>{{scope.row.showUpdateAlert ? '是' : '否'}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" :label="$t('release.isForceUpdate')">
        <template slot-scope="scope">
          <span>{{scope.row.isForceUpdate ? '是' : '否'}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" :label="$t('release.changelog')">
        <template slot-scope="scope">
          <span>{{scope.row.changelog}}</span>
        </template>
      </el-table-column>
      <el-table-column  fixed="right" align="center" :label="$t('table.actions')" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini"  @click="handleUpdate(scope.row)">{{$t('package.edit')}}</el-button>
          <el-button type="danger" size="mini"  @click="handleDelete(scope.row)">{{$t('release.delete')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="100px" style='width: 400px; margin-left:50px;'>
        <el-form-item :label="$t('release.appName')" prop="appName">
          <el-input v-model="temp.appName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item :label="$t('release.jsVersion')" prop="jsVersion">
          <el-input v-model="temp.jsVersion" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item :label="$t('release.releaseType')">
          <el-radio-group v-model="temp.filterType" type="number">
            <el-radio :label="0" border >灰度值</el-radio>
            <el-radio :label="1" border >指定设备</el-radio>
          </el-radio-group>        
        </el-form-item>
        <el-form-item :label="$t('release.grayscale')" prop="grayscale" v-if="temp.filterType == 0">
          <el-slider v-model="temp.grayScale" show-input :max="1" :step="0.01"></el-slider>
        </el-form-item>
        <el-form-item :label="$t('release.deviceIDs')" prop="deviceIDs" v-if="temp.filterType == 1">
          <el-tag
            v-for="tag in temp.deviceIDs"
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
        <el-form-item :label="$t('release.showUpdateAlert')">
          <el-switch v-model="temp.showUpdateAlert" active-color="#13ce66" inactive-color="#f2f2f2"></el-switch>
        </el-form-item>
        <el-form-item :label="$t('release.isForceUpdate')">
          <el-switch v-model="temp.isForceUpdate" active-color="#13ce66" inactive-color="#f2f2f2"></el-switch>
        </el-form-item>
        <el-form-item :label="$t('release.changelog')">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="Please input" v-model="temp.changelog">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { releaselist, updateRelease, deleteRelease } from '@/api/release'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'complexTable',
  directives: {
    waves
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        offset: 0,
        limit: 20,
        appName: undefined,
        published: undefined,
        ordering: '-id'
      },
      importanceOptions: [1, 2, 3],
      sortOptions: [{ label: 'ID Ascending', key: 'id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        jsVersion: undefined,
        jsMD5: undefined,
        android: undefined,
        ios: undefined,
        appName: '',
        filterType: 0,
        deviceIDs: undefined,
        grayScale: undefined,
        showUpdateAlert: false,
        isForceUpdate: false,
        changelog: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新建'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false,
      inputVisible: false,
      inputValue: '',
      creating: false
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return null
    }
  },
  created() {
    this.getList()
  },
  computed: {
  },
  methods: {
    getList() {
      this.listLoading = true
      releaselist(this.listQuery).then(response => {
        this.list = response.data.results
        this.total = response.data.count
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.offset = 0
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.offset = (val - 1) * this.listQuery.limit
      this.getList()
    },
    handleClose(tag) {
      this.temp.deviceIDs.splice(this.temp.deviceIDs.indexOf(tag), 1)
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
        this.temp.deviceIDs.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.deviceIDs = this.temp.deviceIDs.split(',')
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将会导致APP收到上一个版本的更新通知', '确定删除发布?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRelease(row).then(resData => {
          this.$notify({
            title: '成功',
            type: 'success',
            message: '删除成功!'
          })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
        }).catch(() => {
          this.$notify({
            title: '失败',
            type: 'error',
            message: '删除失败!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.deviceIDs = tempData.deviceIDs.join(',')
          console.log('tempData:', tempData)
          updateRelease(tempData).then(response => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '编辑成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleCreate() {
      this.$router.push('/release/add')
    }
  }
}
</script>
