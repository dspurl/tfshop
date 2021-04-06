<template>
  <div class="box">
    <el-breadcrumb class="breadcrumb container" separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>一级分类</el-breadcrumb-item>
      <el-breadcrumb-item>二级分类</el-breadcrumb-item>
      <el-breadcrumb-item>三级分类</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="screen-box">
      <div class="screen container">
        <div class="on">综合</div>
        <el-divider class="divider" direction="vertical"></el-divider>
        <div>销量</div>
        <el-divider class="divider" direction="vertical"></el-divider>
        <div class="f-sort">
          <span class="fs-tit">价格</span>
          <em class="fs-up">
            <i class="up el-icon-caret-top"></i>
            <i class="below el-icon-caret-bottom"></i>
          </em>
        </div>
      </div>
    </div>
    <div class="product-list container">
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
    <div class="operation container">
      <pagination v-if="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" class="pagination" @pagination="getList"/>
    </div>
  </div>
</template>
<style lang='scss' scoped>
  .operation{
    margin-bottom: 20px;
  }
  .product-list{
    width: 1210px;
    position: relative;
    left: 5px;
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
  .screen-box{
    margin: 30px 0 10px 0;
    .on{
      color: #fa524c;
    }
    .f-sort{
      position: relative;
      .fs-tit {
        display: inline-block;
        vertical-align: top;
      }
      .fs-up {
        display: inline-block;
        width: 7px;
        margin-left: 5px;
        vertical-align: top;
      }
      .up{
        position: relative;
        top: -3px;
        left: -7px;
      }
      .below{
        position: relative;
        top: -17px;
        left: -7px;
      }
    }
    .screen{
      display: flex;
      .divider{
        position: relative;
        top:3px;
        margin: 0 20px 0 20px;
      }
    }
  }
  .breadcrumb{
    margin-top:10px;
    margin-bottom: 10px;
  }
</style>
<script>
import {getList as getGoodList} from '@/api/good'
export default {
  data() {
    return {
      goodList: [],
      listQuery: {},
      total: 0,
    }
  },
  async asyncData (ctx) {
    try {
      const listQuery={
        limit: 10,
        page: 1,
        sort: '-created_at',
      }
      let [goodData] = await Promise.all([
        getGoodList(listQuery)
      ])
      return {
        goodList: goodData.data,
        total: goodData.total,
        listQuery: listQuery
      }
    } catch(err) {
      ctx.$errorHandler(err)
    }
  },
  head () {
    return {
      title: '商品列表-' + process.env.APP_NAME
    }
  },
  methods: {
  }
}
</script>
