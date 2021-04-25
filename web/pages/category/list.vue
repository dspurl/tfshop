<template>
  <div class="box">
    <el-breadcrumb class="breadcrumb container" separator="/">
      <el-breadcrumb-item>
        <NuxtLink :to="{ path: '/' }">
          首页
        </NuxtLink>
      </el-breadcrumb-item>
      <el-breadcrumb-item>全部商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="category-box">
      <div class="category-list container" v-for="(item, index) in goodCategory" :key="index">
        <NuxtLink class="title" :to="{ path: '/product/list', query: { pid: item.id, title: item.name }}">
          {{item.name}}
        </NuxtLink>
        <template v-if="item.level === 3">
          <div class="category-list-box" v-for="(item2, index2) in item.children" :key="index2">
            <NuxtLink class="min-title" :to="{ path: '/product/list', query: { pid: item2.id, title: item2.name }}">
              {{item2.name}}
            </NuxtLink>
            <div class="list">
              <div class="li" v-for="(item3, index3) in item2.children" :key="index3">
                <NuxtLink :to="{ path: '/product/list', query: { pid: item3.id, title: item3.name }}">
                  <el-image
                    class="image"
                    :src="item3.resources.img"
                    fit="scale-down"/>
                  <div class="name">{{item3.name}}</div>
                </NuxtLink>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="category-list-box">
            <div class="list">
              <div class="li" v-for="(item2, index2) in item.children" :key="index2">
                <NuxtLink :to="{ path: '/product/list', query: { pid: item2.id, title: item2.name }}">
                  <el-image
                    class="image"
                    :src="item2.resources.img"
                    fit="scale-down"/>
                  <div class="name">{{item2.name}}</div>
                </NuxtLink>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<style lang='scss' scoped>
  .category-box{
    background-color: #ffffff;
    padding: 20px 0 20px 0;
    .title{
      font-size: 24px;
      border-bottom-width: 1px;
      border-bottom-style: solid;
      border-bottom-color: #CCC;
      padding-bottom: 10px;
      display: flex;
    }
    .category-list-box{
      padding-top:20px;
      .min-title{
        font-weight: bold;
        color: #999999;
        margin-bottom: 20px;
        display: flex;
      }
      .list{
        display: flex;
        flex-wrap: wrap;
        .li {
          border: 1px solid #e0e0e0;
          padding: 20px;
          text-align: center;
          margin: 0 10px 10px 0;

          .image {
            width: 80px;
            height: 80px;
          }

          .name {
            margin-top: 20px;
            text-align: center;
          }
        }
        .li:hover{
          .name{
            color: $font-color-main;
          }
        }
      }
    }
  }
  .breadcrumb{
    margin-top:10px;
    margin-bottom: 10px;
  }
</style>
<script>
import {goodCategory as getGoodCategory} from '@/api/good'
export default {
  data() {
    return {
      goodCategory: []
    }
  },
  async asyncData (ctx) {
    try {
      let [ goodCategoryData ] = await Promise.all([
        getGoodCategory({tree: true})
      ]);
      for(let item of goodCategoryData){
        if(item.children){
          item.level = 3;
          for(let item2 of item.children){
            if(item2.resources){
              item.level = 2
            }
            break
          }
        }
      }
      return {
        goodCategory: goodCategoryData
      }
    } catch(err) {
      ctx.$errorHandler(err)
    }
  },
  head () {
    return {
      title: '全部商品分类-' + process.env.APP_NAME
    }
  },
  mounted() {

  },
  methods: {

  }
}
</script>
