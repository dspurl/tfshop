<template>
  <div v-loading="loading" class="createPost-container" style="padding-top: 40px">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="120px" class="ruleForm" style="padding-left: 200px;padding-right:20px;width: 900px;">
      <el-form-item label="选择商品" prop="goodList" style="width:1000px;">
        <el-button class="button" @click="dialogVisible = true">选择</el-button>
        <el-table
          v-loading="listLoading"
          ref="goodTable"
          :key="tableKey"
          :data="ruleForm.goodList"
          height="400"
          row-key="id"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          @sort-change="sortChange"
          @selection-change="handleSelectionChange">
          <el-table-column
            :reserve-selection="true"
            type="selection"
            width="55"
            fixed="left"/>
          <el-table-column label="编号" sortable="custom" prop="id" width="80">
            <template slot-scope="scope">
              <router-link :to="{ path: '/commodityManagement/good/goodDetail', query: { id: scope.row.id }}" target="_blank" style="width:300px;"> {{ scope.row.id }}</router-link>
            </template>
          </el-table-column>
          <el-table-column label="图片" width="120">
            <template slot-scope="scope">
              <el-image :src="scope.row.resources.img | smallImage(150)" :preview-src-list="[ scope.row.resources.img ]" style="width:80px;height:80px;"/>
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
          <el-table-column label="分类" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.category ? scope.row.category.name : '无' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="货号" width="150">
            <template slot-scope="scope">
              <span>{{ scope.row.number }}</span>
            </template>
          </el-table-column>
          <el-table-column label="库存" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.inventory_show }}</span>
            </template>
          </el-table-column>
          <el-table-column label="积分抵扣方式" width="200">
            <template slot-scope="scope">
              <el-radio-group v-model="scope.row.type" placeholder="请选择积分抵扣方式">
                <el-radio :label="0">固定值</el-radio>
                <el-radio :label="1">百分比</el-radio>
              </el-radio-group>
            </template>
          </el-table-column>
          <el-table-column label="积分可抵扣值" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.value" clearable/>
            </template>
          </el-table-column>
          <el-table-column label="操作" class-name="small-padding fixed-width" width="80">
            <template slot-scope="scope">
              <el-tooltip v-permission="$store.jurisdiction.GoodDestroy" class="item" effect="dark" content="删除" placement="top-start">
                <el-button :loading="formLoading" type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row)"/>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button :loading="formLoading" type="primary" @click="dialogStatus==='create'?create():edit()">提交</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogVisible" title="商品选取">
      <div class="filter-container">
        <el-form :inline="true" :model="listQuery" class="demo-form-inline">
          <el-form-item label="关键字">
            <el-input v-model="listQuery.title" placeholder="商品标题/商品货号" clearable @keyup.enter.native="handleFilter" />
          </el-form-item>
        </el-form>
      </div>
      <el-table
        v-loading="listLoading"
        ref="multipleTable"
        :key="tableKey"
        :data="list"
        height="400"
        row-key="id"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        @sort-change="sortChange"
        @selection-change="handleSelectionChange">
        <el-table-column
          :reserve-selection="true"
          type="selection"
          width="55"
          fixed="left"/>
        <el-table-column label="编号" sortable="custom" prop="id" fixed="left" width="80">
          <template slot-scope="scope">
            <router-link :to="{ path: '/commodityManagement/good/goodDetail', query: { id: scope.row.id }}" target="_blank" style="width:300px;"> {{ scope.row.id }}</router-link>
          </template>
        </el-table-column>
        <el-table-column label="图片" width="120">
          <template slot-scope="scope">
            <el-image :src="scope.row.resources.img | smallImage(150)" :preview-src-list="[ scope.row.resources.img ]" style="width:80px;height:80px;"/>
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
        <el-table-column label="分类" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.category ? scope.row.category.name : '无' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="货号" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.number }}</span>
          </template>
        </el-table-column>
        <el-table-column label="库存" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.inventory_show }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" sortable="custom" prop="is_show" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.putaway_show }}</span>
          </template>
        </el-table-column>
        <el-table-column label="上架时间" sortable="custom" prop="time" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.time ? scope.row.time : '未发布' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" sortable="custom" prop="updated_at" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.updated_at }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div v-show="total>0" class="pagination-operation">
        <div class="selected">已选择 <span>{{ multipleSelection.length }}</span> 条</div>
        <el-button class="all" size="mini" @click="handleCheckAllChange">全选/反选</el-button>
        <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" class="pagination" @pagination="getList"/>
      </div>
      <div slot="footer" class="dialog-footer">
        <div class="operation">
          <el-button :loading="formLoading" type="primary" @click="hasSelect">选择</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<style lang='scss' scoped>
  .button{
    margin-bottom: 10px;
  }
  .pagination-operation{
    display:flex;
    align-items:center;
    margin: -50px 0;
    .selected{
      flex: 1;
      position: relative;
      top: 15px;
      span{
        font-weight: bold;
      }
    }
    .all{
      position: relative;
      top: 15px;
    }
  }
  .operation{
    margin-top: 10px;
  }
</style>
<script>
import js from '../js/detail'
export default js
</script>
