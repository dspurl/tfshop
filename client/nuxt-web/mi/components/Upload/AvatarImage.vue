<template>
	<div>
    <el-upload
      class="avatar-uploader"
      :action="url"
      :data="imgData"
      :headers="imgHeaders"
      :show-file-list="false"
      :on-success="handleSuccessList"
      :before-upload="beforeUploadList">
      <img v-if="file" :src="file" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
	</div>
</template>

<style lang='scss' scoped>
  @import "./scss/avatarImage";
</style>

<script>
import js from './js/avatarImage'
export default js
</script>
