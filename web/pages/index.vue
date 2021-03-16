<template>
  <div class="box">
    <!--分类-->
    <div class="top">
      <div class="container">
        <div class="classify">
          <div class="nave">
            <div class="li">手机、电话卡<i class="iconfont dsshop-youjiantou"></i></div>
            <div class="li">电脑<i class="iconfont dsshop-youjiantou"></i></div>
            <div class="li">女装<i class="iconfont dsshop-youjiantou"></i></div>
            <div class="li">男装<i class="iconfont dsshop-youjiantou"></i></div>
            <div class="li">其它1<i class="iconfont dsshop-youjiantou"></i></div>
            <div class="li">其它2<i class="iconfont dsshop-youjiantou"></i></div>
            <div class="li">其它3<i class="iconfont dsshop-youjiantou"></i></div>
            <div class="li">其它4<i class="iconfont dsshop-youjiantou"></i></div>
            <div class="li">其它5<i class="iconfont dsshop-youjiantou"></i></div>
            <div class="li">其它6<i class="iconfont dsshop-youjiantou"></i></div>
          </div>
          <el-carousel class="banner" height="460px">
            <el-carousel-item v-for="item in 4" :key="item">
              <h3>{{ item }}</h3>
            </el-carousel-item>
          </el-carousel>
        </div>
        <!-- 二级分类-->
        <div class="secondary-navigation" v-if="categoryStyle === 1">
          <div class="list">
            <NuxtLink class="dt" to="/pass/login">女装<i class="iconfont dsshop-youjiantou"></i></NuxtLink>
            <div class="dd">
              <NuxtLink class="li" to="/pass/login">连衣裙</NuxtLink>
              <NuxtLink class="li" to="/pass/login">连衣裙</NuxtLink>
              <NuxtLink class="li" to="/pass/login">连衣裙</NuxtLink>
              <NuxtLink class="li" to="/pass/login">连衣裙</NuxtLink>
              <NuxtLink class="li" to="/pass/login">连衣裙</NuxtLink>
              <NuxtLink class="li" to="/pass/login">连衣裙</NuxtLink>
              <NuxtLink class="li" to="/pass/login">连衣裙</NuxtLink>
            </div>
          </div>
          <div class="list">
            <NuxtLink class="dt" to="/pass/login">男装<i class="iconfont dsshop-youjiantou"></i></NuxtLink>
            <div class="dd">
              <NuxtLink class="li" to="/pass/login">连衣裙</NuxtLink>
              <NuxtLink class="li" to="/pass/login">连衣裙</NuxtLink>
              <NuxtLink class="li" to="/pass/login">连衣裙</NuxtLink>
              <NuxtLink class="li" to="/pass/login">连衣裙</NuxtLink>
              <NuxtLink class="li" to="/pass/login">连衣裙</NuxtLink>
              <NuxtLink class="li" to="/pass/login">连衣裙</NuxtLink>
              <NuxtLink class="li" to="/pass/login">连衣裙</NuxtLink>
            </div>
          </div>
        </div>
        <div class="secondary-navigation2" v-if="categoryStyle === 2">
          <NuxtLink class="li" to="/pass/login">
            <el-image
              class="image"
              src="//cdn.cnbj1.fds.api.mi-img.com/mi-mall/9074723edc522839834f7fcd12b6f558.png?thumb=1&w=40&h=40&f=webp&q=90"
              fit="scale-down"/>
            <div class="name">Redmi MAX 86” 超大屏电视Redmi MAX 86” 超大屏电视Redmi MAX 86” 超大屏电视Redmi MAX 86” 超大屏电视</div>
          </NuxtLink>
          <NuxtLink class="li" to="/pass/login">
            <el-image
              class="image"
              src="//cdn.cnbj1.fds.api.mi-img.com/mi-mall/9074723edc522839834f7fcd12b6f558.png?thumb=1&w=40&h=40&f=webp&q=90"
              fit="scale-down"/>
            <div class="name">Redmi MAX 86” 超大屏电视</div>
          </NuxtLink>
          <NuxtLink class="li" to="/pass/login">
            <el-image
              class="image"
              src="//cdn.cnbj1.fds.api.mi-img.com/mi-mall/9074723edc522839834f7fcd12b6f558.png?thumb=1&w=40&h=40&f=webp&q=90"
              fit="scale-down"/>
            <div class="name">Redmi MAX 86” 超大屏电视</div>
          </NuxtLink>
          <NuxtLink class="li" to="/pass/login">
            <el-image
              class="image"
              src="//cdn.cnbj1.fds.api.mi-img.com/mi-mall/9074723edc522839834f7fcd12b6f558.png?thumb=1&w=40&h=40&f=webp&q=90"
              fit="scale-down"/>
            <div class="name">Redmi MAX 86” 超大屏电视</div>
          </NuxtLink>
          <NuxtLink class="li" to="/pass/login">
            <el-image
              class="image"
              src="//cdn.cnbj1.fds.api.mi-img.com/mi-mall/9074723edc522839834f7fcd12b6f558.png?thumb=1&w=40&h=40&f=webp&q=90"
              fit="scale-down"/>
            <div class="name">Redmi MAX 86” 超大屏电视</div>
          </NuxtLink>
          <NuxtLink class="li" to="/pass/login">
            <el-image
              class="image"
              src="//cdn.cnbj1.fds.api.mi-img.com/mi-mall/9074723edc522839834f7fcd12b6f558.png?thumb=1&w=40&h=40&f=webp&q=90"
              fit="scale-down"/>
            <div class="name">Redmi MAX 86” 超大屏电视</div>
          </NuxtLink>
          <NuxtLink class="li" to="/pass/login">
            <el-image
              class="image"
              src="//cdn.cnbj1.fds.api.mi-img.com/mi-mall/9074723edc522839834f7fcd12b6f558.png?thumb=1&w=40&h=40&f=webp&q=90"
              fit="scale-down"/>
            <div class="name">Redmi MAX 86” 超大屏电视</div>
          </NuxtLink>
          <NuxtLink class="li" to="/pass/login">
            <el-image
              class="image"
              src="//cdn.cnbj1.fds.api.mi-img.com/mi-mall/9074723edc522839834f7fcd12b6f558.png?thumb=1&w=40&h=40&f=webp&q=90"
              fit="scale-down"/>
            <div class="name">Redmi MAX 86” 超大屏电视</div>
          </NuxtLink>
        </div>
        <!-- 二级导航 end-->
      </div>
    </div>
    <!--分类 end-->
    <!--广告-->
    <!--广告 end-->
    <!--推荐-->
    <div class="recommend container">
      <div class="title">为你推荐</div>
      <div class="list">
        <NuxtLink class="li" to="/pass/login">
          <el-card class="card" shadow="hover">
            <el-image
              class="image"
              src="//cdn.cnbj1.fds.api.mi-img.com/mi-mall/cccac948e1b8ffb47f1fecde67692e60.jpg?thumb=1&w=200&h=200&f=webp&q=90"
              lazy/>
            <div class="name">米家飞行员太阳镜 Pro</div>
            <div class="price">
              <div class="symbol">¥</div>
              <div class="value">199.00</div>
            </div>
          </el-card>
        </NuxtLink>
        <NuxtLink class="li" to="/pass/login">
          <el-card class="card" shadow="hover">
            <el-image
              class="image"
              src="//cdn.cnbj1.fds.api.mi-img.com/mi-mall/cccac948e1b8ffb47f1fecde67692e60.jpg?thumb=1&w=200&h=200&f=webp&q=90"
              lazy/>
            <div class="name">米家飞行员太阳镜 Pro</div>
            <div class="price">
              <div class="symbol">¥</div>
              <div class="value">199.00</div>
            </div>
          </el-card>
        </NuxtLink>
        <NuxtLink class="li" to="/pass/login">
          <el-card class="card" shadow="hover">
            <el-image
              class="image"
              src="//cdn.cnbj1.fds.api.mi-img.com/mi-mall/cccac948e1b8ffb47f1fecde67692e60.jpg?thumb=1&w=200&h=200&f=webp&q=90"
              lazy/>
            <div class="name">米家飞行员太阳镜 Pro</div>
            <div class="price">
              <div class="symbol">¥</div>
              <div class="value">199.00</div>
            </div>
          </el-card>
        </NuxtLink>
        <NuxtLink class="li" to="/pass/login">
          <el-card class="card" shadow="hover">
            <el-image
              class="image"
              src="//cdn.cnbj1.fds.api.mi-img.com/mi-mall/cccac948e1b8ffb47f1fecde67692e60.jpg?thumb=1&w=200&h=200&f=webp&q=90"
              lazy/>
            <div class="name">米家飞行员太阳镜 Pro</div>
            <div class="price">
              <div class="symbol">¥</div>
              <div class="value">199.00</div>
            </div>
          </el-card>
        </NuxtLink>
      </div>
    </div>
    <!--推荐 end-->
  </div>
