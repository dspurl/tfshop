<template>
  <div class="box">
    <el-page-header @back="goBack" content="订单详情">
    </el-page-header>
    <div v-loading="loading">
      <div class="top">
        <div class="order-number">订单号：{{indent.identification}}</div>
        <div class="operation">
          <div v-if="indent.state === 1"><el-button :loading="buttonLoading" size="mini">取消订单</el-button></div>
          <NuxtLink :to="{ path: '/money/pay', query: { id: indent.id }}" v-if="indent.state === 1"><el-button :loading="buttonLoading" size="mini" type="danger">立即付款</el-button></NuxtLink>
          <div v-if="indent.state === 3"><el-button :loading="buttonLoading" size="mini" type="danger" @click="confirmReceipt(item)">确认收货</el-button></div>
        </div>
      </div>
      <el-divider></el-divider>
      <div class="steps-box">
        <div class="title">{{indent.state_show}}</div>
        <div class="steps">
          <div :class="{on:indent.created_at}">
            <div class="chunk">下单</div>
          </div>
          <div :class="{on:indent.pay_time}">
            <div class="chunk">付款</div>
            <div class="name"></div>
          </div>
          <div :class="{on:indent.shipping_time}">
            <div class="chunk">配货</div>
            <div class="name"></div>
          </div>
          <div :class="{on:indent.state === 5}">
            <div class="chunk">交易成功</div>
            <div class="name"></div>
          </div>
        </div>
      </div>
      <div class="steps-box-time">
        <div class="steps">
          <div>
            <div class="chunk">{{indent.created_at}}</div>
          </div>
          <div>
            <div class="chunk">{{indent.pay_time}}</div>
          </div>
          <div>
            <div class="chunk">{{indent.shipping_time}}</div>
          </div>
          <div>
            <div class="chunk">{{indent.state === 5 ? indent.confirm_time : ''}}</div>
          </div>
        </div>
      </div>
      <el-table
        :data="indent.goods_list"
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
      <el-divider></el-divider>
      <div class="address" v-if="indent.good_location">
        <div class="min-title">收货信息</div>
        <div class="li">
          <div class="name">姓名：</div>
          <div class="value">{{indent.good_location.name}}</div>
        </div>
        <div class="li">
          <div class="name">联系电话：</div>
          <div class="value">{{indent.good_location.cellphone}}</div>
        </div>
        <div class="li">
          <div class="name">收货地址：</div>
          <div class="value">
            {{ indent.good_location.location }}
            <span v-if="indent.good_location.address">({{ indent.good_location.address }})</span>
            {{ indent.good_location.house }}
          </div>
        </div>
      </div>
      <el-divider></el-divider>
      <div v-if="indent.refund_time">
        <div class="address">
          <div class="min-title">退款方式</div>
          <div class="li">
            <div class="name">退款方式：</div>
            <div class="value">{{indent.refund_way}}</div>
          </div>
          <div class="li">
            <div class="name">退款时间：</div>
            <div class="value">{{indent.refund_time}}</div>
          </div>
          <div class="li">
            <div class="name">退款金额：</div>
            <div class="value">{{indent.refund_money}}</div>
          </div>
          <div class="li">
            <div class="name">退款原因：</div>
            <div class="value">{{indent.refund_reason}}</div>
          </div>
        </div>
        <el-divider></el-divider>
      </div>
      <div class="address">
        <div class="min-title">其它</div>
        <div class="li">
          <div class="name">备注：</div>
          <div class="value">{{indent.remark ? indent.remark : '无'}}</div>
        </div>
      </div>
      <el-divider></el-divider>
      <div class="right">
        <div class="li">
          <div class="name">商品总价：</div>
          <div class="value">{{indent.total | thousands}}元</div>
        </div>
        <div class="li">
          <div class="name">运费：</div>
          <div class="value" v-if="indent.carriage>0">{{indent.carriage | thousands}}元</div>
          <div class="value" v-else>免运费</div>
        </div>
        <div class="li">
          <div class="name">应付金额：</div>
          <div class="value total"><span>{{indent.total | thousands}}</span>元</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {detail, receipt} from '@/api/goodIndent'
export default {
  layout: 'user',
  head () {
    return {
      title: '订单详情-个人中心',
    }
  },
  data() {
    return {
      loading: true,
      buttonLoading: false,
      total: 0,
      indent:{}
    }
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    async getDetail(){
      if(!$nuxt.$route.query.id){
        this.$message({
          message: '参数有误，请联系管理员',
          type: 'error'
        });
        $nuxt.$router.go(-1);
        return false
      }
      await Promise.all([
        detail($nuxt.$route.query.id)
      ]).then(([indentData]) => {
        this.indent = indentData;
        this.total = 0;
        let specification = null;
        this.indent.goods_list.forEach(item => {
          this.total += item.price * item.number;
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
        });
        this.total = Number(this.total.toFixed(2));
        this.loading = false
      }).catch((error) => {
        this.loading = false
      })
    },
    // 确认收货
    confirmReceipt(){
      this.$confirm('是否确认收货？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.buttonLoading = true
        receipt(this.indent.id).then(response => {
          this.buttonLoading = false;
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          this.getDetail();
        }).catch(() => {
          this.buttonLoading = false
        })
      }).catch(() => {
      })
    },
    goBack() {
      $nuxt.$router.go(-1)
    }
  }
}
</script>
<style lang='scss' scoped>
  .specification{
    color: #999999;
  }
  .top{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top:20px;
  }
  .right{
    .li{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      font-size: 12px;
      color: #999999;
      line-height: 45px;
      .name{
        text-align: right;
        flex:1;
      }
      .value{
        width: 100px;
        text-align: right;
        color: $font-color-main;
      }
      .total{
        position: relative;
        top:-5px;
        span{
          font-size: 30px;
        }
      }
    }
  }
  .address{
    .min-title{
      margin-bottom: 20px;
    }
    .li{
      display: flex;
      line-height: 25px;
      font-size: 12px;
      .name{
        width: 80px;
        text-align: right;
      }
      .value{
        color: #999999;
      }
    }
  }
  .steps-box-time{
    .steps{
      display: flex;
      font-size: 12px;
      line-height: 25px;
      margin-top:5px;
      div{
        flex:1;
        text-align: center;
      }
    }
  }
  .steps-box{
    .title{
      color: $font-color-main;
      margin-bottom: 10px;
    }
    .steps{
      display:flex;
      border-radius:5px;
      background-color: #e1e1e1;
      font-size: 12px;
      line-height: 25px;
      .on{
        background-color: $font-color-main;
        color: #ffffff;
        border-radius:5px;
      }
      div{
        flex:1;
        .chunk{
          text-align: center;
        }
      }
    }
  }
</style>
