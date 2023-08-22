<template>
  <div class="box">
    <template v-if="empty">
      <div class="cart container">
        <div class="empty-cart">
          <img :src="require('assets/img/empty-cart.png')"/>
        </div>
          <div class="instructions">
            <div class="title">{{$t('cart.empty')}}</div>
            <div class="login" v-if="!$store.state.hasLogin">{{$t('money.success.after_login')}}</div>
            <div class="operation">
              <template v-if="$store.state.hasLogin">
                <NuxtLink class="li" to="/category/list"><el-button type="danger">{{$t('cart.go_shopping')}}</el-button></NuxtLink>
              </template>
              <template v-else>
                <NuxtLink class="li" to="/pass/login"><el-button type="danger">{{$t('cart.login')}}</el-button></NuxtLink>
                <NuxtLink class="li" to="/category/list"><el-button type="danger" plain>{{$t('cart.go_shopping')}}</el-button></NuxtLink>
              </template>
            </div>
          </div>
      </div>
    </template>
    <template v-else>
      <!-- 购物车列表-->
      <div class="cart-list container" v-loading="loading">
        <el-table
          :data="cartList"
          @selection-change="handleSelectionChange"
          ref="table"
          class="table">
          <el-table-column
            type="selection"
            width="55"
            align="center">
          </el-table-column>
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
              <el-input-number @change="numberChange(scope.$index)" size="mini" v-model="scope.row.number" :min="1" :max="scope.row.good_sku ? scope.row.good_sku.inventory : scope.row.inventory"></el-input-number>
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
          <el-table-column
            :label="$t('common.operation')"
            width="100"
            align="center">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="$t('cart.remove_goods')" placement="top-start">
                <el-button @click.stop="deleteCartItem(scope.$index)" size="mini" type="danger" icon="el-icon-delete" circle></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <div class="cart-operation">
          <div class="left">
            <el-button @click="handleCheckAllChange" size="mini" type="danger" plain>{{$t('notice.select_reverse')}}</el-button>
            <el-divider direction="vertical"></el-divider>
            <span class="delete" @click="clearCart">{{$t('common.delete')}}</span>
            <el-divider direction="vertical"></el-divider>
            <span>{{$t('cart.common')}} <span class="number">{{cartList.length}}</span> {{$t('cart.pieces_goods')}}，{{$t('common.selected')}} <span class="number">{{multipleSelection.length}}</span>{{$t('good_indent.piece')}}</span>
          </div>
          <div class="right">
            <div class="total">{{$t('cart.total')}}：<span>{{total}}</span>{{$t('common.monetary_unit')}}</div>
            <el-button class="settlement" type="danger" :disabled="total<=0" @click="createOrder">{{$t('cart.settle')}}</el-button>
          </div>
        </div>
        <!-- 失效的商品-->
        <template v-if="invalidGood.length">
          <h3 class="invalid-title">{{$t('cart.invalid_commodity')}}</h3>
          <el-table
            :data="invalidGood"
            ref="invalidTable"
            class="invalidTable">
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
            <el-table-column
              :label="$t('common.operation')"
              width="80"
              align="center">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" :content="$t('cart.remove_goods')" placement="top-start">
                  <el-button @click="deleteInvalidGood(scope.$index)" size="mini" type="danger" icon="el-icon-delete" circle></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <!-- 失效的商品 end-->
        </template>
      </div>
      <!-- 购物车列表 end-->
    </template>
  </div>
</template>

<style lang='scss' scoped>
  @import "./cart/scss/index";
</style>

<script>
import js from './cart/js/index'
export default js
</script>
