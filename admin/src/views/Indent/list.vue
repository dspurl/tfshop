<template>
  <div class="app-container">
    <div class="filter-container">
      <el-menu :default-active="listQuery.activeIndex" class="el-menu-demo" mode="horizontal" clearable @select="handleSelect">
        <el-menu-item index="0">全部订单</el-menu-item>
        <el-menu-item index="1">待付款</el-menu-item>
        <el-menu-item index="2">待发货</el-menu-item>
        <el-menu-item index="3">待收货</el-menu-item>
        <el-menu-item index="4">待评价</el-menu-item>
        <el-menu-item index="5">已完成</el-menu-item>
        <el-menu-item index="6">已取消</el-menu-item>
      </el-menu>
      <br>
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
        <el-form-item label="订单号">
          <el-input v-model="listQuery.title" placeholder="订单号" clearable/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleFilter">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      v-loading="listLoading"
      ref="multipleTable"
      :key="tableKey"
      :data="list"
      style="width: 100%;">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-table
            ref="orderGoodsTable"
            :data="scope.row.goods_list"
            style="width: 100%;">
            <el-table-column label="商品">
              <template slot-scope="props">
                <div class="drawing">
                  <img :src="props.row.img" style="width:45px;height:45px;">
                  <div class="right">
                    <div style="width:300px;">{{ props.row.name }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="单价（元）">
              <template slot-scope="props">
                <div>{{ props.row.price }}</div>
              </template>
            </el-table-column>
            <el-table-column label="数量">
              <template slot-scope="props">
                <div>{{ props.row.number }}件</div>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="编号" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单编号">
        <template slot-scope="scope">
          <span>{{ scope.row.identification }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单总额">
        <template slot-scope="scope">
          <span>{{ scope.row.total | 1000 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="运费">
        <template slot-scope="scope">
          <span v-if="scope.row.carriage">{{ scope.row.carriage | 1000 }}</span>
          <span v-else>免运费</span>
        </template>
      </el-table-column>
      <el-table-column label="备注">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单时间">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单状态">
        <template slot-scope="scope">
          <span>{{ scope.row.state_show }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" class-name="small-padding fixed-width" width="200">
        <template slot-scope="scope">
          <router-link v-permission="$store.jurisdiction.EditProduct" :to="{ path: '/Indent/shipment', query: { id: scope.row.id }}">
            <el-button type="warning" size="mini" style="width:80px;">订单详情</el-button>
          </router-link>
          <router-link v-permission="$store.jurisdiction.EditProduct" v-if="scope.row.state === 2" :to="{ path: 'shipment', query: { id: scope.row.id }}">
            <el-button type="primary" size="mini">发货</el-button>
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
import { getList, createSubmit, updateSubmit } from '@/api/Indent'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
export default {
  name: 'IndentList',
  components: { Pagination },
  data() {
    return {
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
        page: 1,
        limit: 10,
        sort: '+id',
        activeIndex: '0'
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
      this.getList()
    },

    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      } else if (prop === 'time') {
        this.sortByTIME(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
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
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) { // 编辑
      this.temp = null
      this.temp = row
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleCheckAllChange() {
      this.$refs.multipleTable.toggleAllSelection()
    },
    handleSelectionChange(val) { // 设置全选/全不选数据
      this.multipleSelection = val
    },
    handleState(row, type) { // 变更状态
      var title = '是否确认立即上架商品?'
      if (type === 1) {
        title = '是否确认将商品加入仓库？'
      }
      this.$confirm(title, this.$t('hint.hint'), {
        confirmButtonText: this.$t('usuel.confirm'),
        cancelButtonText: this.$t('usuel.cancel'),
        type: 'warning'
      }).then(() => {
      }).catch(() => {
      })
    },
    handleDelete(row) { // 删除
      var title = '是否确认删除该商品?'
      this.$confirm(title, this.$t('hint.hint'), {
        confirmButtonText: this.$t('usuel.confirm'),
        cancelButtonText: this.$t('usuel.cancel'),
        type: 'warning'
      }).then(() => {
      }).catch(() => {
      })
    },
    createSubmit() { // 添加
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createSubmit(this.temp).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: this.$t('hint.succeed'),
              message: this.$t('hint.creatingSuccessful'),
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    updateSubmit() { // 更新
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateSubmit(this.temp.id, this.temp).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: this.$t('hint.succeed'),
              message: this.$t('hint.updateSuccessful'),
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 上传成功
    handleAvatarSuccess(res, file) {
      this.temp.img = file.response
      this.imgProgress = false
      this.imgProgressPercent = 0
    },
    // 上传时
    handleProgress(file, fileList) {
      this.imgProgressPercent = file.percent
    },
    // 图片格式大小验证
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 < 500

      if (
        ['image/jpeg',
          'image/gif',
          'image/png',
          'image/bmp'
        ].indexOf(file.type) === -1) {
        this.$message.error('请上传正确的图片格式')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 500KB!')
      }
      this.imgProgress = true
      return isLt2M
    }
  }
}
</script>
