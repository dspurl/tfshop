<template>
	<div class="login_bg">
		<div class="login_adv" style="background-image: url(img/auth_banner.jpg);">
			<div class="login_adv__title">
				<h2>{{$ENV.VUE_APP_SHORT_NAME}}</h2>
				<h4>{{ $t('login.slogan') }}</h4>
				<p>{{ $t('login.describe') }}</p>
				<div>
					<span>
						<el-icon><sc-icon-vue /></el-icon>
					</span>
					<span>
						<el-icon class="add"><el-icon-plus /></el-icon>
					</span>
					<span>
						<el-icon><el-icon-eleme-filled /></el-icon>
					</span>
				</div>
			</div>
			<div class="login_adv__mask"></div>
			<div class="login_adv__bottom">
				© {{$ENV.VUE_APP_NAME}} {{$ENV.VUE_APP_VER}}
			</div>
		</div>
		<div class="login_main">
			<div class="login_config">
				<el-button :icon="config.dark?'el-icon-sunny':'el-icon-moon'" circle type="info" @click="configDark"></el-button>
				<el-dropdown trigger="click" placement="bottom-end" @command="configLang">
					<el-button circle>
						<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 512 512"><path d="M478.33 433.6l-90-218a22 22 0 0 0-40.67 0l-90 218a22 22 0 1 0 40.67 16.79L316.66 406h102.67l18.33 44.39A22 22 0 0 0 458 464a22 22 0 0 0 20.32-30.4zM334.83 362L368 281.65L401.17 362z" fill="currentColor"></path><path d="M267.84 342.92a22 22 0 0 0-4.89-30.7c-.2-.15-15-11.13-36.49-34.73c39.65-53.68 62.11-114.75 71.27-143.49H330a22 22 0 0 0 0-44H214V70a22 22 0 0 0-44 0v20H54a22 22 0 0 0 0 44h197.25c-9.52 26.95-27.05 69.5-53.79 108.36c-31.41-41.68-43.08-68.65-43.17-68.87a22 22 0 0 0-40.58 17c.58 1.38 14.55 34.23 52.86 83.93c.92 1.19 1.83 2.35 2.74 3.51c-39.24 44.35-77.74 71.86-93.85 80.74a22 22 0 1 0 21.07 38.63c2.16-1.18 48.6-26.89 101.63-85.59c22.52 24.08 38 35.44 38.93 36.1a22 22 0 0 0 30.75-4.9z" fill="currentColor"></path></svg>
					</el-button>
					<template #dropdown>
						<el-dropdown-menu>
							<el-dropdown-item v-for="item in lang" :key="item.value" :command="item" :class="{'selected':config.lang==item.value}">{{item.name}}</el-dropdown-item>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
			</div>
			<div class="login-form">
				<div class="login-header">
					<div class="logo">
						<img :alt="$ENV.VUE_APP_NAME" src="img/logo.png">
						<label>{{$ENV.VUE_APP_NAME}}</label>
					</div>
				</div>
				<el-tabs>
					<el-tab-pane :label="$t('login.accountLogin')" lazy>
						<password-form></password-form>
					</el-tab-pane>
					<el-tab-pane :label="$t('login.mobileLogin')" lazy>
						<phone-form></phone-form>
					</el-tab-pane>
				</el-tabs>
				<el-divider>{{ $t('login.signInOther') }}</el-divider>
				<div class="login-oauth">
					<el-button type="success" icon="sc-icon-wechat" circle @click="wechatLogin"></el-button>
				</div>
			</div>
		</div>
	</div>
	<el-dialog v-model="showWechatLogin" :title="$t('login.wechatLoginTitle')" :width="400" destroy-on-close>
		<div class="qrCodeLogin">
			<sc-qr-code class="qrCode" :text="WechatLoginCode" :size="200"></sc-qr-code>
			<p class="msg">{{$tc('login.wechatLoginMsg', 1)}}<br/>{{$tc('login.wechatLoginMsg', 2)}}</p>
			<div class="qrCodeLogin-result" v-if="isWechatLoginResult">
				<el-result icon="success" :title="$tc('login.wechatLoginResult', 1)" :sub-title="$tc('login.wechatLoginResult', 2)"></el-result>
			</div>
		</div>
	</el-dialog>
</template>

