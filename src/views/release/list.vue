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
      <el-table-column width="150px" align="center" :label="$t('release.progress')">
        <template slot-scope="scope">
          <el-progress type="circle" :percentage="handleProgress(scope.row)"></el-progress>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.actions')" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini">{{$t('package.edit')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { releaselist } from '@/api/release'
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
        timestamp: undefined,
        appName: '',
        published: false,
        jsPath: undefined,
        showUpdateAlert: false,
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
      downloadLoading: false
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
    handleCreate() {
      this.$router.push('/package/package-upload')
    },
    handleProgress(release) {
      return 25
    }
  }
}
</script>
