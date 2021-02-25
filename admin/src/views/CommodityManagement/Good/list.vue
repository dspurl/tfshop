<template>
  <div class="app-container">
    <div class="filter-container">
      <el-menu :default-active="listQuery.activeIndex" class="el-menu-demo" mode="horizontal" clearable @select="handleSelect">
        <el-menu-item index="1">全部商品</el-menu-item>
        <el-menu-item index="2">出售中</el-menu-item>
        <el-menu-item index="3">仓库中</el-menu-item>
      </el-menu>
      <br>
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
        <el-form-item label="关键字">
          <el-input v-model="listQuery.title" placeholder="商品标题/商品货号" clearable @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleFilter">搜索</el-button>
        </el-form-item>
      </el-form>
      <br>
      <router-link v-permission="$store.jurisdiction.GoodCreate" :to="'GoodCreate'">
        <el-button class="filter-item" style="margin-left: 10px;float:right;" type="primary" icon="el-icon-edit">添加</el-button>
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
      <el-table-column label="编号" sortable="custom" prop="id" fixed="left" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="图片" width="100">
        <template slot-scope="scope">
          <img :src="scope.row.resources.img | smallImage(150)" style="width:80px;height:80px;">
        </template>
      </el-table-column>
      <el-table-column label="商品" width="200">
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
      <el-table-column label="分类">
        <template slot-scope="scope">
          <span>{{ scope.row.category ? scope.row.category.name : '无' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="货号">
        <template slot-scope="scope">
          <span>{{ scope.row.number }}</span>
        </template>
      </el-table-column>
      <el-table-column label="库存">
        <template slot-scope="scope">
          <span>{{ scope.row.inventory_show }}</span>
        </template>
      </el-table-column>
      <el-table-column label="销量" sortable="custom" prop="sales">
        <template slot-scope="scope">
          <span>{{ scope.row.sales }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" sortable="custom" prop="is_show">
        <template slot-scope="scope">
          <span>{{ scope.row.putaway_show }}</span>
        </template>
      </el-table-column>
      <el-table-column label="减库存方式" sortable="custom" prop="is_inventory">
        <template slot-scope="scope">
          <span>{{ scope.row.is_inventory_show }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否推荐" sortable="custom" prop="is_recommend">
        <template slot-scope="scope">
          <span>{{ scope.row.is_recommend === 1 ? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上架时间" sortable="custom" prop="time">
        <template slot-scope="scope">
          <span>{{ scope.row.time ? scope.row.time : '未发布' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" sortable="custom" prop="updated_at">
        <template slot-scope="scope">
          <span>{{ scope.row.updated_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" class-name="small-padding fixed-width" width="148" fixed="right">
        <template slot-scope="scope">
          <router-link v-permission="$store.jurisdiction.GoodEdit" :to="{ path: 'GoodEdit', query: { id: scope.row.id,page:listQuery.page,activeIndex:listQuery.activeIndex }}">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
              <el-button type="primary" icon="el-icon-edit" circle/>
            </el-tooltip>
          </router-link>
          <el-tooltip v-permission="$store.jurisdiction.GoodEdit" v-if="scope.row.is_show !== 1" class="item" effect="dark" content="立即发布" placement="top-start">
            <el-button :loading="formLoading" type="success" icon="el-icon-sell" circle @click="handleState(scope.row)"/>
          </el-tooltip>
          <el-tooltip v-permission="$store.jurisdiction.GoodEdit" v-else class="item" effect="dark" content="放入库存" placement="top-start">
            <el-button :loading="formLoading" type="info" icon="el-icon-sold-out" circle @click="handleState(scope.row, 1)"/>
          </el-tooltip>
          <el-tooltip v-permission="$store.jurisdiction.GoodDestroy" class="item" effect="dark" content="删除" placement="top-start">
            <el-button :loading="formLoading" type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row)"/>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <div class="pagination-operation">
      <div class="operation">
        <el-button size="mini" @click="handleCheckAllChange">全选/反选</el-button>
        <el-button v-permission="$store.jurisdiction.GoodEdit" v-if="listQuery.activeIndex === '3'" :loading="formLoading" size="mini" type="success" @click="handleAllState()">立即发布</el-button>
        <el-button v-permission="$store.jurisdiction.GoodEdit" v-else-if="listQuery.activeIndex === '2'" :loading="formLoading" size="mini" type="info" @click="handleAllState(1)">放入库存</el-button>
        <el-button v-permission="$store.jurisdiction.GoodDestroy" :loading="formLoading" size="mini" type="danger" @click="handleAllDelete()">删除</el-button>
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
import { getList, destroy, state } from '@/api/Good'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination'

export default {
  name: 'GoodList',
  components: { Pagination },
  data() {
    return {
      formLoading: false,
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
      textMap: {
        update: '修改',
        create: '添加'
      },
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
        activeIndex: this.$route.query.activeIndex ? this.$route.query.activeIndex : '1'
      },
      temp: {},
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        price: [
          { required: true, message: '请填写价格', trigger: 'change' }
        ],
        img: [
          { required: true, message: '请上传图片', trigger: 'change' }
        ],
        state: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        sort: [
          { required: true, message: '请填写排序', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
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
    handleCheckAllChange() {
      this.$refs.multipleTable.toggleAllSelection()
    },
    handleSelectionChange(val) { // 设置全选/全不选数据
      this.multipleSelection = val
    },
    handleState(row, type) { // 变更状态
      let title = '是否确认立即上架商品?'
      if (type === 1) {
        title = '是否确认将商品加入仓库？'
      }
      const win = '操作成功'
      this.$confirm(title, this.$t('hint.hint'), {
        confirmButtonText: this.$t('usuel.confirm'),
        cancelButtonText: this.$t('usuel.cancel'),
        type: 'warning'
      }).then(() => {
        this.formLoading = true
        state(row.id, row).then(() => {
          this.getList()
          this.dialogFormVisible = false
          this.formLoading = false
          this.$notify({
            title: this.$t('hint.succeed'),
            message: win,
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
      const title = '是否确认删除该商品?'
      const win = '删除成功'
      this.$confirm(title, this.$t('hint.hint'), {
        confirmButtonText: this.$t('usuel.confirm'),
        cancelButtonText: this.$t('usuel.cancel'),
        type: 'warning'
      }).then(() => {
        this.formLoading = true
        destroy(row.id).then(() => {
          this.getList()
          this.dialogFormVisible = false
          this.formLoading = false
          this.$notify({
            title: this.$t('hint.succeed'),
            message: win,
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
      let title = '是否确认批量立即上架商品?'
      if (type === 1) {
        title = '是否确认批量将商品加入仓库？'
      }
      const win = '操作成功'
      this.$confirm(title, this.$t('hint.hint'), {
        confirmButtonText: this.$t('usuel.confirm'),
        cancelButtonText: this.$t('usuel.cancel'),
        type: 'warning'
      }).then(() => {
        this.formLoading = true
        state(0, this.multipleSelection).then(() => {
          this.getList()
          this.dialogFormVisible = false
          this.formLoading = false
          this.$notify({
            title: this.$t('hint.succeed'),
            message: win,
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
      const title = '是否确认批量删除内容?'
      const win = '删除成功'
      this.$confirm(title, this.$t('hint.hint'), {
        confirmButtonText: this.$t('usuel.confirm'),
        cancelButtonText: this.$t('usuel.cancel'),
        type: 'warning'
      }).then(() => {
        this.formLoading = true
        destroy(0, this.multipleSelection).then(() => {
          this.getList()
          this.dialogFormVisible = false
          this.formLoading = false
          this.$notify({
            title: this.$t('hint.succeed'),
            message: win,
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
