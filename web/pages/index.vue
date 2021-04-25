<template>
  <div class="box">
    <!--分类-->
    <div class="top">
      <div class="container">
        <div class="classify">
          <div class="nave" @mouseenter="naveCut(-1)" @mouseleave="naveShiftOut">
            <div class="nave-li" :class="{on:naveOn === index}" v-for="(item, index) in categoryList" :key="index" @mouseover="naveCut(index)">{{item.name}}<i class="iconfont dsshop-youjiantou"></i></div>
            <!-- 二级分类-->
            <div class="secondary-navigation" v-if="categoryStyle === 1">
              <div class="list" v-for="(item, index) in categorySublevel" :key="index">
                <NuxtLink class="dt">{{item.name}}<i class="iconfont dsshop-youjiantou"></i></NuxtLink>
                <div class="dd">
                  <NuxtLink class="li" v-for="(item2, index2) in item.children" :key="index2" :to="{ path: 'product/list', query: { pid: item2.id, title: item2.name }}">{{item2.name}}</NuxtLink>
                </div>
              </div>
            </div>
            <div class="secondary-navigation2" v-else-if="categoryStyle === 2">
              <NuxtLink class="li" :to="{ path: 'product/list', query: { pid: item.id, title: item.name }}" v-for="(item, index) in categorySublevel" :key="index">
                <el-image
                  class="image"
                  :src="item.resources.img | smallImage(80)"
                  fit="scale-down"/>
                <div class="name">{{item.name}}</div>
              </NuxtLink>
            </div>
            <!-- 二级导航 end-->
          </div>
          <el-carousel class="banner" height="460px" arrow="never">
            <el-carousel-item v-for="(item, index) in bannerList" :key="index">
              <NuxtLink v-if="item.url" :to="item.url.split('pages/').join('')">
                <el-image class="image" :src="item.resources.img"/>
              </NuxtLink>
              <el-image v-else class="image" :src="item.resources.img"/>
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
    </div>
    <!--分类 end-->
    <!--推荐-->
    <div class="recommend container">
      <div class="title">为你推荐</div>
      <div class="list">
        <NuxtLink class="li" v-for="(item, index) in goodList" :key="index" :to="{ path: '/product/detail', query: { id: item.id }}">
          <el-card class="card" shadow="hover">
            <el-image
              class="image"
              :src="item.resources.img | smallImage(200)"
              fit="cover"
              lazy/>
            <div class="name">{{item.name}}</div>
            <div class="price">
              <div class="symbol">¥</div>
              <div class="value">{{item.order_price | thousands}}</div>
            </div>
          </el-card>
        </NuxtLink>
      </div>
    </div>
    <!--推荐 end-->
    <!-- 广告-->
    <div class="container advertising" v-if="banner">
      <NuxtLink v-if="banner.url" :to="banner.url.split('pages/').join('')">
        <el-image
          fit="cover"
          :src="banner.resources.img"/>
      </NuxtLink>
      <el-image
        v-else
        fit="cover"
        :src="banner.resources.img"/>
    </div>
    <!--分类推荐-->
    <div class="recommend container" v-for="(fitem, findex) in recommendCategoryList" :key="findex">
      <div class="title-box">
        <div class="min-title">{{fitem.name}}</div>
        <NuxtLink class="more" :to="{ path: '/product/list', query: { pid: fitem.id, title: fitem.name }}">查看更多>></NuxtLink>
      </div>
      <div class="list">
        <NuxtLink class="li" v-for="(item, index) in recommendGoodList[findex]" :key="index" :to="{ path: '/product/detail', query: { id: item.id }}">
          <el-card class="card" shadow="hover">
            <el-image
              class="image"
              :src="item.resources.img | smallImage(200)"
              fit="cover"
              lazy/>
            <div class="name">{{item.name}}</div>
            <div class="price">
              <div class="symbol">¥</div>
              <div class="value">{{item.order_price | thousands}}</div>
            </div>
          </el-card>
        </NuxtLink>
      </div>
    </div>
    <!--分类推荐 end-->
  </div>
</template>

