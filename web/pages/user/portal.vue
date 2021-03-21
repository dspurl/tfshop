<template>
  <div class="box">
    <div class="container user-portal">
      <el-breadcrumb separator="/" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>个人中心</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  </div>
</template>

<script>
import {getList as getBrowseList} from '@/api/browse'
export default {
  middleware: 'auth',
  head () {
    return {
      title: '个人中心',
      meta: [
        { hid: 'index', name: 'dsshop-快速开发商城网店系统', content: '商城网店系统|商城|网店|免费商城|免费网店' },
        { name: 'viewport', content: 'width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0' },
        { hid: 'description', name: 'description', content: 'dsshop-快速开发商城网店系统' }
      ]
    }
  },
  data() {
    return {
      browseList: []
    }
  },
  mounted() {
    console.log('browseList',this.browseList)
    this.getList()
  },
  methods: {
    getList(){
      Promise.all([
        getBrowseList({
          limit: 10,
          sort: '-updated_at'
        })
      ])
    }
  }
}
</script>
<style lang='scss' scoped>
  .user-portal{
    .breadcrumb{
      margin: 20px 0 20px 0;
    }
  }
</style>
