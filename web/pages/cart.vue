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

<script>
import {synchronizationInventory, addShoppingCart} from '@/api/goodIndent'
export default {
  layout: 'cart',
  head () {
    return {
      title: '我的购物车' + '-' + process.env.APP_NAME,
    }
  },
  data() {
    return {
      loading: true,
      cartList: [],
      cartOriginalList: [],
      invalidGood: [],
      total: 0,
      allChecked: true,
      empty: true,
      multipleSelection: []
    }
  },
  mounted() {
    $nuxt.$store.commit('setCartTitle', '我的购物车');
    if($nuxt.$store.state.hasLogin){
      this.getList()
    }
  },
  methods: {
    async getList(){
      this.loading = true;
      this.cartList = []
      this.invalidGood = []
      await synchronizationInventory().then(response => {
        this.cartList = Object.values(response)
        this.store.set(process.env.CACHE_PR + 'CartList',response)
        this.cartOriginalList = response
        if(this.cartList.length>0){

          this.empty = false
        }else{
          this.empty = true
        }
        for(let k in this.cartList){
          if(this.cartList[k].good_sku){
            this.cartList[k].good_sku.skus.forEach(item=>{
              if(this.cartList[k].specification){
                this.cartList[k].specification+= item.v + ';'
              }else{
                this.cartList[k].specification = item.v + ';'
              }
            })
            this.cartList[k].specification = this.cartList[k].specification.substr(0,this.cartList[k].specification.length-1)
          }
          if(this.cartList[k].good.is_delete === 1 || this.cartList[k].good.is_show !== 1){
            this.cartList[k].invalid = true
          }
          if(this.cartList[k].invalid === true){ //失效的商品
            this.invalidGood.push(this.cartList[k])
          }
        }
        for(let k in this.cartList){
          if(this.cartList[k].invalid === true){ //失效的商品
            this.cartList.splice(k,1)
          }
        }
        this.$nextTick(()=>{
          if(this.empty === false){
            this.handleCheckAllChange()
          }
        })
        this.loading = false;
      }).catch(() => {
        this.loading = false
      })

    },
    calcTotal(){
      let list = this.multipleSelection;
      let total = 0;
      list.forEach(item=>{
        total += item.price * item.number;
      })
      this.total = Number(total.toFixed(2));
    },
    handleSelectionChange(val){
      this.multipleSelection = val
      this.calcTotal();
    },
    handleCheckAllChange() {
      this.$refs.table.toggleAllSelection()
      this.calcTotal();
    },
    //创建订单
    createOrder(){
      if(this.multipleSelection.length <=0){
        this.$message({
          message: '请选择商品',
          type: 'error'
        });
      }else{
        this.store.set(process.env.CACHE_PR + 'OrderList',this.multipleSelection)
        $nuxt.$router.push('/indent/create');
      }
    },
    //修改数量
    numberChange(index){
      if(this.cartList[index].good_sku_id){
        this.cartOriginalList[this.cartList[index].good_sku_id].number =  this.cartList[index].number
      }else{
        this.cartOriginalList['good_'+this.cartList[index].good_id].number =  this.cartList[index].number
      }
      this.store.set(process.env.CACHE_PR + 'CartList',this.cartOriginalList)
      addShoppingCart(this.cartOriginalList)
      this.calcTotal();
    },
    //删除失效的商品
    deleteInvalidGood(index){
      this.$confirm('是否移除该商品？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if(this.invalidGood[index].good_sku_id){
          delete this.cartOriginalList[this.invalidGood[index].good_sku_id]
        }else{
          delete this.cartOriginalList['good_'+this.invalidGood[index].good_id]
        }
        if(Object.values(this.cartOriginalList).length > 0){
          this.store.set(process.env.CACHE_PR + 'CartList',this.cartOriginalList)
        }else{
          this.store.remove(process.env.CACHE_PR + 'CartList')
        }
        addShoppingCart(this.cartOriginalList)
        this.invalidGood.splice(index, 1);
        this.getList();
      }).catch(() => {
      })
    },
    //删除
    deleteCartItem(index){
      this.$confirm('是否移除该商品？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if(this.cartList[index].good_sku_id){
          delete this.cartOriginalList[this.cartList[index].good_sku_id]
        }else{
          delete this.cartOriginalList['good_'+this.cartList[index].good_id]
        }
        if(Object.values(this.cartOriginalList).length > 0){
          this.store.set(process.env.CACHE_PR + 'CartList',this.cartOriginalList)
        }else{
          this.store.remove(process.env.CACHE_PR + 'CartList')
        }
        addShoppingCart(this.cartOriginalList)
        this.cartList.splice(index, 1);
        this.getList();
      }).catch(() => {
      })
    },
    //删除选中的商品
    clearCart(){
      this.$confirm('是否移除所选商品？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.multipleSelection.forEach(item=>{
          this.cartList.forEach((item2,index)=>{
            if(item.good_sku_id){
              if(item.good_sku_id === item2.good_sku_id){
                delete this.cartOriginalList[item2.good_sku_id]
                this.cartList.splice(index, 1);
              }
            }else{
              if(item.good_id === item2.good_id){
                delete this.cartOriginalList['good_'+item2.good_id]
                this.cartList.splice(index, 1);
              }
            }
          })
        })
        if(Object.values(this.cartOriginalList).length > 0){
          this.store.set(process.env.CACHE_PR + 'CartList',this.cartOriginalList)
        }else{
          this.store.remove(process.env.CACHE_PR + 'CartList')
        }
        addShoppingCart(this.cartOriginalList)
      }).catch(() => {
      })
    },
  }
}
</script>
<style lang='scss' scoped>
  .invalid-title{
    padding: 20px 0 20px 0;
    font-size: 26px;
    color: #cccccc;
    text-align: center;
  }
  .invalidTable{
    margin-top:20px;
  }
  .cart-list{
    padding:30px 0 30px 0;
    .specification{
      color: #999999;
    }
  }
  .cart-operation{
    margin-top:20px;
    background-color: #ffffff;
    display: flex;
    line-height: 40px;
    font-size: 12px;
    .left{
      flex:1;
      padding-left: 20px;
      color: #757575;
      .delete{
        cursor:pointer;
      }
      .delete:hover{
        color: #fa524c;
      }
      .number{
        color: #fa524c;
      }
    }
    .right{
      width: 400px;
      justify-content: flex-end;
      display: flex;
      .total{
        margin-right: 30px;
        color: #fa524c;
        span{
          font-size: 28px;
        }
      }
      .settlement{
        width: 150px;
      }
    }
  }
  .cart{
    margin-top:100px;
    margin-bottom: 100px;
    display: flex;
    position: relative;
    .empty-cart{
      img{
        width: 500px;
      }
    }
    .instructions{
      margin: 160px 0 0 50px;
      .title{
        font-size: 35px;
        color: #b0b0b0;
        line-height: 55px;
        font-weight: bold;
      }
      .login{
        font-size: 18px;
        line-height: 45px;
        color: #b0b0b0;
      }
      .operation{
        margin-top: 20px;
      }
    }
  }
</style>