<script>
import {getList as getGoodList, goodCategory} from '@/api/good'
import {getList as bannerList} from '@/api/banner'
export default {
  data() {
    return {
      categoryStyle: 0,
      naveOn: null,
      goodList: [],
      banner: '',
      bannerList: [],
      categoryList: [],
      categorySublevel:[],
      recommendCategoryList: [],
      recommendGoodList: [],
    }
  },
  async asyncData (ctx) {
    try {
      let [goodData, bannerData, categoryData, recommendCategoryData] = await Promise.all([
        getGoodList({
          limit: 10,
          is_recommend: 1
        }),
        bannerList({
          limit: 5,
          type: 0,
          sort: '+sort'
        }),
        goodCategory({
          tree: true
        }),
        goodCategory({
          is_recommend: 1
        }),
      ])
      return {
        goodList: goodData.data,
        bannerList: bannerData.data,
        categoryList: categoryData,
        recommendCategoryList: recommendCategoryData
      }
    } catch(err) {
      ctx.$errorHandler(err)
    }
  },
  mounted() {
    this.categoryGood();
    this.getBanner()
  },
  methods: {
    // 分类切换
    naveCut(index){
      if(index !== -1){
        this.naveOn = index;
        if(this.categoryList[index].children){ //存在子类目
          if(this.categoryList[index].children[0].resources){
            this.categorySublevel = this.categoryList[index].children;
            this.categoryStyle = 2
          }else{  //存在三级
            this.categorySublevel = this.categoryList[index].children;
            this.categoryStyle = 1
          }
        }else{
          this.categorySublevel = []
        }
      }
    },
    // 获取分类商品
    categoryGood() {
      this.recommendCategoryList.forEach((item,index)=>{
        this.recommendGoodList[index] = []
        getGoodList({
          limit: 10,
          category_id: item.id
        }).then(response => {
          this.recommendGoodList[index] = response.data
          this.$forceUpdate()
        })
      })
    },
    // 分类移出
    naveShiftOut(){
      this.naveOn = null;
      this.categoryStyle = 0
    },
    // 首页广告
    getBanner(){
      bannerList({
        limit: 1,
        type: 1,
        sort: '+sort'
      }).then(response => {
        this.banner = response.data[0]
      })
    }
  }
}
</script>

<style lang='scss' scoped>
  .advertising{
    margin-top: 20px;
  }
  .recommend{
    margin-top:40px;
    width: 1210px;
    position: relative;
    left: 5px;
    .title-box{
      display: flex;
      .min-title{
        font-size: 22px;
        color: #333;
        line-height: 58px;
        flex:1;
      }
      .more{
        font-size: 16px;
        line-height: 58px;
        color: #424242;
        width: 95px;
      }
      .more:hover{
        color: $font-color-main;
      }
    }
    .title{
      text-align: center;
      display: block;
      font-size: 28px;
      margin-bottom: 20px;
    }
    .list{
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      .li{
        cursor:pointer;
        width: 20%;
        .card{
          margin: 0 10px 10px 0;
          .image{
            width: 100%;
            height: 190px;
          }
          .name{
            font-size: 14px;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
          }
          .price{
            display: flex;
            justify-content: center;
            margin-bottom: 10px;
            .symbol{
              font-size: 12px;
              line-height: 40px;
              color: $font-color-main;
            }
            .value{
              color: $font-color-main;
              line-height: 35px;
            }
          }
        }
        .card:hover{
          transform: translate(0,-5px);
        }
      }
    }
  }
  .top{
    padding-bottom: 20px;
    .container{
      position: relative;
    }
  }
  .secondary-navigation2{
    position: absolute;
    background-color: #ffffff;
    border: 1px solid #e0e0e0;
    box-shadow: 0 8px 16px #888888;
    top:0;
    left: 200px;
    z-index: 10;
    width: 1000px;
    height: 460px;
    padding:20px;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    .li{
      font-size: 12px;
      line-height: 40px;
      display: flex;
      width: 25%;
      .name{
        margin-left:10px;
        margin-right: 10px;
        flex:1;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        line-height: 80px;
      }
    }
    .li:hover{
      color: $font-color-main;
    }
    .image{
      width: 80px;
      height: 80px;
    }
  }
  .secondary-navigation{
    position: absolute;
    background-color: #ffffff;
    border: 1px solid #e0e0e0;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    top:0;
    left: 200px;
    z-index: 10;
    width: 1000px;
    height: 460px;
    padding:20px;
    font-size: 14px;
    .list{
      line-height: 40px;
      display: flex;
      .dt{
        width: 100px;
        text-align: right;
        font-weight: bold;
        margin-right: 10px;
        .iconfont{
          margin-left:5px;
          font-size: 12px;
        }
      }
      .dt:hover{
        color: $font-color-main;
      }
      .dd{
        display: flex;
        flex:1;
        .li{
          padding: 0 10px 0 10px;
        }
        .li:hover{
          color: $font-color-main;
        }
      }
    }
  }
  .classify{
    display: flex;
    background-color: #ffffff;
    position: relative;
    .nave{
      z-index: 10;
      position: absolute;
      left: 0;
      top:0;
      width: 200px;
      color: #ffffff;
      padding-top:20px;
      height: 460px;
      background: rgba(105,101,101,.6);
      .nave-li{
        cursor:pointer;
        padding:10px;
        .iconfont{
          float:right;
          position: relative;
          top:3px;
        }
      }
      .nave-li:hover,.nave-li.on{
        color: #ffffff;
        background-color: $font-color-main;
      }
    }
    .banner{
      flex:1;
      .image{
        width: 100%;
        height: 100%;
      }
    }
  }
  .el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
</style>
