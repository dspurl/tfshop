<template>
  <div v-loading="loading" class="createPost-container" style="padding-top: 40px">
    <el-steps :active="step" class="step" align-center>
      <el-step title="步骤1" description="基础信息"/>
      <el-step title="步骤2" description="设置奖品"/>
      <el-step title="步骤3" description="设置时间"/>
    </el-steps>
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="ruleForm" style="padding-left: 200px;padding-right:20px;">
      <div v-if="step === 1">
        <el-form-item label="名称" prop="name" style="width:400px;">
          <el-input v-model="ruleForm.name" maxlength="20" placeholder="请输入名称" clearable/>
        </el-form-item>
        <el-form-item label="抽奖类型" prop="type" style="width:400px;">
          <el-radio-group v-model="ruleForm.type" placeholder="请选择抽奖类型">
            <el-radio :label="1">大转盘</el-radio>
            <el-radio :label="2">九宫格</el-radio>
            <el-radio :label="3">老虎机</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="goStep(2)">下一步</el-button>
        </el-form-item>
      </div>
      <div v-else-if="step === 2">
        <p>选择奖品类型后，可以直接选择相应的奖品；通过选择奖品类型，可以重新选择奖品；点击奖品图片可以上传奖品展示的图片，部分类型可不上传图片；</p>
        <p>请不要在抽奖开始后对数据进行修改，除非你能确定没有用户参与过，修改请自行填写剩余数量</p>
        <p>奖品数量设置为-1时，即代表该奖品不受数量限制，如“谢谢参与”</p>
        <p>中奖奖品剩余数量为0时，取排序最大的奖品</p>
        <p>中奖概率计算公式：中奖概率/所有中奖概率之和</p>
        <p>九宫格请上传8件商品</p>
        <p>老虎机概率无效，为随机的系统产生，无需“谢谢参与”</p>
        <el-table
          v-loading="listLoading"
          ref="multipleTable"
          :data="ruleForm.integral_prize"
          border
          fit
          highlight-current-row
          style="width: 100%;">
          <el-table-column label="奖品类型" prop="name" width="200">
            <template slot-scope="scope">
              <el-form :model="scope.row">
                <el-form-item>
                  <el-select v-model="scope.row.model_type" placeholder="请选择" clearable @change="e=>handleModelType(e, scope.$index)">
                    <el-option
                      v-for="item in modelType"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"/>
                  </el-select>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="奖品名称" prop="name" width="200">
            <template slot-scope="scope">
              <el-form :model="scope.row">
                <el-form-item
                  :rules="[
                    { required: true, message: '请输入奖品名称', trigger: 'blur' }
                  ]"
                  prop="name">
                  <el-input
                    v-model="scope.row.name"
                    maxlength="30"
                    placeholder="请输入奖品名称"
                    clearable/>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="奖品图片" prop="img" width="200">
            <template slot-scope="scope">
              <el-form :model="scope.row">
                <el-form-item>
                  <avatar-image :file="scope.row.img" :width="60" :height="60" @getFile="e=>getFile(e,scope.$index)"/>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="奖品价值" prop="value" width="200">
            <template slot-scope="scope">
              <el-form :model="scope.row">
                <el-form-item
                  :rules="[
                    { required: true, message: '请填写奖品价值', trigger: 'blur' }
                  ]"
                  prop="value">
                  <el-input
                    v-model="scope.row.value"
                    maxlength="11"
                    placeholder="请输入奖品价值"
                    clearable/>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="回收价值" prop="recycle" width="180">
            <template slot-scope="scope">
              <el-form :model="scope.row">
                <el-form-item>
                  <el-input v-model.number="scope.row.recycle" type="number" maxlength="11" placeholder="请输入回收价值" clearable/>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="奖品数量" prop="quantity" width="180">
            <template slot-scope="scope">
              <el-form :model="scope.row">
                <el-form-item
                  :rules="[
                    { required: true, message: '请填写奖品数量', trigger: 'blur' }
                  ]"
                  prop="quantity">
                  <el-input
                    v-model.number="scope.row.quantity"
                    type="number"
                    maxlength="11"
                    placeholder="请输入奖品数量"
                    clearable/>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column v-if="id" label="剩余数量" prop="residue" width="180">
            <template slot-scope="scope">
              <el-form :model="scope.row">
                <el-form-item
                  :rules="[
                    { required: true, message: '请填写剩余数量', trigger: 'blur' }
                  ]"
                  prop="residue">
                  <el-input
                    v-model.number="scope.row.residue"
                    type="number"
                    maxlength="11"
                    placeholder="请输入剩余数量"
                    clearable/>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="中奖概率" prop="probability" width="180">
            <template slot-scope="scope">
              <el-form :model="scope.row">
                <el-form-item
                  :rules="[
                    { required: true, message: '请填写中奖概率', trigger: 'blur' }
                  ]"
                  prop="probability">
                  <el-input
                    v-model.number="scope.row.probability"
                    type="number"
                    maxlength="11"
                    placeholder="请设置中奖概率"
                    clearable/>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="排序" prop="sort" width="180">
            <template slot-scope="scope">
              <el-form :model="scope.row">
                <el-form-item>
                  <el-input v-model.number="scope.row.sort" type="number" maxlength="11" placeholder="请设置排序" clearable/>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="操作" class-name="small-padding fixed-width" width="80" fixed="right">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                <el-button :loading="formLoading" type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.$index)"/>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-button style="margin-top: 10px;" @click="addIntegralPrize">添加</el-button>
        <el-form-item>
          <el-button @click="step = 1">上一步</el-button>
          <el-button type="primary" @click="goStep(3)">下一步</el-button>
        </el-form-item>
      </div>
      <div v-else>
        <el-form-item label="所需积分" prop="integral" style="width:300px;">
          <el-input v-model.number="ruleForm.integral" placeholder="多少积分抽奖一次" type="number" maxlength="11" clearable/>
        </el-form-item>
        <el-form-item label="限制次数" prop="tries" style="width:300px;">
          <el-input v-model.number="ruleForm.tries" placeholder="限制次数" type="number" maxlength="11" clearable/>
          <p>限制每天可抽奖次数，0为不限制</p>
        </el-form-item>
        <el-form-item label="活动说明" prop="explain" style="width:400px;">
          <el-input :rows="2" v-model="ruleForm.explain" placeholder="活动说明" type="textarea" clearable/>
        </el-form-item>
        <el-form-item label="有效时间" prop="time">
          <el-date-picker
            v-model="ruleForm.time"
            :picker-options="pickerOptions"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"/>
        </el-form-item>
        <el-form-item>
          <el-button @click="step = 2">上一步</el-button>
          <el-button :loading="formLoading" type="primary" @click="dialogStatus==='create'?create():edit()">提交</el-button>
        </el-form-item>
      </div>
    </el-form>
    <!--添加-->
    <el-dialog :title="textMap[dialogStatus]" :close-on-click-modal="false" :visible.sync="dialogFormVisible">
      <p>可选择的商品包含隐藏的商品</p>
      <el-form :inline="true">
        <el-form-item label="关键字">
          <el-input v-model="listQuery.title" placeholder="名称" clearable @input="handleFilter" />
        </el-form-item>
      </el-form>
      <!-- 商品 -->
      <el-table
        v-loading="goodLoading"
        v-if="model_type === 'App\\Models\\v1\\GoodSku'"
        :data="goodList"
        border
        style="width: 100%">
        <el-table-column label="图片" width="120">
          <template slot-scope="scope">
            <el-image v-if="scope.row.resources" :src="scope.row.resources.img | smallImage(150)" :preview-src-list="[ scope.row.resources.img ]" style="width:80px;height:80px;"/>
            <el-image v-else :src="scope.row.good.resources.img | smallImage(150)" :preview-src-list="[ scope.row.good.resources.img ]" style="width:80px;height:80px;"/>
          </template>
        </el-table-column>
        <el-table-column label="商品">
          <template slot-scope="scope">
            <div class="drawing">
              <div class="right">
                <div>{{ scope.row.good.name }}</div>
                <div>¥ {{ scope.row.price | 1000 }}</div>
                <div><span v-for="(item,index) in scope.row.product_sku" :key="index" style="padding-right: 10px;">{{ item.key }}:{{ item.value }}</span></div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="库存" width="100">
          <template slot-scope="scope">
            {{ scope.row.inventory }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="handleGood(scope.row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-loading="goodLoading"
        v-else-if="model_type === 'App\\Models\\v1\\IntegralConfiguration'"
        :data="goodList"
        border
        style="width: 100%">
        <el-table-column label="配置名称" width="120">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="配置值" width="100">
          <template slot-scope="scope">
            {{ scope.row.value }}
          </template>
        </el-table-column>
        <el-table-column label="配置说明">
          <template slot-scope="scope">
            {{ scope.row.explain }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="handleIntegral(scope.row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-operation">
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" class="pagination" @pagination="getGood"/>
      </div>
    </el-dialog>
  </div>
</template>
<style lang='scss' scoped>
  .step{
    margin-bottom: 50px;
  }
  .ruleForm{
    margin: 0 auto;
  }
</style>
<script>
import js from '../js/detail'
export default js
</script>
