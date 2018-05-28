<template>
  <el-row class="panel-group" :gutter="40">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class='card-panel' @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">今日活跃</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="todayActive" :duration="2600"></count-to>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('messages')">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">iOS设备数</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="iOSTotal" :duration="3000"></count-to>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">Android设备数</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="AndroidTotal" :duration="3200"></count-to>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-shoppingCard">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">总设备数</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="Total" :duration="3600"></count-to>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import { recordList } from '@/api/release'
import { parseTime } from '@/utils'

export default {
  props: {
    appName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      todayActive: 0,
      iOSTotal: 0,
      AndroidTotal: 0,
      Total: 0
    }
  },
  components: {
    CountTo
  },
  watch: {
    appName(value) {
      this.handleQuery(value)
    }
  },
  created() {
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    },
    handleQuery(appName) {
      const totalQuery = {
        'appName': appName
      }
      recordList(totalQuery).then(resData => {
        this.Total = resData.data.count
      })
      const iOSQuery = {
        'appName': appName,
        'appPlatform': 'iOS'
      }
      recordList(iOSQuery).then(resData => {
        this.iOSTotal = resData.data.count
      })
      const AndroidQuery = {
        'appName': appName,
        'appPlatform': 'Android'
      }
      recordList(AndroidQuery).then(resData => {
        this.AndroidTotal = resData.data.count
      })
      var timestamp = new Date()

      const ActiveQuery = {
        'appName': appName,
        'updateTime__datetime__gte': parseTime(timestamp, '{y}-{m}-{d}')
      }
      recordList(ActiveQuery).then(resData => {
        this.todayActive = resData.data.count
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  .card-panel-col{
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-people {
         background: #40c9c6;
      }
      .icon-message {
        background: #36a3f7;
      }
      .icon-money {
        background: #f4516c;
      }
      .icon-shoppingCard {
        background: #34bfa3
      }
    }
    .icon-people {
      color: #40c9c6;
    }
    .icon-message {
      color: #36a3f7;
    }
    .icon-money {
      color: #f4516c;
    }
    .icon-shoppingCard {
      color: #34bfa3
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>
