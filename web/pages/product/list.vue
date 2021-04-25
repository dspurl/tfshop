<template>
  <div class="box">
    <el-breadcrumb class="breadcrumb container" separator="/">
      <el-breadcrumb-item>
        <NuxtLink :to="{ path: '/' }">
          首页
        </NuxtLink>
      </el-breadcrumb-item>
      <el-breadcrumb-item v-if="listQuery.pid">商品分类</el-breadcrumb-item>
      <el-breadcrumb-item v-else>搜索结果</el-breadcrumb-item>
      <el-breadcrumb-item>{{title}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div v-if="total">
      <div class="screen-box">
        <div class="screen container">
          <el-link :underline="false" :class="{on: !listQuery.sort}" @click="tabClick()">综合</el-link>
          <el-divider class="divider" direction="vertical"></el-divider>
          <el-link :underline="false" :class="{on: listQuery.sort === '-sales'}" @click="tabClick('sales')">销量</el-link>
          <el-divider class="divider" direction="vertical"></el-divider>
          <el-link class="f-sort" :underline="false" @click="tabClick('order_price')">
            <span class="fs-tit">价格</span>
            <em class="fs-up">
              <i class="up el-icon-caret-top" :class="{on: listQuery.sort === '+order_price'}"></i>
              <i class="below el-icon-caret-bottom" :class="{on: listQuery.sort === '-order_price'}"></i>
            </em>
          </el-link>
        </div>
      </div>
      <div class="product-list container" v-loading="loading">
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
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="listQuery.page"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="listQuery.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"/>
      </div>
    </div>
    <div class="no-goods" v-else>
      <img :src="require('assets/img/no-goods.png')"/>
      <div v-if="listQuery.pid">抱歉，“{{title}}”分类下暂无商品，换个分类搜搜吧</div>
      <div v-else>抱歉，没有找到商品“{{title}}”，换个词搜搜吧</div>
    </div>
  </div>
</template>
<style lang='scss' scoped>
  .no-goods{
    text-align: center;
    margin: 20px 0 80px 0;
  }
  .operation{
    margin-bottom: 20px;
  }
  .product-list{
    width: 1210px;
    position: relative;
    left: 5px;
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
  .screen-box{
    margin: 30px 0 10px 0;
    .on{
      color: $font-color-main;
    }
    .f-sort{
      position: relative;
      .fs-tit {
        display: inline-block;
        vertical-align: top;
      }
      .fs-up {
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
        top: 3px;
        left: -26px;
      }
    }
    .screen{
      display: flex;
      margin-bottom: 20px;
      .on{
        color: $font-color-main;
      }
      .divider{
        position: relative;
        top:3px;
        margin: 0 20px 0 20px;
      }
    }
  }
  .breadcrumb{
    margin-top:20px;
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
      loading: false,
      total: 0,
      title: ''
    }
  },
  async asyncData (ctx) {
    try {
      const { query } = ctx;
      const listQuery={
        limit: 20,
        page: 1,
        sort: '',
        category_id: query.pid,
        title: query.pid ? '': query.title
      };
      let [goodData] = await Promise.all([
        getGoodList(listQuery)
      ])
      return {
        goodList: goodData.data,
        total: goodData.total,
        listQuery: listQuery,
        title: query.title ? query.title : '全部商品'
      }
    } catch(err) {
      ctx.$errorHandler(err)
    }
  },
  head () {
    return {
      title: this.title + (this.listQuery.pid ? '-商品分类-': '-搜索结果-') + process.env.APP_NAME
    }
  },
  methods: {
    getList(){
      this.loading = true;
      Promise.all([
        getGoodList(this.listQuery)
      ]).then(([goodData]) => {
        this.goodList = goodData.data;
        this.total = goodData.total;
        this.loading = false;
      }).catch((error) => {
        this.loading = false;
      })
    },
    //筛选点击
    tabClick(index){
      if(index){
        if(index === 'sales'){
          this.listQuery.sort = '-sales'
        }else{
          if(this.listQuery.sort !== '+order_price'){
            this.listQuery.sort = '+order_price'
          }else{
            this.listQuery.sort = '-order_price'
          }
        }
      }else{
        this.listQuery.sort = ''
      }
      this.listQuery.page = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList()
    }
  }
}
</script>
