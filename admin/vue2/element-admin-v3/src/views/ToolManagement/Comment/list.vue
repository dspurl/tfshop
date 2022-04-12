<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
        <el-form-item label="评价类型ID">
          <el-input v-model="listQuery.model_id" placeholder="评价类型ID" clearable @keyup.enter.native="handleFilter"/>
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
      style="width: 100%;"
      @sort-change="sortChange"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55"
        fixed="left"/>
      <el-table-column label="编号" sortable="custom" prop="id" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="评价类型" sortable="custom" prop="model_type" width="120">
        <template slot-scope="scope">
          <div>{{ scope.row.model_type }}</div>
        </template>
      </el-table-column>
      <el-table-column label="类型ID" sortable="custom" prop="model_id" width="120">
        <template slot-scope="scope">
          <div>{{ scope.row.model_id }}</div>
        </template>
      </el-table-column>
      <el-table-column label="评价图片" width="250">
        <template slot-scope="scope">
          <el-image
            v-for="(item,index) of scope.row.resources_many"
            :key="index"
            :src="item.img | smallImage(80)"
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
      <el-table-column label="状态" align="center" width="80" sortable="custom" prop="state">
        <template slot-scope="scope">
          <span>{{ scope.row.state }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创始时间" align="center" sortable="custom" prop="created_at" width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" class-name="small-padding fixed-width" width="250" fixed="right">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="审核" placement="top-start">
            <el-popover
              v-permission="$store.jurisdiction.CommentEdit"
              v-if="scope.row.state === '待审核'"
              placement="top"
              width="160">
              <p>审核是否通过？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="setAudit(scope.row, 2)">不通过</el-button>
                <el-button type="primary" size="mini" @click="setAudit(scope.row, 1)">通过</el-button>
              </div>
              <el-button slot="reference" :loading="formLoading" type="warning" icon="el-icon-view" circle/>
            </el-popover>
          </el-tooltip>
          <el-tooltip v-permission="$store.jurisdiction.CommentEdit" v-if="!scope.row.reply" class="item" effect="dark" content="回复" placement="top-start">
            <el-button :loading="formLoading" type="primary" icon="el-icon-chat-line-square" circle @click="handleReply(scope.row)"/>
          </el-tooltip>
          <el-tooltip v-permission="$store.jurisdiction.CommentDestroy" class="item" effect="dark" content="删除" placement="top-start">
            <el-button :loading="formLoading" type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row)"/>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!--回复-->
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
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
        <el-button :loading="formLoading" type="primary" @click="setReply">确 定</el-button>
      </span>
    </el-dialog>
    <!--分页-->
    <div class="pagination-operation">
      <div class="operation">
        <el-button size="mini" @click="handleCheckAllChange">全选/反选</el-button>
        <el-button v-permission="$store.jurisdiction.CommentDestroy" :loading="formLoading" size="mini" type="danger" @click="handleAllDelete()">删除</el-button>
      </div>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" class="pagination" @pagination="getList"/>
    </div>
  </div>
</template>
<style lang='scss' scoped>
  @import "./scss/list";
</style>
<script>
import js from './js/list'
export default js
</script>
