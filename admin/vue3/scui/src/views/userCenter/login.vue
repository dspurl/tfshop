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
			<div class="login_adv__bottom">
				© {{$ENV.VUE_APP_NAME}} {{$ENV.VUE_APP_VER}}
			</div>
		</div>
		<div class="login_main">
			<div class="login_config">
				<el-button :icon="config.theme=='dark'?'el-icon-sunny':'el-icon-moon'" circle type="info" @click="configTheme"></el-button>
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
					<h2>{{ $t('login.signInTitle') }}</h2>
				</div>
				<el-form ref="loginForm" :model="ruleForm" :rules="rules" label-width="0" size="large" @keyup.enter="login">
					<el-form-item prop="user">
						<el-input v-model="ruleForm.username" prefix-icon="el-icon-user" clearable :placeholder="$t('login.userPlaceholder')">
							<!-- <template #append>
								<el-select v-model="userType" style="width: 130px;">
									<el-option :label="$t('login.admin')" value="admin"></el-option>
									<el-option :label="$t('login.user')" value="user"></el-option>
								</el-select>
							</template> -->
						</el-input>
					</el-form-item>
					<el-form-item prop="password">
						<el-input v-model="ruleForm.password" prefix-icon="el-icon-lock" clearable show-password :placeholder="$t('login.PWPlaceholder')"></el-input>
					</el-form-item>
					<el-form-item style="margin-bottom: 10px;">
						<el-row>
							<el-col :span="12">
								<el-checkbox :label="$t('login.rememberMe')" v-model="ruleForm.remember"></el-checkbox>
							</el-col>
							<!-- <el-col :span="12" style="text-align: right;">
								<el-button type="text">{{ $t('login.forgetPassword') }}？</el-button>
							</el-col> -->
						</el-row>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" style="width: 100%;" :loading="islogin" round @click="login">{{ $t('login.signIn') }}</el-button>
					</el-form-item>
				</el-form>

				<!-- <el-divider>{{ $t('login.signInOther') }}</el-divider>

				<div class="login-oauth">
					<el-button size="small" type="success" icon="sc-icon-wechat" circle></el-button>
				</div> -->
			</div>
		</div>
	</div>
</template>
<style lang='scss' scoped>
  @import "./scss/login.scss";
</style>

<script>
import js from './js/login'
export default js
</script>