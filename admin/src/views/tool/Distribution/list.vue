<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-permission="$store.jurisdiction.CreateCoupon" class="filter-item" style="margin-left: 10px;float:right;" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      ref="multipleTable"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column type="expand" >
        <template slot-scope="scope">
          <span>2</span>
        </template>
      </el-table-column>
      <el-table-column label="编号" prop="id" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分销名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分销标识">
        <template slot-scope="scope">
          <code>{{ scope.row.identification }}</code>
        </template>
      </el-table-column>
      <el-table-column label="分销等级">
        <template slot-scope="scope">
          <span>{{ scope.row.level }}级</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="goods_sn">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" class-name="small-padding fixed-width" width="250" fixed="right">
        <template slot-scope="scope">
          <el-button v-permission="$store.jurisdiction.EditDistribution" type="success" size="mini" @click="handleStart(scope.row)">编辑</el-button>
          <el-button v-permission="$store.jurisdiction.DeleteDistribution" type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <div class="pagination-operation">
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" class="pagination" @pagination="getList"/>
    </div>

    <!--添加-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="margin-left:50px;">
        <el-form-item label="分销名称" prop="name">
          <el-input v-model="temp.name" maxlength="30" clearable/>
        </el-form-item>
        <el-form-item label="分销标识" prop="identification">
          <el-input v-model="temp.identification" maxlength="50" placeholder="英文加下划线，后台通过些标识获取配置信息" clearable/>
        </el-form-item>
        <el-form-item label="分销级别" prop="level">
          <el-radio-group v-model="temp.level" @change="setLevel">
            <el-radio :label="1">一级</el-radio>
            <el-radio :label="2">二级</el-radio>
            <el-radio :label="3">三级</el-radio>
          </el-radio-group>
          <div slot="tip" class="el-upload__tip">支持的分销级别，最大支持三级</div>
        </el-form-item>
        <el-table
          :data="temp.distribution_rule"
          border
          style="width: 100%">
          <el-table-column
            prop="date"
            label="别名"
            width="140">
            <template slot-scope="scope">
              <el-form :model="scope.row">
                <el-form-item prop="name">
                  <el-input v-model="scope.row.name" maxlength="30" size="mini" placeholder="请输入别名" clearable @input="e => updateInput(e, scope.$index, 'name')"/>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="返佣方式">
            <template slot-scope="scope">
              <el-form :model="scope.row">
                <el-form-item prop="type">
                  <el-switch
                    v-model="scope.row.type"
                    active-text="按比例"
                    inactive-text="固定金额"
                    @change="e => updateInput(e, scope.$index, 'type')"/>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="返佣值"
            width="140">
            <template slot-scope="scope">
              <el-form :model="scope.row">
                <el-form-item prop="price">
                  <el-input v-model="scope.row.price" maxlength="10" size="mini" placeholder="保留小数点后两位" clearable @input="e => updateInput(e, scope.$index, 'price')"/>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('usuel.cancel') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createSubmit():updateSubmit()">确定</el-button>
      </div>
    </el-dialog>
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
    width: 288px;
    height: 188px;
    line-height: 188px;
    text-align: center;
  }
  .progress-img{
    padding: 30px;
  }
  .avatar {
    width: 288px;
    height: 188px;
    display: block;
  }
</style>

<script>
import { getList, setDelete, createSubmit } from '@/api/distribution'
import Pagination from '@/components/Pagination'

export default {
  name: 'DistributionList',
  components: { Pagination },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      tableKey: 0,
      list: null,
      total: 0,
      type: [
        {
          name: '满减优惠券',
          value: 1
        },
        {
          name: '随机优惠券',
          value: 2
        },
        {
          name: '折扣优惠券',
          value: 3
        }
      ],
      textMap: {
        update: '修改',
        create: '添加'
      },
      listLoading: false,
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
        name: [
          { required: true, message: '请输入分销名称', trigger: 'blur' }
        ],
        identification: [
          { required: true, message: '请选择分销标识', trigger: 'change' }
        ],
        level: [
          { required: true, message: '请选择分销级别', trigger: 'change' }
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
        name: '',
        identification: '',
        level: 1,
        distribution_rule: [
          {
            name: '1级分销',
            type: false,
            price: ''
          }
        ]
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
    updateInput(e, index, name) { // 修改规则信息
      this.temp.distribution_rule[index][name] = e
      this.temp = JSON.parse(JSON.stringify(this.temp))
    },
    setLevel(e) { // 切换级别
      this.temp.distribution_rule = []
      for (let i = 0; i < e; i++) {
        this.temp.distribution_rule.push(
          {
            name: (i + 1) + '级分销',
            type: false,
            price: ''
          }
        )
      }
    },
    handleDelete(row) { // 删除
      var title = '删除后，已领取或使用过的优惠券将无法正常读取?'
      var win = '删除成功'
      this.$confirm(title, this.$t('hint.hint'), {
        confirmButtonText: this.$t('usuel.confirm'),
        cancelButtonText: this.$t('usuel.cancel'),
        type: 'warning'
      }).then(() => {
        setDelete(row.id, row).then(() => {
          this.getList()
          this.dialogFormVisible = false
          this.$notify({
            title: this.$t('hint.succeed'),
            message: win,
            type: 'success',
            duration: 2000
          })
        })
      }).catch(() => {
      })
    },
    createSubmit() { // 添加
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          for (const item of this.temp.distribution_rule) {
            if (!item.name) {
              this.$message.error('别名不能为空')
              return false
            }
            if (!item.price) {
              this.$message.error('返佣值不能为空')
              return false
            }
          }
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
    }
  }
}
</script>
