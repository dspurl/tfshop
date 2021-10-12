<template>
    <div>
        <header>
            <div class="header">
                <h1>DSSHOP</h1>
                <el-menu
                  :default-active="activeIndex2"
                  class="el-menu-header"
                  mode="horizontal"
                  @select="handleSelect"
                  active-text-color="#39b54a">
                    <el-menu-item index="1">首页</el-menu-item>
                    <!--<el-menu-item index="2">关于我们</el-menu-item>-->
                </el-menu>
            </div>
        </header>
        <div class="block">
            <el-carousel height="450px">
                <el-carousel-item>
                    <div class="description">
                        <el-row :gutter="12">
                            <el-col class="left" :lg="6">
                                <h1>DSSHOP</h1>
                                <h4>易开发、易扩展、完全免费的商城系统</h4>
                            </el-col>
                            <el-col class="right" :lg="6">
                                <img src="static/header.png">
                            </el-col>
                        </el-row>
                    </div>
                </el-carousel-item>
            </el-carousel>
        </div>
    </div>
</template>

<script>
  export default {
    data () {
      return {
        title: '宜云码-最好用的活码生成器',
        activeIndex: '1',
        activeIndex2: '1'
      }
    },
    head () {
      return {
        title: this.title,
        meta: [
          { hid: 'index', name: '宜云码', content: '宜云码-微信活码|微信群活码|活码工具|活码二维码|二维码活码工具|社群营销工具|微信群活码裂变工具' },
          { name: 'viewport', content: 'width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0' },
        ]
      }
    },
    methods: {
      handleSelect(key, keyPath) {
//        console.log(key, keyPath);
      }
    }
  }
</script>

<style>
    .container {
        margin: 0 auto;
        max-width: 1200px;
    }
    header{
        width: 100%;
    }
    .header{
        width: 100%;
        position: relative;
        margin: 0 auto;
        max-width: 1200px;
        border-bottom: solid 1px #e6e6e6;
        height: 60px;
    }
    .header .img{
        padding-top:10px;
        height:60px;
        width:120px;
    }
    .el-menu-header{
        position: absolute;
        left:140px;
        top:0px;
    }
    .el-carousel__item .description {
        margin: 0 auto;
        max-width: 1200px;
        color: #ffffff;
    }
    .el-carousel__item .description .left{
        float:left;
        padding-top: 100px;
    }
    .el-carousel__item .description .left h1{
        padding-bottom: 30px;
    }
    .el-carousel__item .description .left img{
        width:150px;
        margin-top: 20px;
    }
    .el-carousel__item .description .right{
        float:right;
        margin-right: 80px;
    }
    .el-carousel__item .description .right img{
        height:450px;
    }
    .el-carousel__item:nth-child(2n) {
        background-color: #39b54a;
    }

    .el-carousel__item:nth-child(2n+1) {
        background-color: #39b54a;
    }
    .section{
        padding-top: 60px;
        text-align: center;
        padding-bottom: 50px;
    }
    .section .frame{
        border-radius: 50%;
        height:160px;
        width:160px;
        margin: 0 auto;
    }
    .section .frame.brand {
        background-color: #3a8ee6;
    }
    .section .frame.success {
        background-color: #67C23A;
    }
    .section .frame.warning {
        background-color: #E6A23C;
    }
    .section .frame.danger {
        background-color: #F56C6C;
    }
    .section h1{
        padding-top: 20px;
        color:#606266;
    }
    .section p{
        padding-top: 10px;
        text-align: left;
        font-size: 14px;
        line-height: 20px;
    }
    .section .iconfont{
        font-size: 80px;
        line-height: 160px;
        color: #ffffff;
    }
    .function{
        overflow:hidden;
        min-height: 650px;
    }
    .function img{
        padding-top: 120px;
    }
    .gray-bag{
        background-color: #ebeef5;
    }
    .function .left{
        float:left;
    }
    .function .right{
        float: right;
    }
    .function h1{
        padding-top: 200px;
        padding-bottom: 30px;
        color: #606266;
    }
    .function p{
        line-height: 35px;
        color: #909399;
    }
    .contactus{
        min-height:300px !important;
    }
    .contactus h1{
        padding-top: 80px;
    }
    .copyright{
        margin: 0 auto;
        max-width: 1200px;
        line-height: 45px;
        color: #606266;
    }
</style>
