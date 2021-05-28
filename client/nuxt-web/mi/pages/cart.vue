<template>
  <div class="box">
    <template v-if="empty">
      <div class="cart container">
        <div class="empty-cart">
          <img :src="require('assets/img/empty-cart.png')"/>
        </div>
          <div class="instructions">
            <div class="title">您的购物车还是空的！</div>
            <div class="login" v-if="!$store.state.hasLogin">登录后将显示您之前加入的商品</div>
            <div class="operation">
              <template v-if="$store.state.hasLogin">
                <NuxtLink class="li" to="/category/list"><el-button type="danger">马上去购物</el-button></NuxtLink>
              </template>
              <template v-else>
                <NuxtLink class="li" to="/pass/login"><el-button type="danger">立即登录</el-button></NuxtLink>
                <NuxtLink class="li" to="/category/list"><el-button type="danger" plain>马上去购物</el-button></NuxtLink>
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
              <NuxtLink :to="{ path: '/product/detail', query: { id: scope.row.good_id }}">
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
              <NuxtLink :to="{ path: '/product/detail', query: { id: scope.row.good_id }}">
                <p>{{scope.row.name}}</p>
                <p class="specification">{{scope.row.specification}}</p>
              </NuxtLink>
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
              <el-input-number @change="numberChange(scope.$index)" size="mini" v-model="scope.row.number" :min="1" :max="scope.row.good_sku.inventory"></el-input-number>
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
          <el-table-column
            label="操作"
            width="80"
            align="center">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="移除商品" placement="top-start">
                <el-button @click.stop="deleteCartItem(scope.$index)" size="mini" type="danger" icon="el-icon-delete" circle></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <div class="cart-operation">
          <div class="left">
            <el-button @click="handleCheckAllChange" size="mini" type="danger" plain>全选/全不选</el-button>
            <el-divider direction="vertical"></el-divider>
            <span class="delete" @click="clearCart">删除</span>
            <el-divider direction="vertical"></el-divider>
            <span>共 <span class="number">{{cartList.length}}</span> 件商品，已选择 <span class="number">{{multipleSelection.length}}</span>件</span>
          </div>
          <div class="right">
            <div class="total">合计：<span>{{total}}</span>元</div>
            <el-button class="settlement" type="danger" :disabled="total<=0" @click="createOrder">去结算</el-button>
          </div>
        </div>
        <!-- 失效的商品-->
        <template v-if="invalidGood.length">
          <h3 class="invalid-title">已失效的商品</h3>
          <el-table
            :data="invalidGood"
            ref="invalidTable"
            class="invalidTable">
            <el-table-column
              align="center"
              width="100">
              <template slot-scope="scope">
                <NuxtLink :to="{ path: '/product/detail', query: { id: scope.row.good_id }}">
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
                <NuxtLink :to="{ path: '/product/detail', query: { id: scope.row.good_id }}">
                  <p>{{scope.row.name}}</p>
                  <p class="specification">{{scope.row.specification}}</p>
                </NuxtLink>
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
            <el-table-column
              label="操作"
              width="80"
              align="center">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="移除商品" placement="top-start">
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
