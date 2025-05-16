<template>
	<el-card shadow="never" header="语言主题">
		<el-form ref="form" label-width="120px" style="margin-top:20px;">
			<el-form-item :label="$t('user.nightmode')">
				<el-switch v-model="config.dark" inline-prompt active-icon="el-icon-moon" inactive-icon="el-icon-sunny"></el-switch>
				<div class="el-form-item-msg">{{ $t('user.nightmode_msg') }}</div>
			</el-form-item>
			<el-form-item label="主题颜色">
				<el-color-picker v-model="config.colorPrimary" :predefine="colorList">></el-color-picker>
			</el-form-item>
			<el-form-item :label="$t('user.language')">
				<el-select v-model="config.lang">
					<el-option label="简体中文" value="zh-cn"></el-option>
					<el-option label="English" value="en"></el-option>
				</el-select>
				<div class="el-form-item-msg">{{ $t('user.language_msg') }}</div>
			</el-form-item>
		</el-form>
	</el-card>
	<el-card shadow="never" header="个人设置" style="margin-top:20px;">
		<el-form ref="form" label-width="120px" style="margin-top:20px;">
			<el-form-item label="自动登出">
				<el-select v-model="config.autoExit">
					<el-option label="从不" :value="0"></el-option>
					<el-option label="1分钟" :value="1"></el-option>
					<el-option label="5分钟" :value="5"></el-option>
					<el-option label="10分钟" :value="10"></el-option>
					<el-option label="15分钟" :value="15"></el-option>
					<el-option label="20分钟" :value="20"></el-option>
					<el-option label="25分钟" :value="25"></el-option>
					<el-option label="30分钟" :value="30"></el-option>
					<el-option label="35分钟" :value="35"></el-option>
					<el-option label="40分钟" :value="40"></el-option>
					<el-option label="45分钟" :value="45"></el-option>
					<el-option label="50分钟" :value="50"></el-option>
					<el-option label="55分钟" :value="55"></el-option>
					<el-option label="60分钟" :value="60"></el-option>
				</el-select>
				<div class="el-form-item-msg">自动登出设置将在下次登录时生效</div>
			</el-form-item>
		</el-form>
	</el-card>
</template>

<script>
	import colorTool from '@/utils/color'

	export default {
		data() {
			return {
				colorList: ['#409EFF', '#009688', '#536dfe', '#ff5c93', '#c62f2f', '#fd726d'],
				config: {
					lang: this.$TOOL.data.get('APP_LANG') || this.$CONFIG.LANG,
					dark: this.$TOOL.data.get('APP_DARK') || false,
					colorPrimary: this.$TOOL.data.get('APP_COLOR') || this.$CONFIG.COLOR || '#409EFF',
					autoExit: this.$TOOL.data.get('AUTO_EXIT') || 0,
				}
			}
		},
		watch:{
			'config.dark'(val){
				if(val){
					document.documentElement.classList.add("dark")
					this.$TOOL.data.set("APP_DARK", val)
				}else{
					document.documentElement.classList.remove("dark")
					this.$TOOL.data.remove("APP_DARK")
				}
			},
			'config.lang'(val){
				this.$i18n.locale = val
				this.$TOOL.data.set("APP_LANG", val);
			},
			'config.colorPrimary'(val){
				if(!val){
					val = '#409EFF'
					this.config.colorPrimary = '#409EFF'
				}
				document.documentElement.style.setProperty('--el-color-primary', val);
				for (let i = 1; i <= 9; i++) {
					document.documentElement.style.setProperty(`--el-color-primary-light-${i}`, colorTool.lighten(val,i/10));
				}
				for (let i = 1; i <= 9; i++) {
					document.documentElement.style.setProperty(`--el-color-primary-dark-${i}`, colorTool.darken(val,i/10));
				}
				this.$TOOL.data.set("APP_COLOR", val);
			},
			'config.autoExit'(val){
				if(val == 0){
					this.$TOOL.data.remove("AUTO_EXIT")
				}else{
					this.$TOOL.data.set("AUTO_EXIT", val)
				}
			},
		},
	}
</script>

<style>
</style>
