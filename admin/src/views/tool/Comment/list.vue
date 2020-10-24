<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
        <el-form-item label="评价类型ID">
          <el-input v-model="listQuery.model_id" placeholder="评价类型ID" clearable/>
        </el-form-item>
        <el-form-item label="评价类型">
          <el-select v-model="listQuery.model_type" placeholder="类型" clearable>
            <el-option v-for="item in type" :key="item.value" :label="item.name" :value="item.value"/>
          </el-select>
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
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column label="编号" prop="id" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="评价类型">
        <template slot-scope="scope">
          <div>{{ scope.row.model_type_show }}</div>
        </template>
      </el-table-column>
      <el-table-column label="类型ID">
        <template slot-scope="scope">
          <div>{{ scope.row.model_id }}</div>
        </template>
      </el-table-column>
      <el-table-column label="评价图片">
        <template slot-scope="scope">
          <el-image
            v-for="(item,index) of scope.row.resources_many"
            :key="index"
            :src="item.img"
            :preview-src-list="scope.row.resources_many.map((ite)=>{return ite.img})"
            style="width: 40px; height: 40px;margin: 2px;border-radius: 5px;"/>
        </template>
      </el-table-column>
      <el-table-column label="评价内容">
        <template slot-scope="scope">
          <div>{{ scope.row.details }}</div>
          <div v-if="scope.row.reply" style="color: #999999;">回复：{{ scope.row.reply.details }}</div>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.state }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创始时间" align="center" prop="goods_sn">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" class-name="small-padding fixed-width" width="250" fixed="right">
        <template slot-scope="scope">
          <el-popover
            v-permission="$store.jurisdiction.EditComment"
            v-if="scope.row.state === '待审核'"
            placement="top"
            width="160">
            <p>审核是否通过？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="setAudit(scope.row, 2)">不通过</el-button>
              <el-button type="primary" size="mini" @click="setAudit(scope.row, 1)">通过</el-button>
            </div>
            <el-button slot="reference" type="warning" size="mini">审核</el-button>
          </el-popover>
          <el-button v-permission="$store.jurisdiction.EditComment" v-if="!scope.row.reply" type="primary" size="mini" @click="handleReply(scope.row)">回复</el-button>
          <el-button v-permission="$store.jurisdiction.DeleteComment" type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--回复-->
    <el-dialog
      :visible.sync="dialogVisible"
      title="回复"
      width="30%">
      <el-form ref="dataForm" :model="ruleForm" :rules="rules">
        <el-form-item prop="reply">
          <el-input
            :rows="2"
            v-model="ruleForm.reply"
            type="textarea"
            placeholder="请输入回复内容"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setReply">确 定</el-button>
      </span>
    </el-dialog>
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
import { getList, setDelete, createSubmit, updateSubmit } from '@/api/comment'
import Pagination from '@/components/Pagination'

export default {
  name: 'CommentList',
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
          name: '商品',
          value: 'GoodIndentCommodity'
        }
      ],
      textMap: {
        update: '修改',
        create: '添加'
      },
      ruleForm: {
        reply: ''
      },
      dialogVisible: false,
      listLoading: false,
      dialogStatus: '',
      dialogFormVisible: false,
      listQuery: {
        page: 1,
        limit: 10,
        sort: '+id',
        model_id: '',
        model_type: ''
      },
      temp: {},
      rules: {
        reply: [
          { required: true, message: '请输入回复内容', trigger: 'blur' }
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
    handleDelete(row) { // 删除
      var title = '删除后，评价和回复信息都将删除?'
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
    handleReply(row) { // 回复窗口
      this.ruleForm.parent_id = row.id
      this.ruleForm.model_type = row.model_type
      this.ruleForm.model_id = row.model_id
      this.dialogVisible = true
    },
    setReply() { // 回复
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.dialogVisible = false
          createSubmit(this.ruleForm).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: this.$t('hint.succeed'),
              message: '回复成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 审核
    setAudit(row, result) {
      this.temp = row
      updateSubmit(result, this.temp).then(() => {
        this.getList()
        this.dialogFormVisible = false
        this.$notify({
          title: this.$t('hint.succeed'),
          message: '操作成功',
          type: 'success',
          duration: 2000
        })
      })
    }
  }
}
</script>
