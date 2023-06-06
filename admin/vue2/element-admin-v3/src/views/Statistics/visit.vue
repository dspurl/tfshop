<template>
  <div v-loading="listLoading" class="dashboard-editor-container">
    <el-row>
      <el-col :span="24" style="padding-bottom: 20px;">
        <el-card shadow="hover">
          <div class="title">
            <h3>{{ $t('statistics.visit.behavioral_data') }}</h3>
            <div class="right" @click="handleDownload('behavior')">{{ $t('common.download') }}</div>
            <div>
              <el-select :placeholder="$t('common.select')" v-model="behaviorDate" @change="setDate('behavior')">
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
            <h3>{{ $t('statistics.visit.retention_trend') }}</h3>
            <div class="right" @click="handleDownload('keep')">{{ $t('common.download') }}</div>
            <div>
              <el-select :placeholder="$t('common.select')" v-model="keepDate" @change="setDate('keep')">
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
            <h3>{{ $t('statistics.visit.stream_analysis') }}</h3>
            <div class="right" @click="handleDownload('source')">{{ $t('common.download') }}</div>
            <div>
              <el-select :placeholder="$t('common.select')" v-model="sourceDate" @change="setDate('source')">
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
  name: 'StatisticsVisitList',
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
        lable: this.$t('statistics.visit.recently', { number: 7 })
      }, {
        value: 30,
        lable: this.$t('statistics.visit.recently', { number: 30 })
      }],
      keep_loading: false,
      keepData: [],
      keepExcelData: [],
      keepDate: 7,
      keepShowDate: '',
      keep: [{
        value: 7,
        lable: this.$t('statistics.visit.recently', { number: 7 })
      }, {
        value: 30,
        lable: this.$t('statistics.visit.recently', { number: 30 })
      }],
      source_loading: false,
      sourceData: [],
      sourceExcelData: [],
      sourceDate: 7,
      sourceShowDate: '',
      source: [{
        value: 7,
        lable: this.$t('statistics.visit.recently', { number: 7 })
      }, {
        value: 30,
        lable: this.$t('statistics.visit.recently', { number: 307 })
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
      this.behaviorShowDate = getBeforeDate(this.behaviorDate) + this.$t('common.to') + getBeforeDate(1)
      behavior({ date: this.behaviorDate }).then(response => {
        this.behaviorData = response.data
        this.behaviorExcelData = []
        const data = {}
        this.behaviorData.map(v => {
          if (!data[v['date']]) {
            data[v['date']] = {}
          }
          data[v['date']] = [0, 0, 0, v.date]
          if (v.country === this.$t('statistics.visit.cumulative_number_of_visitors')) {
            data[v['date']][0] = v.value
          } else if (v.country === this.$t('statistics.visit.number_of_forwarding')) {
            data[v['date']][1] = v.value
          } else if (v.country === this.$t('statistics.visit.forwarding_number')) {
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
      this.keepShowDate = getBeforeDate(this.keepDate) + this.$t('common.to') + getBeforeDate(1)
      keep({ date: this.keepDate }).then(response => {
        this.keepData = response.data
        this.keepExcelData = []
        const data = {}
        this.keepData.map(v => {
          if (!data[v['date']]) {
            data[v['date']] = {}
          }
          data[v['date']] = [0, 0, v.date]
          if (v.country === this.$t('statistics.visit.new_user_retention')) {
            data[v['date']][0] = v.value
          } else if (v.country === this.$t('statistics.visit.active_user_retention')) {
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
      this.sourceShowDate = getBeforeDate(this.sourceDate) + this.$t('common.to') + getBeforeDate(1)
      source({ date: this.sourceDate }).then(response => {
        this.sourceData = response.data
        this.source_loading = false
      })
    },
    setDate(item) {
      if (item === 'behavior') {
        this.behaviorShowDate = getBeforeDate(this.behaviorDate) + this.$t('common.to') + getBeforeDate(1)
        this.getBehavior()
      } else if (item === 'keep') {
        this.keepShowDate = getBeforeDate(this.keepDate) + this.$t('common.to') + getBeforeDate(1)
        this.getKeep()
      } else if (item === 'source') {
        this.sourceShowDate = getBeforeDate(this.sourceDate) + this.$t('common.to') + getBeforeDate(1)
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
          tHeader = [this.$t('statistics.visit.cumulative_number_of_visitors'), this.$t('statistics.visit.number_of_forwarding'), this.$t('statistics.visit.forwarding_number'), this.$t('common.time')]
          filename = this.$t('statistics.visit.behavioral_data')
          data = this.behaviorExcelData
        } else if (item === 'keep') {
          tHeader = [this.$t('statistics.visit.new_user_retention'), this.$t('statistics.visit.active_user_retention'), this.$t('common.time')]
          filename = this.$t('statistics.visit.retention_trend')
          data = this.keepExcelData
        } else if (item === 'source') {
          tHeader = []
          data.push([])
          this.sourceData.forEach(sourceData => {
            tHeader.push(sourceData.type)
            data[0].push(sourceData.value)
          })
          filename = this.$t('statistics.visit.stream_analysis')
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
