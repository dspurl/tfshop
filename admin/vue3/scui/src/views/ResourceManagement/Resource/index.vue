<template>
	<sc-file-select
	  v-model="file"
	  :multiple="multiple"
	  :hideUpload="hideUpload"
	  :max="99"
	  uuid="e7b26940-58c4-11ec-be8a-d951fa410f9e"
	  @view="view"
	></sc-file-select>
	<div v-auths="['ResourceView']">
	  <el-drawer
		v-model="info"
		@closed="$emit('closed')"
		:size="400"
		class="drawerBG"
		direction="rtl"
		destroy-on-close
	  >
		<info-dialog ref="infoDialog"></info-dialog>
	  </el-drawer>
	</div>
  </template>
  <style lang='scss' scoped>
  @use "./scss/index.scss" as *;
  </style>
  
  <script>
  import js from "./js/index";
  export default js;
  </script>
  