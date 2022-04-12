<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
        <el-form-item label="优惠券名称">
          <el-input v-model="listQuery.name" placeholder="名称" clearable @keyup.enter.native="handleFilter"/>
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
      <el-button v-permission="$store.jurisdiction.CouponCreate" class="filter-item" style="margin-left: 10px;float:right;" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
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
      <el-table-column label="编号" sortable="custom" prop="id" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="优惠券名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="优惠券类型" sortable="custom" prop="type">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="优惠券价值" sortable="custom" prop="cost">
        <template slot-scope="scope">
          <span>{{ scope.row.cost }}</span>
        </template>
      </el-table-column>
      <el-table-column label="优惠券数量" align="center" sortable="custom" prop="amount">
        <template slot-scope="scope">
          <span>{{ scope.row.amount ? scope.row.amount : '不限' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="优惠券剩余数量" align="center" sortable="custom" prop="residue">
        <template slot-scope="scope">
          <span>{{ scope.row.residue ? scope.row.residue : '不限' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="门槛" align="center" sortable="custom" prop="sill">
        <template slot-scope="scope">
          <span>{{ scope.row.sill ? scope.row.sill : '无' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" sortable="custom" prop="state">
        <template slot-scope="scope">
          <span>{{ scope.row.state }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创始时间" align="center" sortable="custom" prop="created_at">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="领取结束时间" align="center" sortable="custom" prop="end_time">
        <template slot-scope="scope">
          <span>{{ scope.row.end_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" class-name="small-padding fixed-width" width="120" fixed="right">
        <template slot-scope="scope">
          <el-tooltip v-permission="$store.jurisdiction.CouponEdit" v-if="scope.row.state === '进行中'" class="item" effect="dark" content="提前结束" placement="top-start">
            <el-button :loading="formLoading" type="warning" icon="el-icon-video-pause" circle @click="handleEnd(scope.row)"/>
          </el-tooltip>
          <el-tooltip v-permission="$store.jurisdiction.CouponEdit" v-if="scope.row.state === '未开始'" class="item" effect="dark" content="提前开始" placement="top-start">
            <el-button :loading="formLoading" type="success" icon="el-icon-video-play" circle @click="handleStart(scope.row)"/>
          </el-tooltip>
          <el-tooltip v-permission="$store.jurisdiction.CouponDestroy" class="item" effect="dark" content="删除" placement="top-start">
            <el-button :loading="formLoading" type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row)"/>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div class="pagination-operation">
      <div class="operation">
        <el-button size="mini" @click="handleCheckAllChange">全选/反选</el-button>
        <el-button v-permission="$store.jurisdiction.CouponDestroy" :loading="formLoading" size="mini" type="danger" @click="handleAllDelete()">删除</el-button>
      </div>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" class="pagination" @pagination="getList"/>
    </div>
    <!--添加-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 500px; margin-left:50px;">
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
          <p>类型为满减、无门槛时，这里的价值为优惠券的面值;类型为随机时，这里为发送的总额，公式：优惠券价值/优惠券数量（如果优惠券数量没有设置的话，公式为：0到剩余总额的随机数）;类型为折扣时，这里为百分比</p>
        </el-form-item>
        <el-form-item label="优惠券数量" prop="amount">
          <el-input v-model="temp.amount" placeholder="数量不能为空" clearable/>
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
          <div>领取结束时间默认和优惠券失效时间相同，提前结束后，不会影响已发放的优惠券结束时间</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('usuel.cancel') }}</el-button>
        <el-button :loading="formLoading" type="primary" @click="create()">确定</el-button>
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
