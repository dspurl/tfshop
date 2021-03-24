<template>
  <div class="box">
    <div class="container product-detail">
      <el-breadcrumb separator="/" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{ goodDetail.name }}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="product-box">
        <div class="picture">
          <el-carousel :autoplay="false" arrow="always" height="460px">
            <el-carousel-item v-for="(item, index) in goodDetail.resources_many" :key="index">
              <template v-if="item.type === 'img'">
                <el-image class="image" fit="scale-down" :src="item.img" :preview-src-list="resources_many" lazy></el-image>
              </template>
            </el-carousel-item>
          </el-carousel>
        </div>
        <div class="parameter">
          <div class="title">{{goodDetail.name}}</div>
          <div v-if="goodDetail.short_description" class="description">{{goodDetail.short_description}}</div>
          <div class="price-box">
            <!-- 已选择规则-->
            <template v-if="specificationDefaultDisplay.price_show">
              <template v-if="goodDetail.price_show && specificationDefaultDisplay.price_show">
                <div class="price" v-if="specificationDefaultDisplay.price_show.length > 1"><span class="symbol">¥</span>{{specificationDefaultDisplay.price_show[0] | thousands}} - {{specificationDefaultDisplay.price_show[1] | thousands}}</div>
                <div class="price" v-else-if="specificationDefaultDisplay.price_show.length === 1"><span class="symbol">¥</span>{{specificationDefaultDisplay.price_show[0] | thousands}}</div>
              </template>
            </template>
            <!-- 未选择规则-->
            <template v-else>
              <template v-if="goodDetail.price_show">
                <div class="price" v-if="goodDetail.price_show.length > 1"><span class="symbol">¥</span>{{ goodDetail.price_show[0] | thousands }} - {{ goodDetail.price_show[1] | thousands }}</div>
                <div class="price" v-else-if="goodDetail.price_show.length === 1"><span class="symbol">¥</span>{{ goodDetail.price_show[0] | thousands }}</div>
              </template>
              <template v-if="goodDetail.market_price_show">
                <div class="m-price" v-if="goodDetail.market_price_show.length > 1"><span class="symbol">¥</span>{{ goodDetail.market_price_show[1] | thousands }}</div>
                <div class="m-price" v-else-if="goodDetail.market_price_show.length === 1"><span class="symbol">¥</span>{{ goodDetail.market_price_show[0] | thousands }}</div>
              </template>
            </template>
          </div>
          <el-divider></el-divider>
          <div class="sku">
            <sku ref="sku" :getList="goodDetail" @purchasePattern="purchasePattern"></sku>
          </div>
          <el-divider></el-divider>
          <div class="shipping-address">

          </div>
          <div class="operation">
            <el-button type="danger" plain @click="buy(true)">立即购买</el-button>
            <el-button type="danger" @click="buy(false)">加入购物车</el-button>
            <el-button type="info" icon="el-icon-star-off">收藏</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang='scss' scoped>
  .box{
    border-top-width: 1px;
    border-top-style: solid;
    border-top-color: #dcdfe6;
    background-color: #ffffff;
  }
  .product-detail{
    .breadcrumb{
      padding: 20px 0 20px 0;
    }
    .product-box{
      display: flex;
      .picture{
        width: 460px;
        margin-right: 20px;
        .image{
          width: 100%;
        }
      }
      .parameter{
        flex:1;
        .title{
          font-size: 24px;
          font-weight: 400;
          color: #212121;
        }
        .description{
          color: #b0b0b0;
          margin: 0;
          padding-top: 8px;
          line-height: 1.5;
        }
        .price-box{
          display: flex;
          padding-top:8px;
          .price{
            font-size: 28px;
            color: #fa524c;
            .symbol{
              font-size: 14px;
            }
          }
          .m-price{
            position: relative;
            top:3px;
            font-size: 14px;
            margin-left: 5px;
            color: #b0b0b0;
            text-decoration: line-through;
          }
        }
        .operation{
          display: flex;
        }
      }
    }
  }
</style>
<script>
import {detail} from '@/api/good'
import sku from '@/components/sku'
export default {
  middleware: 'auth',
  components: {
    sku
  },
  data() {
    return {
      goodDetail: {},
      specificationDefaultDisplay: {},
      resources_many: [],
    }
  },
  async asyncData (ctx) {
    try {
      const { query } = ctx
      let [goodDetailData] = await Promise.all([
        detail(query.id)
      ])
      let resources_many = []
      let poster = ''
      if (goodDetailData.resources_many.length > 0) {
        goodDetailData.resources_many.forEach((item,index)=>{
          if(item.depict.indexOf('_video') !== -1){
            item.type = 'video'
            resources_many.unshift(item.img)
          } else if(item.depict.indexOf('_poster') !== -1){
            poster = item.img
          } else {
            item.type = 'img'
            resources_many.push(item.img)
          }
        })
      }
      return {
        goodDetail: goodDetailData,
        resources_many: resources_many,
        poster: poster
      }
    } catch(err) {
      ctx.$errorHandler(err)
    }
  },
  head () {
    return {
      title: process.env.APP_NAME + '-' + this.goodDetail.name,
      meta: [
        { hid: 'index', name: process.env.APP_NAME + '-' + this.goodDetail.name, content: this.goodDetail.keywords ? this.goodDetail.keywords : process.env.APP_KEYWORD },
        { hid: 'description', name: 'description', content: this.goodDetail.short_description ? this.goodDetail.short_description : process.env.APP_DESCRIPTION }
      ]
    }
  },
  mounted() {
    console.log('goodDetail',this.goodDetail)
  },
  methods: {
    //选择后返回的数据
    purchasePattern(data) {
      this.specificationDefaultDisplay = data;
      console.log('specificationDefaultDisplay',data)
    },
    buy(state){
      this.$refs.sku.cart(state)
    }
  }
}
</script>
