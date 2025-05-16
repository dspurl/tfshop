<template>
	<el-config-provider :locale="config.locale" :size="config.size" :zIndex="config.zIndex" :button="config.button">
		<router-view></router-view>
	</el-config-provider>
</template>

<script>
	import colorTool from '@/utils/color'

	export default {
		name: 'App',
		data() {
			return {
				config: {
					locale: this.$i18n.messages[this.$i18n.locale].el,
					size: "default",
					zIndex: 2000,
					button: {
						autoInsertSpace: false
					}
				}
			}
		},
		created() {
			//设置主题颜色
			const app_color = this.$ENV.VUE_APP_COLOR || this.$TOOL.data.get('APP_COLOR')
			if(app_color){
				document.documentElement.style.setProperty('--el-color-primary', app_color);
				for (let i = 1; i <= 9; i++) {
					document.documentElement.style.setProperty(`--el-color-primary-light-${i}`, colorTool.lighten(app_color,i/10));
				}
				for (let i = 1; i <= 9; i++) {
					document.documentElement.style.setProperty(`--el-color-primary-dark-${i}`, colorTool.darken(app_color,i/10));
				}
			}
		}
	}
</script>

<style lang="scss">
	@use '@/style/style.scss' as *;
</style>
