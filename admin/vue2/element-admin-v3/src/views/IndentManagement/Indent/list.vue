<template>
  <div class="app-container">
    <div class="filter-container">
      <el-menu :default-active="listQuery.activeIndex" class="el-menu-demo" mode="horizontal" clearable @select="handleSelect">
        <el-menu-item index="0">{{ $t('good_indent.state.all') }}</el-menu-item>
        <el-menu-item index="1">{{ $t('good_indent.state.pay') }}</el-menu-item>
        <el-menu-item index="2">{{ $t('good_indent.state.deliver') }}</el-menu-item>
        <el-menu-item index="3">{{ $t('good_indent.state.take') }}</el-menu-item>
        <el-menu-item index="5">{{ $t('good_indent.state.accomplish') }}</el-menu-item>
        <el-menu-item index="6">{{ $t('good_indent.state.cancel') }}</el-menu-item>
        <el-menu-item index="7">{{ $t('good_indent.state.refund') }}</el-menu-item>
      </el-menu>
      <br>
      <el-button v-permission="$store.jurisdiction.IndentExport" :loading="formLoading" class="filter-item" style="margin-left: 10px;float:right;" icon="el-icon-download" @click="handleExport">{{ $t('common.export') }}</el-button>
      <el-radio-group v-model="listQuery.type" size="small" style="margin-bottom: 10px;" @change="handleFilter">
        <el-radio-button :label="0">{{ $t('good_indent.type.common') }}</el-radio-button>
      </el-radio-group>
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
        <el-form-item :label="$t('good_indent.info')">
          <el-input :placeholder="$t('good_indent.placeholder.info')" v-model="listQuery.title" clearable/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleFilter">{{ $t('common.search') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      v-loading="listLoading"
      ref="multipleTable"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-table
            ref="orderGoodsTable"
            :data="scope.row.goods_list"
            style="width: 100%;">
            <el-table-column :label="$t('good_indent.commodity')" width="400">
              <template slot-scope="props">
                <div class="good-box">
                  <el-image :src="props.row.img" :preview-src-list="[props.row.img]" fit="scale-down" style="width:60px;"/>
                  <div class="right">
                    <div>
                      <router-link :to="{ path: '/commodityManagement/good/goodDetail', query: { id: props.row.good_id }}" target="_blank"> {{ props.row.name }}</router-link>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('good.table.type')" width="120">
              <template slot-scope="props">
                <div>{{ props.row.good.type }}</div>
              </template>
            </el-table-column>
            <el-table-column :label="`${$t('good_indent.price')}(${$t('common.monetary_unit')})`" width="180">
              <template slot-scope="props">
                <div>{{ props.row.price }}</div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('good_indent.number')" width="120">
              <template slot-scope="props">
                <div>{{ props.row.number }}件</div>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column :label="$t('good.table.id')" width="100" sortable="custom" prop="id">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('good_indent.identification')" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.identification }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('good_indent.type')" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('good_indent.state')" width="120" sortable="custom" prop="state">
        <template slot-scope="scope">
          <span>{{ scope.row.state_show }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('good_indent.total')" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.total ? scope.row.total : 0 | 1000 }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('good_indent.carriage')" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.carriage">{{ scope.row.carriage | 1000 }}</span>
          <span v-else>{{ $t('good_indent.freight_free') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('good_indent.good_location')" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.good_location ? scope.row.good_location.name : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('good_indent.cellphone')" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.good_location ? scope.row.good_location.cellphone : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('good_indent.location')" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.good_location ? scope.row.good_location.location : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('good_indent.dhl')" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.dhl ? scope.row.dhl.name : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('good_indent.odd')" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.odd }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('good_indent.remark')" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('good_indent.created_at')" width="180" sortable="custom" prop="created_at">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.operation')" fixed="right" class-name="small-padding fixed-width" width="120">
        <template slot-scope="scope">
          <router-link v-permission="$store.jurisdiction.IndentDetail" :to="{ path: 'indentDetail', query: { id: scope.row.id }}">
            <el-tooltip :content="$t('good_indent.operation.info')" class="item" effect="dark" placement="top-start">
              <el-button type="warning" icon="el-icon-tickets" circle/>
            </el-tooltip>
          </router-link>
          <router-link v-if="scope.row.state === 2" :to="{ path: 'indentDetail', query: { id: scope.row.id }}">
            <el-tooltip :content="$t('good_indent.operation.shipments')" class="item" effect="dark" placement="top-start">
              <el-button type="primary" icon="el-icon-truck" circle/>
            </el-tooltip>
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <div class="pagination-operation">
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" class="pagination" @pagination="getList"/>
    </div>
  </div>
</template>
<style lang='scss' scoped>
  .good-box{
    display: flex;
    .right{
      margin-left: 10px;
    }
  }
</style>

<script>
import { getList, exports } from '@/api/indent'
import Pagination from '@/components/Pagination'
export default {
  name: 'IndentList',
  components: { Pagination },
  data() {
    return {
      dialogVisible: false,
      ruleForm: [],
      checkAll: false,
      tableKey: 0,
      list: null,
      total: 0,
      imgProgressPercent: 0,
      loading: false,
      listLoading: false,
      imgProgress: false,
      dialogStatus: '',
      dialogFormVisible: false,
      listQuery: {
        page: 1,
        limit: 10,
        sort: '-id',
        activeIndex: '0',
        type: 0
      },
      temp: {}
    }
  },
  created() {
    this.getList()
  },
  activated() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (order === 'ascending') {
        this.listQuery.sort = '+' + prop
      } else {
        this.listQuery.sort = '-' + prop
      }
      this.handleFilter()
    },
    handleSelect(key, keyPath) {
      this.listQuery.activeIndex = key
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        state: 0,
        sort: '5',
        img: ''
      }
    },
    handleExport() {
      this.formLoading = true
      exports(this.listQuery).then(response => {
        window.open(response.data)
      }).finally(res => {
        this.formLoading = false
      })
    }
  }
}
</script>
