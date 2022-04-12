<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;float:right;" type="primary" icon="el-icon-edit" @click="dialogVisible = true">添加</el-button>
    </div>
    <el-form :inline="true" :model="formInline" class="form-inline" size="mini">
      <el-form-item>
        <el-button size="mini" @click="handleCheckAllChange">全选/反选</el-button>
      </el-form-item>
      <el-form-item label="积分抵扣方式">
        <el-radio-group v-model="formInline.type" placeholder="请选择积分抵扣方式">
          <el-radio :label="0">固定值</el-radio>
          <el-radio :label="1">百分比</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="积分可抵扣值">
        <el-input v-model="formInline.value" clearable style="width:80px;"/>
      </el-form-item>
      <el-form-item label="是否隐藏">
        <el-radio-group v-model="formInline.is_hidden" placeholder="是否隐藏">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button :loading="formLoading" type="primary" @click="hasAllEdit">提交</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      ref="multipleTable"
      :key="tableKey"
      :data="list"
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
      <el-table-column label="ID" prop="id" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="图片" width="120">
        <template slot-scope="scope">
          <el-image :src="scope.row.good.resources.img | smallImage(150)" :preview-src-list="[ scope.row.good.resources.img ]" style="width:80px;height:80px;"/>
        </template>
      </el-table-column>
      <el-table-column label="商品">
        <template slot-scope="scope">
          <div class="drawing">
            <div class="right">
              <div>{{ scope.row.good.name }}</div>
              <div v-if="scope.row.good.price_show.length > 1">¥ {{ scope.row.good.price_show[0]/100 | 1000 }} - {{ scope.row.good.price_show[1]/100 | 1000 }}</div>
              <div v-else>¥ {{ scope.row.good.price_show[0]/100 | 1000 }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="积分抵扣方式" prop="type" width="300">
        <template slot-scope="scope">
          <el-radio-group v-model="scope.row.type" placeholder="请选择积分抵扣方式" @change="hasEdit(scope.row)">
            <el-radio :label="0">固定值</el-radio>
            <el-radio :label="1">百分比</el-radio>
          </el-radio-group>
        </template>
      </el-table-column>
      <el-table-column label="积分可抵扣值" prop="value" width="200">
        <template slot-scope="scope">
          <el-input v-model="scope.row.value" clearable @input="hasEdit(scope.row)"/>
        </template>
      </el-table-column>
      <el-table-column label="是否隐藏" prop="is_hidden" width="150">
        <template slot-scope="scope">
          <el-radio-group v-model="scope.row.is_hidden" placeholder="是否隐藏" @change="hasEdit(scope.row)">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </template>
      </el-table-column>
      <el-table-column label="操作" class-name="small-padding fixed-width" width="80" fixed="right">
        <template slot-scope="scope">
          <el-tooltip v-permission="$store.jurisdiction.IntegralCommodityDestroy" class="item" effect="dark" content="删除" placement="top-start">
            <el-button :loading="formLoading" type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row)"/>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div class="pagination-operation">
      <div class="operation">
        <el-button size="mini" @click="handleCheckAllChange">全选/反选</el-button>
        <el-button v-permission="$store.jurisdiction.IntegralCommodityDestroy" :loading="formLoading" size="mini" type="danger" @click="handleAllDelete()">删除</el-button>
      </div>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" class="pagination" @pagination="getList"/>
    </div>
    <el-dialog :visible.sync="dialogVisible" title="商品选取">
      <div class="filter-container">
        <el-form :inline="true" :model="dialogListQuery" class="demo-form-inline">
          <el-form-item label="关键字">
            <el-input v-model="dialogListQuery.title" placeholder="商品标题/商品货号" clearable @keyup.enter.native="handleDialogFilter" />
          </el-form-item>
        </el-form>
      </div>
      <el-table
        ref="dialogTable"
        :key="dialogTableKey"
        :data="dialogList"
        height="400"
        row-key="id"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        @sort-change="dialogSortChange"
        @selection-change="handleDialogSelectionChange">
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
      <div v-show="dialogTotal>0" class="pagination-operation">
        <div class="selected">已选择 <span>{{ dialogMultipleSelection.length }}</span> 条</div>
        <el-button class="all" size="mini" @click="handleDialogCheckAllChange">全选/反选</el-button>
        <pagination :total="dialogTotal" :page.sync="dialogListQuery.page" :limit.sync="dialogListQuery.limit" class="pagination" @pagination="getDialogList"/>
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
  @import "./scss/list";
</style>
<script>
import js from './js/list'
export default js
</script>
