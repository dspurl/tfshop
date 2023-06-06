<template>
  <div class="app-container">
    <div class="filter-container">
      <el-menu :default-active="listQuery.activeIndex" class="el-menu-demo" mode="horizontal" clearable @select="handleSelect">
        <el-menu-item index="1">{{ $t('good.search.active_index.all') }}({{ goodCount.all }})</el-menu-item>
        <el-menu-item index="2">{{ $t('good.search.active_index.on_offer') }}({{ goodCount.sell }})</el-menu-item>
        <el-menu-item index="3">{{ $t('good.search.active_index.warehouse') }}({{ goodCount.warehouse }})</el-menu-item>
        <el-menu-item index="4">{{ $t('good.search.active_index.low_inventory') }}({{ goodCount.lowInventory }})</el-menu-item>
        <el-menu-item index="5">{{ $t('good.search.active_index.sell_out') }}({{ goodCount.sellOut }})</el-menu-item>
      </el-menu>
      <br>
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
        <el-form-item :label="$t('good.search.form.title.label')">
          <el-input v-model="listQuery.title" :placeholder="$t('good.search.form.title.placeholder')" clearable @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleFilter">{{ $t('common.search') }}</el-button>
          {{ $t('good.search.form.category_id.label') }}:
          <el-cascader
            v-model="listQuery.category_id"
            :options="categorys"
            :props="{ expandTrigger: 'hover' }"
            clearable
            @change="changeCategorys"/>
        </el-form-item>
      </el-form>
      <br>
      <router-link v-permission="$store.jurisdiction.GoodCreate" :to="'GoodCreate'">
        <el-button class="filter-item" style="margin-left: 10px;float:right;" type="primary" icon="el-icon-edit">{{ $t('common.add') }}</el-button>
      </router-link>
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
      @sort-change="sortChange"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55"
        fixed="left"/>
      <el-table-column :label="$t('good.table.id')" sortable="custom" prop="id" width="80">
        <template slot-scope="scope">
          <router-link :to="{ path: '/commodityManagement/good/goodDetail', query: { id: scope.row.id }}" target="_blank" style="width:300px;"> {{ scope.row.id }}</router-link>
        </template>
      </el-table-column>
      <el-table-column :label="$t('good.table.type')" sortable="custom" prop="type" width="120">
        <template slot-scope="scope">
          {{ scope.row.type }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('good.table.img')" width="150">
        <template slot-scope="scope">
          <el-image :src="scope.row.resources.img | smallImage(150)" :preview-src-list="[ scope.row.resources.img ]" style="width:80px;height:80px;"/>
        </template>
      </el-table-column>
      <el-table-column :label="$t('good.table.commodity')" width="200">
        <template slot-scope="scope">
          <div class="drawing">
            <div class="right">
              <div>{{ scope.row.name }}</div>
              <div v-if="scope.row.price_show.length > 1">¥ {{ scope.row.price_show[0] | 1000 }} - {{ scope.row.price_show[1] | 1000 }}</div>
              <div v-else>¥ {{ scope.row.price_show[0] | 1000 }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('good.table.classify')" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.category ? scope.row.category.name : $t('common.table.nothing') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('good.table.number')" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.number }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('good.table.inventory')" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.inventory_show }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('good.table.sales')" sortable="custom" prop="sales" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.sales }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.table.state')" sortable="custom" prop="is_show" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.putaway_show }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('good.table.is_inventory')" sortable="custom" prop="is_inventory" width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.is_inventory_show }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('good.table.is_recommend')" sortable="custom" prop="is_recommend" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.is_recommend === 1 ? $t('common.yes') : $t('common.no') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('good.table.time')" sortable="custom" prop="time" width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.time ? scope.row.time : $t('good.table.unpublished') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('good.table.updated_at')" sortable="custom" prop="updated_at" width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.updated_at }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.operation')" class-name="small-padding fixed-width" width="148" fixed="right">
        <template slot-scope="scope">
          <router-link v-permission="$store.jurisdiction.GoodEdit" :to="{ path: 'GoodEdit', query: { id: scope.row.id,page:listQuery.page,activeIndex:listQuery.activeIndex }}">
            <el-tooltip :content="$t('common.redact')" class="item" effect="dark" placement="top-start">
              <el-button type="primary" icon="el-icon-edit" circle/>
            </el-tooltip>
          </router-link>
          <el-tooltip v-permission="$store.jurisdiction.GoodEdit" v-if="scope.row.is_show !== 1" :content="$t('good.table.button.immediate_release')" class="item" effect="dark" placement="top-start">
            <el-button :loading="formLoading" type="success" icon="el-icon-sell" circle @click="handleState(scope.row)"/>
          </el-tooltip>
          <el-tooltip v-permission="$store.jurisdiction.GoodEdit" v-else :content="$t('good.table.button.inventory')" class="item" effect="dark" placement="top-start">
            <el-button :loading="formLoading" type="info" icon="el-icon-sold-out" circle @click="handleState(scope.row, 1)"/>
          </el-tooltip>
          <el-tooltip v-permission="$store.jurisdiction.GoodDestroy" :content="$t('common.delete')" class="item" effect="dark" placement="top-start">
            <el-button :loading="formLoading" type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row)"/>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <div class="pagination-operation">
      <div class="operation">
        <el-button size="mini" @click="handleCheckAllChange">{{ $t('common.check_all') }}/{{ $t('common.inverse') }}</el-button>
        <el-button v-permission="$store.jurisdiction.GoodEdit" v-if="listQuery.activeIndex === '3'" :loading="formLoading" size="mini" type="success" @click="handleAllState()">立即发布</el-button>
        <el-button v-permission="$store.jurisdiction.GoodEdit" v-else-if="listQuery.activeIndex === '2'" :loading="formLoading" size="mini" type="info" @click="handleAllState(1)">放入库存</el-button>
        <el-button v-permission="$store.jurisdiction.GoodDestroy" :loading="formLoading" size="mini" type="danger" @click="handleAllDelete()">
          {{ $t('common.delete') }}</el-button>
      </div>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" class="pagination" @pagination="getList"/>
    </div>
  </div>
