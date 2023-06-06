<template>
  <div v-loading="listLoading" class="dashboard-editor-container">
    <el-row>
      <el-col v-loading="analyze_loading" :span="24" style="padding-bottom: 20px;">
        <el-card shadow="hover">
          <div class="title">
            <h3>{{ $t('statistics.user.sex_age') }}</h3>
            <div>
              <el-select :placeholder="$t('common.select')" v-model="genderType" @change="setDate('genderType')">
                <el-option
                  v-for="item in genderTypeData"
                  :key="item.value"
                  :label="item.lable"
                  :value="item.value"/>
              </el-select>
              <el-select :placeholder="$t('common.select')" v-model="genderDate" @change="setDate('genderDate')">
                <el-option
                  v-for="item in gender"
                  :key="item.value"
                  :label="item.lable"
                  :value="item.value"/>
              </el-select>
              <span class="date">{{ genderShowDate }}</span>
            </div>
          </div>
          <el-row>
            <el-col :span="12">
              <plot-donut :char-data="genderData" :id="'c1'"/>
            </el-col>
            <el-col :span="12">
              <plot-donut :char-data="agesData" :id="'c2'"/>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col v-loading="province_loading" :span="24" style="padding-bottom: 20px;">
        <el-card shadow="hover">
          <div class="title">
            <h3>{{ $t('statistics.user.regional_distribution') }}</h3>
            <div>
              <el-select :placeholder="$t('common.select')" v-model="provinceType" @change="setDate('provinceType')">
                <el-option
                  v-for="item in provinceTypeData"
                  :key="item.value"
                  :label="item.lable"
                  :value="item.value"/>
              </el-select>
              <el-select :placeholder="$t('common.select')" v-model="provinceDate" @change="setDate('provinceDate')">
                <el-option
                  v-for="item in province"
                  :key="item.value"
                  :label="item.lable"
                  :value="item.value"/>
              </el-select>
              <span class="date">{{ provinceShowDate }}</span>
            </div>
          </div>
          <el-row>
            <el-col :span="12">
              <plot-pie :char-data="provinceData" :id="'c3'"/>
            </el-col>
            <el-col :span="12">
              <plot-pie :char-data="cityData" :id="'c4'"/>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col v-loading="platforms_loading" :span="24" style="padding-bottom: 20px;">
        <el-card shadow="hover">
          <div class="title">
            <h3>{{ $t('statistics.user.terminal_distribution') }}</h3>
            <div>
              <el-select :placeholder="$t('common.select')" v-model="platformsType" @change="setDate('platformsType')">
                <el-option
                  v-for="item in platformsTypeData"
                  :key="item.value"
                  :label="item.lable"
                  :value="item.value"/>
              </el-select>
              <el-select :placeholder="$t('common.select')" v-model="platformsDate" @change="setDate('platformsDate')">
                <el-option
                  v-for="item in platforms"
                  :key="item.value"
                  :label="item.lable"
                  :value="item.value"/>
              </el-select>
              <span class="date">{{ platformsShowDate }}</span>
            </div>
          </div>
          <el-row>
            <el-col :span="12">
              <plot-donut :char-data="platformsData" :id="'c5'"/>
            </el-col>
            <el-col :span="12">
              <plot-pie :char-data="devicesData" :id="'c6'"/>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PlotDonut from '@/components/G2/G2Plot/Donut.vue'
