<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="visitor" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">当日用户数</div>
            <count-to :start-val="0" :end-val="options.user" :duration="3000" class="card-panel-num"/>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="Indent" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">当日订单数</div>
            <count-to :start-val="0" :end-val="options.indent" :duration="3000" class="card-panel-num"/>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="money" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">当日总收入</div>
            <count-to :start-val="0" :end-val="options.income/100" :duration="3000" class="card-panel-num"/>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="expenditure" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">当日总支出</div>
            <count-to :start-val="0" :end-val="options.expend/100" :duration="3000" class="card-panel-num"/>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="goGood">
          <div class="card-panel-icon-wrapper icon-shopping">
            <svg-icon icon-class="shipments" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">待发货数量</div>
            <count-to :start-val="0" :end-val="options.send" :duration="3000" class="card-panel-num"/>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="goods" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">库存不足商品数量</div>
            <div class="card-panel-num">{{ options.inventoryLess }}</div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" style="padding-bottom: 20px;">
        <el-card shadow="hover">
          <broken-lin-more v-loading="analyze_loading" :title="name" :char-data="pandectData" :id="'c1'"/>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="12">
      <el-col :span="8">
        <el-card id="inventory" shadow="hover">
          <h3>低库存</h3>
          <div v-for="(item) in options.inventoryList" :key="item.id" class="ll">
            <router-link :to="{ path: '/goodsManage/product/EditProduct', query: { id:item.id }}" :title="item.name" class="inventory_link">
              {{ item.name }} - {{ item.inventory }}
            </router-link>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <h3>商品访问榜</h3>
          <div v-for="(item) in options.accessList" :key="item.id" class="ll">
            <router-link :to="{ path: '/goodsManage/product/EditProduct', query: { id: item.id }}" :title="item.name">
              {{ item.name }}
            </router-link>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <h3>商品收藏榜</h3>
          <div v-for="(item) in options.collectList" :key="item.id" class="ll">
            <router-link :to="{ path: '/goodsManage/product/EditProduct', query: { id: item.id }}" :title="item.name">
              {{ item.name }}
            </router-link>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <h3>商品销量榜</h3>
          <div v-for="(item) in options.salesList" :key="item.id" class="ll">
            <router-link :to="{ path: '/goodsManage/product/EditProduct', query: { id: item.id }}" :title="item.name">
              {{ item.name }}
            </router-link>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import BrokenLinMore from '@/components/G2/G2Plot/BrokenLinMore.vue'
import CountTo from 'vue-count-to'
import { indexList } from '@/api/index'
export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    BrokenLinMore,
    CountTo
  },
  data() {
    return {
      listLoading: false,
      options: [],
      analyze_loading: false,
      name: '当日统计',
      pandectData: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      indexList().then(response => {
        this.options = response.data
        this.pandectData = response.data.chart
        this.listLoading = false
      })
    },
    goGood() {
      this.$router.push({ path: '/indent/indentList' })
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
.ll{
  line-height: 45px;
  height:45px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  counter-increment: counter_ll;
}
.ll:before {
		content: counter(counter_ll)".";
}
</style>
