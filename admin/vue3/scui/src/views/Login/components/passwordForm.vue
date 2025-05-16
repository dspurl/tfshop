<template>
	<el-form ref="loginForm" :model="form" :rules="rules" label-width="0" size="large" @keyup.enter="login">
		<el-form-item prop="username">
			<el-input v-model="form.username" prefix-icon="el-icon-user" clearable :placeholder="$t('login.userPlaceholder')">
				<template #append>
					<el-select v-model="userType" style="width: 130px;">
						<el-option :label="$t('login.admin')" value="admin"></el-option>
						<el-option :label="$t('login.user')" value="user"></el-option>
					</el-select>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item prop="password">
			<el-input v-model="form.password" prefix-icon="el-icon-lock" clearable show-password :placeholder="$t('login.PWPlaceholder')"></el-input>
		</el-form-item>
		<el-form-item style="margin-bottom: 10px;">
				<el-col :span="12">
					<el-checkbox :label="$t('login.rememberMe')" v-model="form.autologin"></el-checkbox>
				</el-col>
				<el-col :span="12" class="login-forgot">
					<router-link to="/reset_password">{{ $t('login.forgetPassword') }}？</router-link>
				</el-col>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" style="width: 100%;" :loading="islogin" round @click="login">{{ $t('login.signIn') }}</el-button>
		</el-form-item>
		<div class="login-reg">
			{{$t('login.noAccount')}} <router-link to="/user_register">{{$t('login.createAccount')}}</router-link>
		</div>
	</el-form>
</template>

<script>
import {getToken, setToken} from "@/utils/auth";

export default {
		data() {
			return {
				userType: 'admin',
				form: {
					username: "",
					password: "",
					remember: false,
					type: 1,
					refresh_token: "",
				},
				rules: {
					username: [
						{
							required: true,
							message: this.$t("login.userError"),
							trigger: "blur",
						},
					],
					password: [
						{required: true, message: this.$t('login.PWError'), trigger: 'blur'}
					]
				},
				islogin: false,
			}
		},
		watch:{
		},
		mounted() {

		},
		methods: {
			async login() {
				const validate = await this.$refs.loginForm
					.validate()
					.catch(() => {});
				if (!validate) {
					return false;
				}
				this.islogin = true;
				try {
					const user = await this.$API.auth.login.post(this.form);
					if (!user) {
						return false;
					}
					const token = user.message;
					let refresh_expires_in = 0;
					// 处理登录状态
					if (getToken("access_token")) {
						if (new Date().getTime() > getToken("expires_in")) {
							// token失效
							this.form.type = 2;
							this.form.refresh_token = getToken("refresh_token");
						}
					} else {
						// 第一次登录
						this.form.type = 1;
					}
					if (this.form.remember) {
						refresh_expires_in = token.refresh_expires_in
							? token.refresh_expires_in
							: 0;
					}
					setToken(
						"access_token",
						token.access_token,
						refresh_expires_in
					);
					setToken(
						"expires_in",
						new Date().getTime() + token.expires_in * 1000,
						refresh_expires_in
					);
					setToken(
						"refresh_token",
						token.refresh_token,
						refresh_expires_in
					);
					setToken("token_type", token.token_type, refresh_expires_in);
				} finally {
					this.islogin = false;
				}
				try {
					const getUserInfo = await this.$API.auth.getUserInfo.get();
					if (!getUserInfo) {
						return false;
					}
					this.$TOOL.data.set("USER_INFO", getUserInfo.message.userInfo);
					this.$TOOL.data.set("MENU", getUserInfo.message.menu);
					this.$TOOL.data.set("VERSION", getUserInfo.message.version);
					this.$TOOL.data.set(
						"PERMISSIONS",
						getUserInfo.message.permissions
					);
					this.$store.commit("SET_appConfig", getUserInfo.message.appConfig)
					if(!this.$store.state.global.curPage){
						this.$store.commit("SET_curPage", getUserInfo.message.curPage)
					}
				} finally {
					this.islogin = false;
				}
				this.$message.success(this.$t("login.succeed"));
				this.islogin = false;
				this.$router.replace({ path: this.redirect || "/" });
			},
		}
	}
</script>

<style>
</style>
