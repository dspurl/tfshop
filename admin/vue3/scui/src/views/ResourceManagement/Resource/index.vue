<template>
	<sc-file-select
			v-model="file"
			:multiple="multiple"
			:hideUpload="hideUpload"
			:max="99"
			uuid="e7b26940-58c4-11ec-be8a-d951fa410f9e"
			@view="view"
		></sc-file-select>
	<el-drawer
		v-model="info"
		@closed="$emit('closed')"
		:size="400"
		custom-class="drawerBG"
		direction="rtl"
		destroy-on-close
	>
		<info-dialog ref="infoDialog"></info-dialog>
	</el-drawer>
</template>
<style lang='scss' scoped>
@import "./scss/index.scss";
</style>

<script>
import js from './js/index'
export default js
</script>
