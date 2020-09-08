<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
        <el-form-item label="优惠券名称">
          <el-input v-model="listQuery.name" placeholder="名称" clearable/>
        </el-form-item>
        <el-form-item label="优惠券类型">
          <el-select v-model="listQuery.type" placeholder="类型" clearable>
            <el-option v-for="item in type" :key="item.value" :label="item.name" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleFilter">搜索</el-button>
        </el-form-item>
      </el-form>
      <br>
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
      <el-table-column label="编号" prop="id" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="优惠券名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="优惠券类型">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="优惠券价值">
        <template slot-scope="scope">
          <span>{{ scope.row.cost }}</span>
        </template>
      </el-table-column>
      <el-table-column label="优惠券数量" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="优惠券剩余数量" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.residue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="门槛" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sill ? scope.row.sill : '无' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.state }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创始时间" align="center" prop="goods_sn">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="领取结束时间" align="center" prop="goods_sn">
        <template slot-scope="scope">
          <span>{{ scope.row.endtime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" class-name="small-padding fixed-width" width="250" fixed="right">
        <template slot-scope="scope">
          <el-button v-permission="$store.jurisdiction.EditCoupon" v-if="scope.row.state === '发放中'" type="warning" size="mini" @click="handleEnd(scope.row)">提前结束</el-button>
          <el-button v-permission="$store.jurisdiction.EditCoupon" v-if="scope.row.state === '未发放'" type="success" size="mini" @click="handleStart(scope.row)">提前开始</el-button>
          <el-button v-permission="$store.jurisdiction.DeleteCoupon" type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <div class="pagination-operation">
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" class="pagination" @pagination="getList"/>
    </div>

    <!--添加-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item label="优惠券名称" prop="name">
          <el-input v-model="temp.name" maxlength="30" clearable/>
        </el-form-item>
        <el-form-item label="优惠券类型" prop="type">
          <el-select v-model="temp.type" placeholder="请选择类型" clearable style="width:160px;">
            <el-option v-for="item in type" :key="item.value" :label="item.name" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="优惠券价值" prop="cost">
          <el-input v-model="temp.cost" maxlength="11" clearable>
            <template v-if="temp.type === 3" slot="append">%</template>
            <template v-else slot="append">元</template>
          </el-input>
          <el-alert
            style="margin-top:10px;"
            title="类型为满减、无门槛时，这里的价值为优惠券的面值;类型为随机时，这里为发送的总额，公式：优惠券价值/优惠券数量（如果优惠券数量没有设置的话，公式为：0到剩余总额的随机数）;类型为折扣时，这里为百分比"
            type="warning"/>
        </el-form-item>
        <el-form-item label="优惠券数量" prop="amount">
          <el-input v-model="temp.amount" placeholder="为空不作限制" clearable/>
        </el-form-item>
        <el-form-item label="优惠券门槛" prop="sill">
          <el-input v-model="temp.sill" placeholder="为空不作限制" clearable/>
        </el-form-item>
        <el-form-item label="每人限领" prop="limit_get">
          <el-input v-model="temp.limit_get" placeholder="为空不作限制" clearable/>
        </el-form-item>
        <el-form-item label="领取时间" prop="time">
          <el-date-picker
            v-model="temp.time"
            :picker-options="pickerOptions"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"/>
        </el-form-item>
        <el-alert
          :title="'活动时间持续 3 天，有效时间与领取时间一致'"
          style="margin-top:10px;"
          type="warning"/>
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
import { getList, setDelete, createSubmit, updateSubmit } from '@/api/Coupon'
import Pagination from '@/components/Pagination'

export default {
  name: 'CouponList',
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
          { required: true, message: '请输入轮播名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择类型', trigger: 'change' }
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
        name: '',
        cost: '',
        type: '',
        amount: '',
        residue: '',
        sill: '',
        time: '',
        limit_get: ''
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
    handleEnd(row) { // 提前结束
      this.temp = row
      this.temp.action = 1
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
    },
    handleStart(row) { // 提前开始
      this.temp = row
      this.temp.action = 2
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
  }
}
</script>
