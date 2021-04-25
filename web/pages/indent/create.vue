<template>
  <div class="box">
    <el-card class="container indent-create" shadow="always">
      <div class="address-box">
        <div class="title">收货地址</div>
        <address-list class="address-box-list" :select="true" @selectedAddress="selectedAddress"/>
        <div class="title">确认订单信息</div>
        <el-table
          :data="ruleForm.indentCommodity"
          ref="table"
          class="table">
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
              {{scope.row.good_sku.inventory}}
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
        <div class="count-detail">
          <div class="bill-item">
            <div class="bill-name">商品件数：</div>
            <div class="bill-money">{{ruleForm.indentCommodity.length}}件</div>
          </div>
          <div class="bill-item">
            <div class="bill-name">商品总价：</div>
            <div class="bill-money">{{total | thousands}}元</div>
          </div>
          <div class="bill-item">
            <div class="bill-name">运费：</div>
            <div class="bill-money">{{ruleForm.carriage | thousands}}元</div>
          </div>
          <div class="bill-item" style="margin-top:10px;">
            <div class="bill-name">
              <div class="name">应付总额：</div>
              <div class="price">{{(ruleForm.carriage+total) | thousands}}</div>
              <div class="unit">元</div>
            </div>
          </div>
        </div>
        <el-divider></el-divider>
        <div class="operation">
          <el-button plain @click="go" :loading="buttonLoading">返回购物车</el-button>
          <el-button type="danger" @click="submit" :loading="buttonLoading">去结算</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import addressList from '@/components/Address/list'
import { freight } from '@/api/shipping'
import { create, addShoppingCart } from '@/api/goodIndent'
export default {
  components: {
    addressList
  },
  layout: 'cart',
  middleware: 'auth',
  head () {
    return {
      title: '确认订单' + '-' + process.env.APP_NAME,
    }
  },
  data() {
    const validateRemark = (rule, value, callback) => {
      const flag = new RegExp("[`~!@#$^&*()=|{}':'\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘：”“'。？ ]");
      if(flag.test(value)){
        return callback(new Error('不允许输入非法字符'));
      }else{
        callback();
      }
    };
    return {
      loading: true,
      buttonLoading: false,
      total: 0,
      ruleForm: {
        indentCommodity: [],
        address: {},
        remark: '',
        carriage: 0
      },
      rules: {
        remark: [
          { validator: validateRemark, trigger: 'blur' }
        ],
      }
    }
  },
  mounted() {
    $nuxt.$store.commit('setCartTitle', '确认订单');
    this.getList()
  },
  methods: {
    async getList(){
      let specification = null
      this.ruleForm.indentCommodity = Object.values(this.store.get(process.env.CACHE_PR + 'OrderList'))
      this.ruleForm.indentCommodity.forEach(item=>{
        this.total+= item.price * item.number
        if(item.good_sku){
          specification = null;
          item.good_sku.product_sku.forEach(item2 => {
            if (specification) {
              specification += item2.value + ';';
            } else {
              specification = item2.value + ';';
            }
          });
          item.specification = specification.substr(0, specification.length - 1);
        }
      })
    },
    // 选择的地址
    selectedAddress(res){
      this.ruleForm.address = res
      freight(res.id, this.ruleForm.indentCommodity).then(response => {
        this.ruleForm.carriage = response.carriage
      })
    },
    // 提交订单
    submit(){
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if(!this.ruleForm.address){
            this.$message({
              message: '请选择地址',
              type: 'error'
            });
            return false
          }
          this.buttonLoading = true;
          create(this.ruleForm).then(response => {
            this.buttonLoading = false;
            this.store.remove(process.env.CACHE_PR + 'CartList')
            this.store.remove(process.env.CACHE_PR + 'OrderList')
            addShoppingCart([])
            $nuxt.$router.replace({path: '/money/pay', query:{id: response}})
          }).catch(() => {
            this.buttonLoading = false
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    go(){
      $nuxt.$router.go(-1)
    }
  }
}
</script>
<style lang='scss' scoped>
  .remark{
    margin-top:30px;
  }
  .specification{
    color: #999999;
  }
  .indent-create{
    margin-top:40px;
    margin-bottom: 40px;
    .address-box{
      .title{
        color: #333;
        font-size: 18px;
        margin-bottom: 20px;
      }
      .address-box-list{
        margin-bottom: 20px;
      }
      .count-detail{
        margin-top:50px;
        text-align: right;
        .bill-item{
          display: flex;
          justify-content:flex-end;
          line-height: 35px;
          color: #757575;
          font-size: 14px;
          .bill-money{
            width: 80px;
            color: #fa524c;
          }
          .bill-name{
            display: flex;
            .price{
              color: #fa524c;
              font-size: 30px;
              position: relative;
              top:-5px;
              margin-right: 5px;
              margin-left: 5px;
            }
            .unit{
              color: #fa524c;
            }
          }
        }
      }
    }
    .operation{
      display: flex;
      justify-content:flex-end;
    }
  }
</style>
