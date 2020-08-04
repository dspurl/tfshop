<template>
  <div v-loading="listLoading" class="dashboard-editor-container">
    <el-row>
      <el-col :span="24" style="padding-bottom: 20px;">
        <el-card shadow="hover">
          <div class="title">
            <h3>整体分析</h3>
            <div class="right" @click="handleDownload('pay')">下载</div>
            <div>
              <el-select v-model="payDate" placeholder="请选择" @change="setDate('pay')">
                <el-option
                  v-for="item in pay"
                  :key="item.value"
                  :label="item.lable"
                  :value="item.value"/>
              </el-select>
              <span class="date">{{ payShowDate }}</span>
            </div>
          </div>
          <stacked-area v-loading="analyze_loading" :char-data="payData" :id="'c1'"/>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import StackedArea from '@/components/G2/G2Plot/StackedArea.vue'
import { pay } from '@/api/statistics'
import { getBeforeDate } from '@/utils/index'
export default {
  name: 'StatisticsVisit',
  components: {
    StackedArea
  },
  data() {
    return {
      listLoading: false,
      options: [],
      analyze_loading: false,
      payData: [],
      payExcelData: [],
      payDate: 0,
      payShowDate: '',
      pay: [{
        value: 0,
        lable: '今日'
      }, {
        value: 7,
        lable: '最近7天'
      }, {
        value: 30,
        lable: '最近30天'
      }]
    }
  },
  created() {
    this.getPay()
  },
  methods: {
    getPay() {
      this.analyze_loading = true
      this.payShowDate = getBeforeDate(this.payDate) + '至' + getBeforeDate(1)
      pay({ date: this.payDate }).then(response => {
        this.payData = response.data
        const data = {}
        this.payExcelData = []
        this.payData.map(v => {
          if (!data[v['date']]) {
            data[v['date']] = {}
          }
          data[v['date']] = [0, 0, 0, 0, 0, v.date]
          if (v.country === '下单笔数') {
            data[v['date']][0] = v.value
          } else if (v.country === '付款笔数') {
            data[v['date']][1] = v.value
          } else if (v.country === '付款金额') {
            data[v['date']][2] = v.value
          } else if (v.country === '退款笔数') {
            data[v['date']][3] = v.value
          } else if (v.country === '退款金额') {
            data[v['date']][4] = v.value
          }
        })
        for (var k in data) {
          this.payExcelData.push([data[k][0], data[k][1], data[k][2], data[k][3], data[k][4], data[k][5]])
        }
        this.analyze_loading = false
      })
    },
    setDate(item) {
      if (item === 'pay') {
        this.payShowDate = getBeforeDate(this.payDate) + '至' + getBeforeDate(1)
        this.getPay()
      }
    },
    handleDownload(item) {
      this.listLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        let tHeader = []
        let data = []
        let filename = ''
        if (item === 'pay') {
          tHeader = ['下单笔数', '付款笔数', '付款金额', '退款笔数', '退款金额', '时间']
          filename = '交易分析'
          data = this.payExcelData
        }
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: filename
        })
        this.listLoading = false
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }
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
        .icon-shopping {
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
      .icon-shopping {
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
  .title{
    padding-bottom: 20px;
    position: relative;
  }
  .title .right{
    position: absolute;
    right:20px;
    top:0;
    font-size: 14px;
    color: #3a8ee6;
    cursor:pointer;
  }
  .title .date{
    padding-left: 5px;
    color: #999999;
  }
</style>
