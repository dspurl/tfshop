<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
        <el-form-item label="模板名称">
          <el-input v-model="listQuery.title" placeholder="模板名称" clearable @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleFilter">搜索</el-button>
        </el-form-item>
      </el-form>
      <br>
      <router-link v-permission="$store.jurisdiction.FreightCreate" :to="'FreightCreate'">
        <el-button class="filter-item" style="margin-left: 10px;float:right;" type="primary" icon="el-icon-edit">添加</el-button>
      </router-link>
      <br>
    </div>
    <div v-loading="listLoading">
      <div v-for="(item, index) in list" :key="index" class="zt">
        <el-card shadow="never">
          <el-row type="flex" class="row-bg" justify="space-between">
            <el-col :span="4"><b>{{ item.name }}</b></el-col>
            <el-col :span="20" style="text-align: right">
              最后编辑时间：{{ item.updated_at }}
              <router-link v-permission="$store.jurisdiction.FreightEdit" :to="{ path: 'FreightCreate', query: { id: item.id, copy: true }}">
                <el-button type="text">复制模板</el-button>
              </router-link>
              <router-link v-permission="$store.jurisdiction.FreightEdit" :to="{ path: 'FreightEdit', query: { id: item.id }}">
                <el-button type="text">修改</el-button>
              </router-link>
              <el-button :loading="formLoading" type="text" @click="handleDelete(item)">删除</el-button>
            </el-col>
          </el-row>
        </el-card>
        <el-table
          ref="multipleTable"
          :key="tableKey"
          :data="item.freight_way"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          @sort-change="sortChange"
          @selection-change="handleSelectionChange">
          <el-table-column label="运送到" fixed="left">
            <template slot-scope="scope">
              <span>{{ scope.row.location_name.join(",") }}</span>
            </template>
          </el-table-column>
          <el-table-column label="首件" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.first_piece }}</span>
            </template>
          </el-table-column>
          <el-table-column label="运费(元)" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.first_cost }}</span>
            </template>
          </el-table-column>
          <el-table-column label="费件" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.add_piece }}</span>
            </template>
          </el-table-column>
          <el-table-column label="运费(元)" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.add_cost }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
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
  .zt{
    clear: both;
    padding-bottom: 10px;
  }
</style>

<script>
const provinces = require('../../../assets/provinces')
import { getList, destroy } from '@/api/freight'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination'

export default {
  name: 'FreightList',
  components: { Pagination },
  data() {
    return {
      formLoading: false,
      actionurl: process.env.BASE_API + 'uploadPictures',
      imgHeaders: {
        Authorization: 'Bearer ' + getToken('access_token')
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
      provinces: provinces,
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
        activeIndex: '1'
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
    resetTemp() {
      this.temp = {
        state: 0,
        sort: '5',
        img: ''
      }
    },
    handleCheckAllChange() {
      this.$refs.multipleTable.toggleAllSelection()
    },
    handleSelectionChange(val) { // 设置全选/全不选数据
      this.multipleSelection = val
    },
    handleDelete(row) { // 删除
      const title = '是否确认删除该内容?'
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
    }
  }
}
</script>
