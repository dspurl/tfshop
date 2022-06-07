<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-form-item label="关键字">
        <el-input v-model="listQuery.title" placeholder="商品标题" clearable @keyup.enter.native="handleFilter" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleFilter">搜索</el-button>
      </el-form-item>
    </el-form>
    <br>
    <div class="filter-container">
      <router-link v-permission="$store.jurisdiction.GroupPurchaseCreate" :to="'GroupPurchaseCreate'">
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
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-table
            :data="scope.row.group_purchase_sku"
            style="width: 100%;">
            <el-table-column label="拼团价">
              <template slot-scope="props">
                <div>{{ props.row.group_purchase_price | 1000 }}</div>
              </template>
            </el-table-column>
            <el-table-column label="成本价">
              <template slot-scope="props">
                <div>{{ props.row.cost_price | 1000 }}</div>
              </template>
            </el-table-column>
            <el-table-column label="原价">
              <template slot-scope="props">
                <div>{{ props.row.price | 1000 }}</div>
              </template>
            </el-table-column>
            <el-table-column label="限量">
              <template slot-scope="props">
                <div>{{ props.row.limit }}</div>
              </template>
            </el-table-column>
            <el-table-column label="剩余限量">
              <template slot-scope="props">
                <div>{{ props.row.residue_limit }}</div>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="ID" prop="id">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="图片" prop="name" width="120">
        <template slot-scope="scope">
          <el-image
            :src="scope.row.resources_many.find(item => item.depict === 'group_purchase_zimg').img"
            :preview-src-list="scope.row.resources_many.map(item => { return item.img })"
            style="width: 80px; height: 80px"
            fit="scale-down"
            lazy/>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" prop="name" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="拼团活动简介" prop="abstract" width="300">
        <template slot-scope="scope">
          <span>{{ scope.row.abstract }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" prop="time" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" prop="end_time" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.end_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="拼团状态" prop="state" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.state }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否推荐" prop="is_recommend" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.is_recommend }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="sort" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.sort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否上架" prop="is_show" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.is_show }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" class-name="small-padding fixed-width" width="120" fixed="right">
        <template slot-scope="scope">
          <router-link v-permission="$store.jurisdiction.GroupPurchaseEdit" :to="{ path: 'GroupPurchaseEdit', query: { id: scope.row.id }}">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
              <el-button type="primary" icon="el-icon-edit" circle/>
            </el-tooltip>
          </router-link>
          <el-tooltip v-permission="$store.jurisdiction.GroupPurchaseDestroy" class="item" effect="dark" content="删除" placement="top-start">
            <el-button :loading="formLoading" type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row)"/>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div class="pagination-operation">
      <div class="operation">
        <el-button size="mini" @click="handleCheckAllChange">全选/反选</el-button>
        <el-button v-permission="$store.jurisdiction.GroupPurchaseDestroy" :loading="formLoading" size="mini" type="danger" @click="handleAllDelete()">删除</el-button>
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
