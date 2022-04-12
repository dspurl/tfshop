<template>
  <div class="box">
    <el-page-header @back="goBack" content="订单评价">
    </el-page-header>
    <div v-loading="loading">
      <div class="top">
        <div class="order-number">订单号：{{indent.identification}}</div>
      </div>
      <el-divider></el-divider>
      <el-form class="ruleForm" :model="indent" ref="ruleForm" label-width="120px">
        <div v-for="(item,index) in indent.list" :key="index">
          <el-table
            :data="[item]"
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
                {{scope.row.number}}
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
          <el-form-item label="综合评分：" :prop="`list[${index}].score`" :rules="{ required: true, message: '您还有未选择的星级评分', trigger: 'change' }">
            <el-rate
              class="rate"
              v-model="item.score"
              show-text>
            </el-rate>
          </el-form-item>
          <el-form-item label="上传图片：" prop="resources">
            <el-upload
              :limit="4"
              :action="url"
              :headers="imgHeaders"
              :on-success="(response, file, fileList) => handleAvatarSuccessList(response, file, fileList, index)"
              :on-remove="(file, fileList) => handleRemove(file, fileList, index)"
              :before-upload="beforeAvatarUploadList"
              :data="imgData"
              :file-list="item.resources"
              multiple
              list-type="picture-card">
              <i slot="default" class="el-icon-plus"/>
            </el-upload>
            <div class="el-upload__tip">最多可上传4张，每张不能大于2M</div>
          </el-form-item>
          <el-form-item label="匿名评价" :prop="`list[${index}].anonymity`" :rules="{ required: true, message: '是否匿名评价', trigger: 'change' }">
            <el-switch v-model="item.anonymity"></el-switch>
          </el-form-item>
          <el-form-item label="评价内容：" :prop="`list[${index}].details`" :rules="{ required: true, message: '您还有未填写的评价内容', trigger: 'blur' }">
            <el-input
              type="textarea"
              placeholder="亲,您对这个商品满意吗？您的评价会帮助我们提供更好的服务哦~"
              v-model="item.details"
              maxlength="500"
              :autosize="{ minRows: 4}"
              show-word-limit/>
          </el-form-item>
          <el-divider></el-divider>
        </div>
      </el-form>
      <div class="right">
        <el-button :loading="buttonLoading" type="primary" @click="addComment()">提交评价</el-button>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
  @import "./scss/score";
</style>

<script>
  import js from './js/score'
  export default js
</script>
