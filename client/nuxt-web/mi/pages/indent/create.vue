<template>
  <div class="box">
    <el-card class="container indent-create" shadow="always">
      <div class="address-box">
        <template v-if="isAddress">
          <div class="title">收货地址</div>
          <address-list class="address-box-list" :select="true" @selectedAddress="selectedAddress"/>
        </template>
        <div class="title">确认订单信息</div>
        <el-table
          :data="ruleForm.indentCommodity"
          ref="table"
          class="table">
          <el-table-column
            align="center"
            width="100">
            <template slot-scope="scope">
              <NuxtLink :to="{ path: `/product/detail/${scope.row.good_id}`}">
                <el-image
                  class="image"
                  :src="scope.row.img | smallImage(80)"
                  fit="cover"/>
              </NuxtLink>
            </template>
          </el-table-column>
          <el-table-column
            label="商品名称">
            <template slot-scope="scope">
              <NuxtLink :to="{ path: `/product/detail/${scope.row.good_id}`}">
                <div class="tag-box" v-if="isSeckill"><div class="seckill-tag">限时秒杀</div></div>
                <p>{{scope.row.name}}</p>
                <p class="specification">{{scope.row.specification}}</p>
              </NuxtLink>
            </template>
          </el-table-column>
          <el-table-column
            label="类型"
            width="120">
            <template slot-scope="scope">
              {{ scope.row.good.type }}
            </template>
          </el-table-column>
          <el-table-column
            label="单价"
            width="150"
            align="center">
            <template slot-scope="scope">
              {{scope.row.price| thousands}}
            </template>
          </el-table-column>
          <el-table-column
            label="数量"
            width="150"
            align="center">
            <template slot-scope="scope">
              {{scope.row.number}}
            </template>
          </el-table-column>
          <el-table-column
            label="小计"
            width="150"
            align="center">
            <template slot-scope="scope">
              {{(scope.row.price * scope.row.number) | thousands}}
            </template>
          </el-table-column>
        </el-table>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="remark">
          <el-form-item prop="remark">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入备注信息"
              v-model="ruleForm.remark"
              maxlength="200"
              show-word-limit>
            </el-input>
          </el-form-item>
        </el-form>
        <coupon v-if="!ruleForm.integral_draw_log_id && verify.coupon && !isSeckill" :money="total" @select="calcTotal"></coupon>
        <div class="count-detail">
          <div class="bill-item">
            <div class="bill-name">商品件数：</div>
            <div class="bill-money">{{ruleForm.indentCommodity.length}}件</div>
          </div>
          <div class="bill-item">
            <div class="bill-name">商品总价：</div>
            <div class="bill-money">{{total | thousands}}元</div>
          </div>
          <div class="bill-item" v-if="!ruleForm.integral_draw_log_id && !isSeckill">
            <div class="bill-name">优惠金额：</div>
            <div class="bill-money">-{{couponMoney | thousands}}元</div>
          </div>
          <div class="bill-item" v-if="!ruleForm.integral_draw_log_id && !isSeckill">
            <div class="bill-name">运费：</div>
            <div class="bill-money">{{ruleForm.carriage | thousands}}元</div>
          </div>
          <div class="bill-item" v-if="integral.deductible && integral.available && !isSeckill">
            <div class="bill-name">
              <el-popover
                placement="top-start"
                width="200"
                trigger="hover"
                :content="`你有个${integral.available}，可用${integral.deductible}个`">
                <i slot="reference" class="integrall-popover el-icon-warning-outline"></i>
              </el-popover>
              使用<el-input-number class="input-number" v-model="ruleForm.integral" controls-position="right" @change="numberIntegral" :min="0" :max="integral.deductible > integral.available ? integral.available : integral.deductible"></el-input-number>积分抵扣{{ integralPrice }}元：</div>
            <div class="bill-money">-{{ integralPrice }}元</div>
          </div>
          <div></div>
          <div class="bill-item" style="margin-top:10px;">
            <div class="bill-name">
              <div class="name">应付总额：</div>
              <div class="price" v-if="ruleForm.integral_draw_log_id">0.00</div>
              <div class="price" v-else-if="isSeckill">{{ (ruleForm.carriage+total) | thousands }}</div>
              <div class="price" v-else>{{(((ruleForm.carriage+total-couponMoney)*100-integralPrice*100)/100) | thousands}}</div>
              <div class="unit">元</div>
            </div>
          </div>
        </div>
        <el-divider></el-divider>
        <div class="operation">
          <el-button v-if="!ruleForm.integral_draw_log_id" plain @click="go" :loading="buttonLoading">返回</el-button>
          <el-button type="danger" @click="submit" :loading="buttonLoading">去结算</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style lang='scss' scoped>
  @import "./scss/create";
</style>

<script>
import js from './js/create'
export default js
</script>
