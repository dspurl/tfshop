<template>
  <div v-loading="loading" class="createPost-container" style="padding-top: 40px">
    <el-steps :active="active" align-center finish-status="success" style="margin-bottom: 20px;">
      <el-step title="选择秒杀商品"/>
      <el-step title="填写基础信息"/>
    </el-steps>
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="120px" class="ruleForm" style="padding-left: 200px;padding-right:20px;">
      <div v-if="active === 0">
        <el-form-item label="选择商品" prop="good_id" style="width:400px;">
          <el-image
            v-if="ruleForm.img"
            :src="ruleForm.img"
            style="width: 100px; height: 100px;cursor:pointer;"
            fit="scale-down"
            @click="add"/>
          <el-button v-else class="button" @click="add">选择</el-button>
        </el-form-item>
        <save-dialog
          v-if="dialog.save"
          ref="saveDialog"
          @success="handleSuccess"
          @closed="dialog.save = false"/>
        <el-form-item>
          <el-button type="primary" @click="nextStep">下一步</el-button>
        </el-form-item>
      </div>
      <div v-else-if="active === 1">
        <el-form-item label="主图" prop="img">
          <el-upload
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :on-progress="handleProgress"
            :action="actionurl"
            :headers="imgHeaders"
            :data="imgMasterData"
            class="avatar-uploader">
            <span v-if="imgProgress">
              <el-progress :percentage="imgProgressPercent" type="circle" class="progress-img"/>
            </span>
            <span v-else>
              <el-image
                v-if="ruleForm.img"
                :src="ruleForm.img"
                fit="scale-down"
                class="avatar"/>
              <i v-else class="el-icon-plus avatar-uploader-icon"/>
            </span>
          </el-upload>
          <div class="el-upload__tip">每张不能大于2M</div>
        </el-form-item>
        <el-form-item label="图片列表" prop="resource">
          <el-upload
            :limit="5"
            :action="actionurl"
            :headers="imgHeaders"
            :on-success="handleAvatarSuccessList"
            :on-remove="handleRemove"
            :before-upload="beforeAvatarUploadList"
            :data="imgData"
            :file-list="ruleForm.imgList"
            multiple
            list-type="picture-card">
            <i slot="default" class="el-icon-plus"/>
          </el-upload>
          <div class="el-upload__tip">最多可上传5张，每张不能大于2M</div>
        </el-form-item>
        <el-form-item label="商品名称" prop="name" style="width:400px;">
          <el-input v-model="ruleForm.name" maxlength="60" placeholder="请输入商品名称" clearable/>
        </el-form-item>
        <el-form-item label="秒杀活动简介" prop="abstract" style="width:400px;">
          <el-input v-model="ruleForm.abstract" :rows="2" type="textarea" maxlength="160" placeholder="请输入简介" clearable/>
        </el-form-item>
        <el-form-item label="活动时间" prop="times">
          <el-date-picker
            v-model="ruleForm.times"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH"/>
          <p>活动开始时间请设置以下时间段：0点、2点、4点、6点、8点、10点、12点、14点、16点、18点、20点、22点</p>
          <p>活动结束请自行设置，一般推荐设置为开始时间后2个小时</p>
        </el-form-item>
        <el-form-item label="减库存方式" prop="is_inventory" style="width:400px;">
          <el-radio-group v-model="ruleForm.is_inventory" placeholder="请选择减库存方式">
            <el-radio :label="0">拍下减库存</el-radio>
            <el-radio :label="1">付款减库存</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否限制购买数" prop="is_purchase_number" style="width:400px;">
          <el-radio-group v-model="ruleForm.is_purchase_number" placeholder="请选择">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="ruleForm.is_purchase_number === 1" label="购买数量" prop="is_purchase_number" style="width:400px;">
          <el-input v-model="ruleForm.purchase_number" maxlength="11" placeholder="请输入购买数量" clearable/>
          <p>限制每次可购买数量</p>
        </el-form-item>
        <el-form-item label="是否上架" prop="is_show" style="width:400px;">
          <el-radio-group v-model="ruleForm.is_show" placeholder="请选择是否上架">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="产品参数">
          <el-table
            ref="multipleTable"
            :key="tableKey"
            :data="ruleForm.seckill_sku"
            height="400"
            row-key="id"
            border
            fit
            highlight-current-row
            style="width: 100%;"
            @selection-change="handleSelectionChange">
            <el-table-column
              :reserve-selection="true"
              type="selection"
              width="55"
              fixed="left"/>
            <el-table-column
              v-for="(item, index) in ruleForm.seckill_sku[0].product_sku"
              :key="index"
              :label="item.key"
              align="center">
              <template slot-scope="scope">
                {{ scope.row.product_sku[index].value }}
              </template>
            </el-table-column>
            <el-table-column label="图片" width="120">
              <template slot-scope="scope">
                <avatar-image :file="scope.row.img" :width="60" :height="60" @getFile="e=>getFile(e,scope.$index)"/>
              </template>
            </el-table-column>
            <el-table-column label="秒杀价" width="100">
              <template slot-scope="scope">
                <el-input v-model="scope.row.seckill_price" clearable/>
              </template>
            </el-table-column>
            <el-table-column label="成本价" width="100">
              <template slot-scope="scope">
                <span>{{ scope.row.cost_price }}</span>
              </template>
            </el-table-column>
            <el-table-column label="原价" width="100">
              <template slot-scope="scope">
                <span>{{ scope.row.price }}</span>
              </template>
            </el-table-column>
            <el-table-column label="库存" width="100">
              <template slot-scope="scope">
                <span>{{ scope.row.inventory }}</span>
              </template>
            </el-table-column>
            <el-table-column label="限量" width="100">
              <template slot-scope="scope">
                <el-input v-model="scope.row.limit" clearable/>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="详情" prop="details">
          <tinymce
            ref="editor"
            v-model="ruleForm.details"
            :url="actionurl"
            :header="imgHeaders"/>
        </el-form-item>
        <el-form-item>
          <el-button :disabled="!!id" @click="active = 0">上一步</el-button>
          <el-button :loading="formLoading" type="primary" @click="dialogStatus==='create'?create():edit()">提交</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script>
import js from '../js/detail'
export default js
</script>