<script>
	import passwordForm from './components/passwordForm'
	import phoneForm from './components/phoneForm'

	export default {
		components: {
			passwordForm,
			phoneForm
		},
		data() {
			return {
				config: {
					lang: this.$TOOL.data.get('APP_LANG') || this.$CONFIG.LANG,
					dark: this.$TOOL.data.get('APP_DARK') || false
				},
				lang: [
					{
						name: '简体中文',
						value: "cn",
					},
					{
						name: 'English',
						value: 'en',
					}
				],
				WechatLoginCode: "",
				showWechatLogin: false,
				isWechatLoginResult: false
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
				this.$TOOL.data.set("APP_LANG", val)
			}
		},
		created: function() {
			this.$TOOL.data.remove("TOKEN");
			this.$TOOL.data.remove("USER_INFO");
			this.$TOOL.data.remove("MENU");
			this.$TOOL.data.remove("PERMISSIONS");
			this.$TOOL.data.remove("APP_LANG");
			this.$TOOL.data.remove("grid");
			this.$TOOL.data.remove("appConfig");
			this.$store.commit("clearViewTags");
			this.$store.commit("clearKeepLive");
			this.$store.commit("clearIframeList");
		},
		methods: {
			configDark(){
				this.config.dark = this.config.dark ? false : true
			},
			configLang(command){
				this.config.lang = command.value
			},
			wechatLogin(){
				this.showWechatLogin = true
				this.WechatLoginCode = "SCUI-823677237287236-" + new Date().getTime()
				this.isWechatLoginResult = false
				setTimeout(()=>{
					this.isWechatLoginResult = true
				},3000)
			}
		}
	}
</script>

<style scoped>
	.login_bg {width: 100%;height: 100%;background: #fff;display: flex;}
	.login_adv {width: 33.33333%;background-color: #555;background-size: cover;background-position: center center;background-repeat: no-repeat;position: relative;}
	.login_adv__title {color: #fff;padding: 40px;position: absolute;top:0px;left:0px;right: 0px;z-index: 2;}
	.login_adv__title h2 {font-size: 40px;}
	.login_adv__title h4 {font-size: 18px;margin-top: 10px;font-weight: normal;}
	.login_adv__title p {font-size: 14px;margin-top:10px;line-height: 1.8;color: rgba(255,255,255,0.6);}
	.login_adv__title div {margin-top: 10px;display: flex;align-items: center;}
	.login_adv__title div span {margin-right: 15px;}
	.login_adv__title div i {font-size: 40px;}
	.login_adv__title div i.add {font-size: 20px;color: rgba(255,255,255,0.6);}
	.login_adv__bottom {position: absolute;left:0px;right: 0px;bottom: 0px;color: #fff;padding: 40px;background-image:linear-gradient(transparent, #000);z-index: 3;}
	.login_adv__mask {position: absolute;top:0px;left:0px;right: 0px;bottom: 0px;background: rgba(0,0,0,0.5);z-index: 1;}

	.login_main {flex: 1;overflow: auto;display:flex;}
	.login-form {width: 400px;margin: auto;padding:20px 0;}
	.login-header {margin-bottom: 40px;}
	.login-header .logo {display: flex;align-items: center;}
	.login-header .logo img {width: 40px;height: 40px;vertical-align: bottom;margin-right: 10px;}
	.login-header .logo label {font-size: 26px;font-weight: bold;}
	.login-oauth {display: flex;justify-content:space-around;}
	.login-form .el-divider {margin-top:40px;}

	.login-form {}
	.login-form:deep(.el-tabs) .el-tabs__header {margin-bottom: 25px;}
	.login-form:deep(.el-tabs) .el-tabs__header .el-tabs__item {font-size: 14px;}

	.login-form:deep(.login-forgot) {text-align: right;}
	.login-form:deep(.login-forgot) a {color: var(--el-color-primary);}
	.login-form:deep(.login-forgot) a:hover {color: var(--el-color-primary-light-3);}
	.login-form:deep(.login-reg) {font-size: 14px;color: var(--el-text-color-primary);}
	.login-form:deep(.login-reg) a {color: var(--el-color-primary);}
	.login-form:deep(.login-reg) a:hover {color: var(--el-color-primary-light-3);}

	.login_config {position: absolute;top:20px;right: 20px;}

	.login-form:deep(.login-msg-yzm) {display: flex;width: 100%;}
	.login-form:deep(.login-msg-yzm) .el-button {margin-left: 10px;--el-button-size:42px;}

	.qrCodeLogin {text-align: center;position: relative;padding: 20px 0;}
	.qrCodeLogin img.qrCode {background: #fff;padding:20px;border-radius:10px;}
	.qrCodeLogin p.msg {margin-top: 15px;}
	.qrCodeLogin .qrCodeLogin-result {position: absolute;top:0;left:0;right: 0;bottom: 0;text-align: center;background: var(--el-mask-color);}

	@media (max-width: 1200px){
		.login-form {width: 340px;}
	}
	@media (max-width: 1000px){
		.login_main {display: block;}
		.login_main .login_config {position: static;padding:20px 20px 0 20px;text-align: right;}
		.login-form {width:100%;padding:20px 40px;}
		.login_adv {display: none;}
	}
</style>
