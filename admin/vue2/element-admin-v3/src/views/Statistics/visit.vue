<template>
  <div v-loading="listLoading" class="dashboard-editor-container">
    <el-row>
      <el-col :span="24" style="padding-bottom: 20px;">
        <el-card shadow="hover">
          <div class="title">
            <h3>行为数据</h3>
            <div class="right" @click="handleDownload('behavior')">下载</div>
            <div>
              <el-select v-model="behaviorDate" placeholder="请选择" @change="setDate('behavior')">
                <el-option
                  v-for="item in behavior"
                  :key="item.value"
                  :label="item.lable"
                  :value="item.value"/>
              </el-select>
              <span class="date">{{ behaviorShowDate }}</span>
            </div>
          </div>
          <stacked-area v-loading="analyze_loading" :char-data="behaviorData" :id="'c1'"/>
        </el-card>
      </el-col>
      <el-col :span="24" style="padding-bottom: 20px;">
        <el-card shadow="hover">
          <div class="title">
            <h3>留存趋势</h3>
            <div class="right" @click="handleDownload('keep')">下载</div>
            <div>
              <el-select v-model="keepDate" placeholder="请选择" @change="setDate('keep')">
                <el-option
                  v-for="item in keep"
                  :key="item.value"
                  :label="item.lable"
                  :value="item.value"/>
              </el-select>
              <span class="date">{{ keepShowDate }}</span>
            </div>
          </div>
          <stacked-area v-loading="keep_loading" :char-data="keepData" :id="'c2'"/>
        </el-card>
      </el-col>
      <el-col :span="24" style="padding-bottom: 20px;">
        <el-card shadow="hover">
          <div class="title">
            <h3>来源分析</h3>
            <div class="right" @click="handleDownload('source')">下载</div>
            <div>
              <el-select v-model="sourceDate" placeholder="请选择" @change="setDate('source')">
                <el-option
                  v-for="item in source"
                  :key="item.value"
                  :label="item.lable"
                  :value="item.value"/>
              </el-select>
              <span class="date">{{ sourceShowDate }}</span>
            </div>
          </div>
          <plot-column v-loading="source_loading" :char-data="sourceData" :id="'c3'"/>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import StackedArea from '@/components/G2/G2Plot/StackedArea.vue'
import PlotColumn from '@/components/G2/G2Plot/Column.vue'
import { behavior, keep, source } from '@/api/statistics'
import { getBeforeDate } from '@/utils/index'
export default {
  name: 'StatisticsVisit',
  components: {
    StackedArea,
    PlotColumn
  },
  data() {
    return {
      listLoading: false,
      options: [],
      analyze_loading: false,
      behaviorData: [],
      behaviorExcelData: [],
      behaviorDate: 7,
      behaviorShowDate: '',
      behavior: [{
        value: 7,
        lable: '最近7天'
      }, {
        value: 30,
        lable: '最近30天'
      }],
      keep_loading: false,
      keepData: [],
      keepExcelData: [],
      keepDate: 7,
      keepShowDate: '',
      keep: [{
        value: 7,
        lable: '最近7天'
      }, {
        value: 30,
        lable: '最近30天'
      }],
      source_loading: false,
      sourceData: [],
      sourceExcelData: [],
      sourceDate: 7,
      sourceShowDate: '',
      source: [{
        value: 7,
        lable: '最近7天'
      }, {
        value: 30,
        lable: '最近30天'
      }]
    }
  },
  created() {
    this.getBehavior()
    this.getKeep()
    this.getSource()
  },
  methods: {
    getBehavior() {
      this.analyze_loading = true
      this.behaviorShowDate = getBeforeDate(this.behaviorDate) + '至' + getBeforeDate(1)
      behavior({ date: this.behaviorDate }).then(response => {
        this.behaviorData = response.data
        this.behaviorExcelData = []
        const data = {}
        this.behaviorData.map(v => {
          if (!data[v['date']]) {
            data[v['date']] = {}
          }
          data[v['date']] = [0, 0, 0, v.date]
          if (v.country === '累计访问人数') {
            data[v['date']][0] = v.value
          } else if (v.country === '转发次数') {
            data[v['date']][1] = v.value
          } else if (v.country === '转发人数') {
            data[v['date']][2] = v.value
          }
        })
        for (var k in data) {
          this.behaviorExcelData.push([data[k][0], data[k][1], data[k][2]], data[k][3])
        }
        this.analyze_loading = false
      })
    },
    getKeep() {
      this.keep_loading = true
      this.keepShowDate = getBeforeDate(this.keepDate) + '至' + getBeforeDate(1)
      keep({ date: this.keepDate }).then(response => {
        this.keepData = response.data
        this.keepExcelData = []
        const data = {}
        this.keepData.map(v => {
          if (!data[v['date']]) {
            data[v['date']] = {}
          }
          data[v['date']] = [0, 0, v.date]
          if (v.country === '新增用户留存') {
            data[v['date']][0] = v.value
          } else if (v.country === '活跃用户留存') {
            data[v['date']][1] = v.value
          }
        })
        for (var k in data) {
          this.keepExcelData.push([data[k][0], data[k][1], data[k][2]])
        }
        this.keep_loading = false
      })
    },
    getSource() {
      this.source_loading = true
      this.sourceShowDate = getBeforeDate(this.sourceDate) + '至' + getBeforeDate(1)
      source({ date: this.sourceDate }).then(response => {
        this.sourceData = response.data
        this.source_loading = false
      })
    },
    setDate(item) {
      if (item === 'behavior') {
        this.behaviorShowDate = getBeforeDate(this.behaviorDate) + '至' + getBeforeDate(1)
        this.getBehavior()
      } else if (item === 'keep') {
        this.keepShowDate = getBeforeDate(this.keepDate) + '至' + getBeforeDate(1)
        this.getKeep()
      } else if (item === 'source') {
        this.sourceShowDate = getBeforeDate(this.sourceDate) + '至' + getBeforeDate(1)
        this.getSource()
      }
    },
    handleDownload(item) {
      this.listLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        let tHeader = []
        let data = []
        let filename = ''
        if (item === 'behavior') {
          tHeader = ['累计访问人数', '转发次数', '转发人数', '时间']
          filename = '行为数据'
          data = this.behaviorExcelData
        } else if (item === 'keep') {
          tHeader = ['新增用户留存', '活跃用户留存', '时间']
          filename = '留存趋势'
          data = this.keepExcelData
        } else if (item === 'source') {
          tHeader = []
          data.push([])
          this.sourceData.forEach(sourceData => {
            tHeader.push(sourceData.type)
            data[0].push(sourceData.value)
          })
          filename = '来源分析'
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