</template>
<style rel="stylesheet/scss" lang="scss">
  .timeInterval{
    top:-4px;
  }
  .pagination-operation{
    margin-bottom: 80px;
    float:left;
  }
  .pagination-operation .operation{
    margin-left:20px;
    margin-top: 32px;
    font-size: 12px;
    float:left;
    margin-right: 10px;
  }
  .pagination-operation .pagination{
    float:left;
    padding: 0 0;
  }
  .drawing img{
    float:left;
  }
  .drawing .right{
    text-align: left;
    float:left;
    margin-left: 10px;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 188px;
    height: 188px;
    line-height: 188px;
    text-align: center;
  }
  .progress-img{
    padding: 30px;
  }
  .avatar {
    width: 188px;
    height: 188px;
    display: block;
  }
</style>

<script>
import { getList, destroy, state, count } from '@/api/good'
import { getList as getCateList } from '@/api/category'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination'

export default {
  name: 'GoodList',
  components: { Pagination },
  data() {
    return {
      formLoading: false,
      goodCount: {
        all: 0,
        sell: 0,
        warehouse: 0,
        lowInventory: 0,
        sellOut: 0
      },
      actionurl: process.env.BASE_API + 'uploadPictures',
      imgHeaders: {
        Authorization: getToken('token_type') + ' ' + getToken('access_token')
      },
      dialogVisible: false,
      ruleForm: [],
      checkAll: false,
      tableKey: 0,
      list: null,
      total: 0,
      imgData: {
        type: 1,
        size: 1024 * 500
      },
      imgProgressPercent: 0,
      loading: false,
      listLoading: false,
      imgProgress: false,
      dialogStatus: '',
      dialogFormVisible: false,
      listQuery: {
        limit: 10,
        page: this.$route.query.page ? Number(this.$route.query.page) : 1,
        sort: '-id',
        activeIndex: this.$route.query.activeIndex ? this.$route.query.activeIndex : '1',
        cateId: this.$route.query.cateId
      },
      temp: {},
      categorys: []
    }
  },
  created() {
    this.getList()
    this.getGoodCount()
    this.getCateList()
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
    getGoodCount() {
      count().then(response => {
        this.goodCount = response.data
      })
    },
    getCateList() {
      getCateList(this.listQuery).then(response => {
        this.categorys = response.data.options
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
    changeCategorys(id) {
      this.listQuery.cateId = id
      this.handleFilter()
    },
    handleSelect(key, keyPath) {
      this.listQuery.activeIndex = key
      this.handleFilter()
    },
    handleCheckAllChange() {
      this.$refs.multipleTable.toggleAllSelection()
    },
    handleSelectionChange(val) { // 设置全选/全不选数据
      this.multipleSelection = val
    },
    handleState(row, type) { // 变更状态
      let title = this.$t('good.operation.state.confirm.title.putaway')
      if (type === 1) {
        title = this.$t('good.operation.state.confirm.title.inventory')
      }
      this.$confirm(title, this.$t('common.hint'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        this.formLoading = true
        state(row.id, row).then(() => {
          this.getList()
          this.dialogFormVisible = false
          this.formLoading = false
          this.$notify({
            title: this.$t('common.succeed'),
            message: this.$t('hint.succeed.win', { 'attribute': this.$t('common.operation') }),
            type: 'success',
            duration: 2000
          })
        }).catch(() => {
          this.formLoading = false
        })
      }).catch(() => {
      })
    },
    handleDelete(row) { // 删除
      this.$confirm(this.$t('good.operation.delete.confirm.title'), this.$t('common.hint'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        this.formLoading = true
        destroy(row.id).then(() => {
          this.getList()
          this.dialogFormVisible = false
          this.formLoading = false
          this.$notify({
            title: this.$t('common.succeed'),
            message: this.$t('hint.succeed.win', { 'attribute': this.$t('common.delete') }),
            type: 'success',
            duration: 2000
          })
        }).catch(() => {
          this.formLoading = false
        })
      }).catch(() => {
      })
    },
    handleAllState(type) { // 批量变更状态
      let title = this.$t('good.operation.state.confirm.title.putaway.batch')
      if (type === 1) {
        title = this.$t('good.operation.state.confirm.title.inventory.batch')
      }
      this.$confirm(title, this.$t('common.hint'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        this.formLoading = true
        state(0, this.multipleSelection).then(() => {
          this.getList()
          this.dialogFormVisible = false
          this.formLoading = false
          this.$notify({
            title: this.$t('common.succeed'),
            message: this.$t('hint.succeed.win', { 'attribute': this.$t('common.operation') }),
            type: 'success',
            duration: 2000
          })
        }).catch(() => {
          this.formLoading = false
        })
      }).catch(() => {
      })
    },
    handleAllDelete() { // 批量删除
      this.$confirm(this.$t('good.operation.delete.confirm.title.batch'), this.$t('common.hint'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        this.formLoading = true
        destroy(0, this.multipleSelection).then(() => {
          this.getList()
          this.dialogFormVisible = false
          this.formLoading = false
          this.$notify({
            title: this.$t('common.succeed'),
            message: this.$t('hint.succeed.win', { 'attribute': this.$t('common.delete') }),
            type: 'success',
            duration: 2000
          })
        }).catch(() => {
          this.formLoading = false
        })
      }).catch(() => {
      })
    }
  }
}
</script>
