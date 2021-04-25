<template>
  <div class="box">
    <div class="container product-detail">
      <el-breadcrumb separator="/" class="breadcrumb">
        <el-breadcrumb-item>
          <NuxtLink :to="{ path: '/' }">
            首页
          </NuxtLink>
        </el-breadcrumb-item>
        <el-breadcrumb-item>{{ goodDetail.name }}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="product-box">
        <div class="picture">
          <el-carousel :autoplay="false" arrow="always" height="450px" indicator-position="outside">
            <el-carousel-item v-for="(item, index) in resources_many" :key="index">
              <template v-if="item.type === 'img'">
                <el-image class="image" fit="scale-down" :src="item.img" :preview-src-list="resources_many_img"></el-image>
              </template>
              <template v-else>
                <VueVideo :sources="item.img" :poster="poster"/>
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
            <el-button type="info" :class="{'product-detail-on' : collect}" icon="el-icon-star-off" @click="toCollect">收藏</el-button>
          </div>
        </div>
      </div>
    </div>
    <el-divider></el-divider>
    <!-- 详情-->
    <div class="product-box">
      <div class="tab">
        <span :class="{on:tab === 1}" @click="cutTab(1)">商品详情</span>
<!--        <el-divider direction="vertical"></el-divider>-->
<!--        <span :class="{on:tab === 2}" @click="cutTab(2)">商品规格</span>-->
      </div>
      <div class="detail-box">
        <div class="container" v-loading="tabLoading">
          <div v-if="tab === 1" v-html="goodDetail.details"></div>
          <div v-else-if="tab === 2">

          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang='scss'>
  .product-detail-on .el-icon-star-off{
    color: #fa524c;
  }
</style>
<style lang='scss' scoped>
  .box{
    border-top-width: 1px;
    border-top-style: solid;
    border-top-color: #dcdfe6;
    background-color: #ffffff;
  }
  .product-box{
    .tab{
      text-align: center;
      padding: 10px 0 20px 0;
      span{
        padding: 0 20px 0 20px;
        color: #757575;
        cursor:pointer;
      }
      .on{
        color: #fa524c;
      }
    }
    .detail-box{
      background-color: #f4f4f4;
      .container{
        text-align: center;
        overflow: hidden;
        width: 100%;
        img{
          display: block;
        }
      }
    }
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
import {create as collectCreate, destroy as collectDestroy, detail as getCollectDetail} from '@/api/collect'
import sku from '@/components/Sku'
import VueVideo from '@/components/VueVideo'
import 'video.js/dist/video-js.css'
export default {
  components: {
    sku,
    VueVideo
  },
  data() {
    return {
      tab: 1,
      tabLoading: false,
      goodDetail: {},
      specificationDefaultDisplay: {},
      resources_many: [],
      resources_many_img: [],
      collect: 0,
      poster: ''
    }
  },
  async asyncData (ctx) {
    try {
      const { query } = ctx;
      let [ goodDetailData ] = await Promise.all([
        detail(query.id)
      ]);
      let resources_many = [];
      let resources_many_img = [];
      let poster;
      if (goodDetailData.resources_many.length > 0) {
        goodDetailData.resources_many.forEach((item,index)=>{
          if(item.depict.indexOf('_video') !== -1){
            item.type = 'video';
            resources_many.unshift(item)
          } else if(item.depict.indexOf('_poster') !== -1){
            poster = item.img
          } else {
            item.type = 'img';
            resources_many.push(item);
            resources_many_img.push(item.img)
          }
        })
      }
      return {
        goodDetail: goodDetailData,
        resources_many: resources_many,
        resources_many_img: resources_many_img,
        poster: poster
      }
    } catch(err) {
      ctx.$errorHandler(err)
    }
  },
  head () {
    return {
      title: this.goodDetail.name + '-' + process.env.APP_NAME,
      meta: [
        { hid: 'index', name: this.goodDetail.name + '-' + process.env.APP_NAME, content: this.goodDetail.keywords ? this.goodDetail.keywords : process.env.APP_KEYWORD },
        { hid: 'description', name: 'description', content: this.goodDetail.short_description ? this.goodDetail.short_description : process.env.APP_DESCRIPTION }
      ]
    }
  },
  mounted() {
    if($nuxt.$store.state.hasLogin){
      this.getCollect()
    }
  },
  methods: {
    //选择后返回的数据
    purchasePattern(data) {
      this.specificationDefaultDisplay = data;
    },
    buy(state){
      if(!$nuxt.$store.state.hasLogin){
        $nuxt.$store.commit('loginCheck');
        return false
      }
      this.$refs.sku.cart(state)
    },
    getCollect(){
      getCollectDetail($nuxt.$route.query.id).then(response => {
        this.collect = response
      })
    },
    // 收藏
    toCollect() {
      if(!$nuxt.$store.state.hasLogin){
        $nuxt.$store.commit('loginCheck');
        return false
      }
      if(this.collect){
        collectDestroy(this.goodDetail.id)
      }else{
        collectCreate(this.goodDetail)
      }
      this.collect = !this.collect
    },
    // 切换栏目
    cutTab(index){
      this.tabLoading = true;
      this.tab = index;
      setTimeout(()=>{
        this.tabLoading = false
      },1000)
    }
  }
}
</script>
