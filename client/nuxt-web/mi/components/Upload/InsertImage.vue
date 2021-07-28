<template>
	<div>
    <el-upload
      :limit="limit"
      :action="url"
      :headers="imgHeaders"
      :on-success="handleSuccessList"
      :on-remove="handleRemove"
      :before-upload="beforeUploadList"
      :data="imgData"
      :file-list="fileList"
      :on-exceed="handleExceed"
      multiple
      list-type="picture-card">
      <i slot="default" class="el-icon-plus"/>
    </el-upload>
	</div>
</template>

<style lang='scss' scoped>
  @import "./scss/insertImage";
</style>

<script>
import js from './js/insertImage'
export default js
</script>
