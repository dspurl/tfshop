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
      <template v-if="file">
        <el-image
          v-if="imgData.type === 1"
          :src="file"
          fit="cover"></el-image>
        <i v-else class="el-icon-folder avatar-uploader-icon"></i>
      </template>
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