</template>

<script>
export default {
  data() {
    return {
      categoryStyle: 0
    }
  },
  head () {
    return {
      title: 'dsshop商城网店系统',
      meta: [
        { hid: 'index', name: 'dsshop-快速开发商城网店系统', content: '商城网店系统|商城|网店|免费商城|免费网店' },
        { name: 'viewport', content: 'width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0' },
        { hid: 'description', name: 'description', content: 'dsshop-快速开发商城网店系统' }
      ]
    }
  }
}
</script>

<style lang='scss'>
  .recommend{
    margin-top:40px;
    width: 1210px;
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
              color: #fa524c;
            }
            .value{
              color: #fa524c;
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
    background-color: #ffffff;
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
    z-index: 2;
    width: 1000px;
    height: 460px;
    padding:20px;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    .li{
      font-size: 12px;
      line-height: 40px;
      margin-bottom: 40px;
      display: flex;
      width: 25%;
      .name{
        margin-left:10px;
        margin-right: 10px;
        flex:1;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
    }
    .li:hover{
      color: #fa524c;
    }
    .image{
      width: 40px;
      height: 40px;
    }
  }
  .secondary-navigation{
    position: absolute;
    background-color: #ffffff;
    border: 1px solid #e0e0e0;
    box-shadow: 0 8px 16px #888888;
    top:0;
    left: 200px;
    z-index: 2;
    width: 1000px;
    height: 460px;
    padding:20px;
    font-size: 14px;
    .list{
      line-height: 40px;
      display: flex;
      .dt{
        width: 80px;
        text-align: right;
        font-weight: bold;
        margin-right: 10px;
        .iconfont{
          margin-left:5px;
          font-size: 12px;
        }
      }
      .dt:hover{
        color: #fa524c;
      }
      .dd{
        display: flex;
        flex:1;
        .li{
          padding: 0 10px 0 10px;
        }
        .li:hover{
          color: #fa524c;
        }
      }
    }
  }
  .classify{
    display: flex;
    background-color: #ffffff;
    .nave{
      width: 200px;
      background: rgba(105,101,101,.9);
      color: #ffffff;
      padding-top:20px;
      height: 460px;
      overflow: hidden;
      .li{
        cursor:pointer;
        padding:10px;
        .iconfont{
          float:right;
          position: relative;
          top:3px;
        }
      }
      .li:hover{
        background-color: #fa524c;
      }
    }
    .banner{
      flex:1;
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
