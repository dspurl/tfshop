<template>
  <div class="box">
    <el-card class="container indent-create" shadow="always">
      <div class="address-box">
        <template v-if="isAddress">
          <div class="title">{{$t('indent.shipping_address')}}</div>
          <address-list class="address-box-list" :select="true" @selectedAddress="selectedAddress"/>
        </template>
        <div class="title">{{$t('indent.confirm_order_information')}}</div>
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
            :label="$t('indent.name')">
            <template slot-scope="scope">
              <NuxtLink :to="{ path: `/product/detail/${scope.row.good_id}`}">
                <p>{{scope.row.name}}</p>
                <p class="specification">{{scope.row.specification}}</p>
              </NuxtLink>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('indent.type')"
            width="120">
            <template slot-scope="scope">
              {{ scope.row.good.type }}
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('indent.price')"
            width="150"
            align="center">
            <template slot-scope="scope">
              {{scope.row.price| thousands}}
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('indent.number')"
            width="150"
            align="center">
            <template slot-scope="scope">
              {{scope.row.number}}
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('indent.subtotal')"
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
              :placeholder="$t('hint.error.import', {attribute: $t('indent.remark')})"
              v-model="ruleForm.remark"
              maxlength="200"
              show-word-limit>
            </el-input>
          </el-form-item>
        </el-form>
        <div class="count-detail">
          <div class="bill-item">
            <div class="bill-name">{{$t('indent.number_of_items')}}：</div>
            <div class="bill-money">{{ruleForm.indentCommodity.length}}{{$t('good_indent.piece')}}</div>
          </div>
          <div class="bill-item">
            <div class="bill-name">{{$t('indent.total')}}：</div>
            <div class="bill-money">{{total | thousands}}{{$t('common.monetary_unit')}}</div>
          </div>
          <div class="bill-item">
            <div class="bill-name">{{$t('indent.freight')}}：</div>
            <div class="bill-money">{{ruleForm.carriage | thousands}}{{$t('common.monetary_unit')}}</div>
          </div>
          <div></div>
          <div class="bill-item" style="margin-top:10px;">
            <div class="bill-name">
              <div class="name">{{$t('indent.payroll')}}：</div>
              <div class="price">{{(((ruleForm.carriage+total)*100)/100) | thousands}}</div>
              <div class="unit">{{$t('common.monetary_unit')}}</div>
            </div>
          </div>
        </div>
        <el-divider></el-divider>
        <div class="operation">
          <el-button plain @click="go" :loading="buttonLoading">{{$t('indent.back')}}</el-button>
          <el-button type="danger" @click="submit" :loading="buttonLoading">{{$t('cart.settle')}}</el-button>
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