import PlotPie from '@/components/G2/G2Plot/Pie.vue'
import { age_and_sex } from '@/api/statistics'
import { getBeforeDate } from '@/utils/index'
export default {
  name: 'StatisticsAgeAndSexList',
  components: {
    PlotDonut,
    PlotPie
  },
  data() {
    return {
      listLoading: false,
      options: [],
      provinceOptions: [],
      platformsOptions: [],
      analyze_loading: false,
      genderType: 0,
      genderTypeData: [{
        value: 0,
        lable: this.$t('statistics.user.active_user_number')
      }, {
        value: 1,
        lable: this.$t('statistics.user.new_number_of_users')
      }],
      genderDate: 1,
      genderData: [],
      agesData: [],
      gender: [{
        value: 1,
        lable: this.$t('statistics.visit.yesterday')
      }, {
        value: 7,
        lable: this.$t('statistics.visit.recently', { number: 7 })
      }, {
        value: 30,
        lable: this.$t('statistics.visit.recently', { number: 30 })
      }],
      genderShowDate: '',
      province_loading: false,
      provinceType: 0,
      provinceTypeData: [{
        value: 0,
        lable: this.$t('statistics.user.active_user_number')
      }, {
        value: 1,
        lable: this.$t('statistics.user.new_number_of_users')
      }],
      provinceDate: 1,
      provinceData: [],
      cityData: [],
      province: [{
        value: 1,
        lable: this.$t('statistics.visit.yesterday')
      }, {
        value: 7,
        lable: this.$t('statistics.visit.recently', { number: 7 })
      }, {
        value: 30,
        lable: this.$t('statistics.visit.recently', { number: 30 })
      }],
      provinceShowDate: '',
      platforms_loading: false,
      platformsType: 0,
      platformsTypeData: [{
        value: 0,
        lable: this.$t('statistics.user.active_user_number')
      }, {
        value: 1,
        lable: this.$t('statistics.user.new_number_of_users')
      }],
      platformsDate: 1,
      platformsData: [],
      devicesData: [],
      platforms: [{
        value: 1,
        lable: this.$t('statistics.visit.yesterday')
      }, {
        value: 7,
        lable: this.$t('statistics.visit.recently', { number: 7 })
      }, {
        value: 30,
        lable: this.$t('statistics.visit.recently', { number: 30 })
      }],
      platformsShowDate: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.genderShowDate = getBeforeDate(this.genderDate) + this.$t('common.to') + getBeforeDate(1)
      this.provinceShowDate = getBeforeDate(this.provinceDate) + this.$t('common.to') + getBeforeDate(1)
      this.platformsShowDate = getBeforeDate(this.platformsDate) + this.$t('common.to') + getBeforeDate(1)
      age_and_sex().then(response => {
        this.platformsOptions = this.provinceOptions = this.options = response.data
        this.genderData = this.options.visit_uv.genders
        this.agesData = this.options.visit_uv.ages
        this.provinceData = this.provinceOptions.visit_uv.province
        this.cityData = this.provinceOptions.visit_uv.city
        this.platformsData = this.platformsOptions.visit_uv.platforms
        this.devicesData = this.platformsOptions.visit_uv.devices
        this.listLoading = false
      })
    },
    getGender() {
      this.analyze_loading = true
      this.genderShowDate = getBeforeDate(this.genderDate) + this.$t('common.to') + getBeforeDate(1)
      age_and_sex({ date: this.genderDate }).then(response => {
        this.options = response.data
        if (this.genderType === 0) {
          this.genderData = this.options.visit_uv.genders
          this.agesData = this.options.visit_uv.ages
        } else {
          this.genderData = this.options.visit_uv_new.genders
          this.agesData = this.options.visit_uv_new.ages
        }
        this.analyze_loading = false
      })
    },
    getProvince() {
      this.province_loading = true
      this.provinceShowDate = getBeforeDate(this.provinceDate) + this.$t('common.to') + getBeforeDate(1)
      age_and_sex({ date: this.provinceDate }).then(response => {
        this.provinceOptions = response.data
        if (this.provinceType === 0) {
          this.provinceData = this.provinceOptions.visit_uv.province
          this.cityData = this.provinceOptions.visit_uv.city
        } else {
          this.provinceData = this.provinceOptions.visit_uv_new.province
          this.cityData = this.provinceOptions.visit_uv_new.city
        }
        this.province_loading = false
      })
    },
    getPlatforms() {
      this.platforms_loading = true
      this.platformsShowDate = getBeforeDate(this.platformsDate) + this.$t('common.to') + getBeforeDate(1)
      age_and_sex({ date: this.platformsDate }).then(response => {
        this.platformsOptions = response.data
        if (this.platformsType === 0) {
          this.platformsData = this.platformsOptions.visit_uv.platforms
          this.devicesData = this.platformsOptions.visit_uv.devices
        } else {
          this.platformsData = this.platformsOptions.visit_uv_new.platforms
          this.devicesData = this.platformsOptions.visit_uv_new.devices
        }
        this.platforms_loading = false
      })
    },
    setDate(item) {
      if (item === 'genderType') {
        this.analyze_loading = true
        if (this.genderType === 0) {
          this.genderData = this.options.visit_uv.genders
          this.agesData = this.options.visit_uv.ages
        } else {
          this.genderData = this.options.visit_uv_new.genders
          this.agesData = this.options.visit_uv_new.ages
        }
        this.analyze_loading = false
      } else if (item === 'genderDate') {
        this.genderShowDate = getBeforeDate(this.genderDate) + this.$t('common.to') + getBeforeDate(1)
        this.getGender()
      } else if (item === 'provinceType') {
        this.province_loading = true
        if (this.provinceType === 0) {
          this.provinceData = this.provinceOptions.visit_uv.province
          this.cityData = this.provinceOptions.visit_uv.city
        } else {
          this.provinceData = this.provinceOptions.visit_uv_new.province
          this.cityData = this.provinceOptions.visit_uv_new.city
        }
        this.province_loading = false
      } else if (item === 'provinceDate') {
        this.provinceShowDate = getBeforeDate(this.provinceDate) + this.$t('common.to') + getBeforeDate(1)
        this.getProvince()
      } else if (item === 'platformsType') {
        this.platforms_loading = true
        if (this.platformsType === 0) {
          this.platformsData = this.platformsOptions.visit_uv.platforms
          this.devicesData = this.platformsOptions.visit_uv.devices
        } else {
          this.platformsData = this.platformsOptions.visit_uv_new.platforms
          this.devicesData = this.platformsOptions.visit_uv_new.devices
        }
        this.platforms_loading = false
      } else if (item === 'platformsDate') {
        this.platformsShowDate = getBeforeDate(this.platformsDate) + this.$t('common.to') + getBeforeDate(1)
        this.getPlatforms()
      }
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
