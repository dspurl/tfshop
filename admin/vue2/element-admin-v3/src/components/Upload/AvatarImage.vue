<template>
  <div>
    <el-upload
      :action="url"
      :data="imgData"
      :headers="imgHeaders"
      :show-file-list="false"
      :on-success="handleSuccessList"
      :before-upload="beforeUploadList"
      :on-error="handleError"
      :style="{height: height + 'px',width: width + 'px'}"
      class="avatar-uploader">
      <template v-if="file">
        <el-image
          v-if="imgData.type === 1"
          :src="file"
          fit="cover"/>
        <i v-else :style="{height: height + 'px',width: width + 'px'}" class="el-icon-folder avatar-uploader-icon"/>
      </template>
      <i v-else :style="{height: height + 'px',width: width + 'px'}" class="el-icon-plus avatar-uploader-icon"/>
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
