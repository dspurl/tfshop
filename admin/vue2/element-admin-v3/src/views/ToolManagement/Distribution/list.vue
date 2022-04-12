<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-permission="$store.jurisdiction.DistributionCreate" class="filter-item" style="margin-left: 10px;float:right;" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
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
      <el-table-column type="expand" >
        <template slot-scope="scope">
          <el-table
            :data="scope.row.distribution_rule"
            border
            style="width: 610px">
            <el-table-column
              prop="level"
              label="级别"/>
            <el-table-column
              prop="name"
              label="别名"/>
            <el-table-column
              prop="type"
              label="返佣方式"
              width="200"/>
            <el-table-column
              prop="price"
              label="返佣值"
              width="200">
              <template slot-scope="sope">
                {{ sope.row.price }}{{ sope.row.type === '按比例' ? '%' : '' }}
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="编号" sortable="custom" prop="id" align="center">
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
      <el-table-column label="分销等级" sortable="custom" prop="level">
        <template slot-scope="scope">
          <span>{{ scope.row.level }}级</span>
        </template>
      </el-table-column>
      <el-table-column label="分销状态" sortable="custom" prop="state">
        <template slot-scope="scope">
          <span>{{ scope.row.state === 1 ? '关闭' : '开启' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" sortable="custom" prop="created_at">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" class-name="small-padding fixed-width" width="120" fixed="right">
        <template slot-scope="scope">
          <el-tooltip v-permission="$store.jurisdiction.DistributionEdit" class="item" effect="dark" content="编辑" placement="top-start">
            <el-button type="primary" icon="el-icon-edit" circle @click="handleUpdate(scope.row)"/>
          </el-tooltip>
          <el-tooltip v-permission="$store.jurisdiction.DistributionDestroy" class="item" effect="dark" content="删除" placement="top-start">
            <el-button :loading="formLoading" type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row)"/>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div class="pagination-operation">
      <div class="operation">
        <el-button size="mini" @click="handleCheckAllChange">全选/反选</el-button>
        <el-button v-permission="$store.jurisdiction.DistributionDestroy" :loading="formLoading" size="mini" type="danger" @click="handleAllDelete()">删除</el-button>
      </div>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" class="pagination" @pagination="getList"/>
    </div>
    <!--添加-->
    <el-dialog :title="textMap[dialogStatus]" :close-on-click-modal="false" :visible.sync="dialogFormVisible">
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
            <!--<el-radio :label="2">二级</el-radio>
            <el-radio :label="3">三级</el-radio>-->
          </el-radio-group>
          <div slot="tip" class="el-upload__tip">支持的分销级别，最大支持三级</div>
        </el-form-item>
        <el-form-item label="分销状态" prop="level">
          <el-radio-group v-model="temp.state">
            <el-radio :label="0">开启</el-radio>
            <el-radio :label="1">关闭</el-radio>
          </el-radio-group>
          <div slot="tip" class="el-upload__tip">状态：关闭后，将不会触发</div>
        </el-form-item>
        <el-table
          :data="temp.distribution_rule"
          border
          style="width: 100%">
          <el-table-column
            prop="level"
            label="级别"
            width="140">
            <template slot-scope="scope">
              <el-form :model="scope.row">
                {{ scope.row.level }}
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
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
            prop="type"
            label="返佣方式">
            <template slot-scope="scope">
              <el-form :model="scope.row">
                <el-form-item prop="type">
                  <el-switch
                    v-model="scope.row.type"
                    active-text="按比例"
                    inactive-text="按固定值"
                    @change="e => updateInput(e, scope.$index, 'type')"/>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            prop="price"
            label="返佣值"
            width="170">
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
        <el-button :loading="formLoading" type="primary" @click="dialogStatus==='create'?create():edit()">确定</el-button>
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
