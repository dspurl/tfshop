<template>
  <div>
    <el-upload
      :limit="limit"
      :action="url"
      :headers="imgHeaders"
      :on-success="handleSuccessList"
      :on-remove="handleRemove"
      :on-preview="handlePictureCardPreview"
      :before-upload="beforeUploadList"
      :on-error="handleError"
      :data="imgData"
      :file-list="fileList"
      :on-exceed="handleExceed"
      multiple
      list-type="picture-card">
      <i slot="default" class="el-icon-plus"/>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" modal-append-to-body append-to-body>
      <img :src="dialogImageUrl" width="100%" alt="">
    </el-dialog>
  </div>
</template>

<style lang='scss' scoped>
  @import "./scss/insertImage";
</style>

<script>
import js from './js/insertImage'
export default js
</script>
