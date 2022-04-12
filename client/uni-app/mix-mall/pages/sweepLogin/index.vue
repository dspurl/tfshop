<template>
	<view class="content">
		<!-- 主体 -->
			<!-- #ifdef MP-WEIXIN -->
			<teleport v-if="state === 1">
				<image class="portrait" :src="user.portrait || '/static/missing-face.png'" lazy-load></image>
				<view class="username">{{user.nickname || user.cellphone || '游客'}}</view>
				<view class="explain">将授权登录网站</view>
				<button class="button cu-btn round bg-red shadow" @click="setAuthorization()">授权登录</button>
				<navigator class="cancel text-center text-blue" open-type="exit" target="miniProgram" hover-class="none">取消</navigator>
			</teleport>
			<teleport v-else-if="state === 2">
				<view class="username">该二维码已被其它设备扫码</view>
			</teleport>
			<teleport v-else>
				<view class="username">该二维码已失效，请刷新后重新扫码</view>
			</teleport>
			<!-- #endif -->
			<!-- #ifndef MP-WEIXIN -->
			<view class="username">仅支持微信小程序扫码登录</view>
			<!-- #endif -->
		<!-- 主体end -->
	</view>
</template>
<style lang='scss' scoped>
  @import "./scss/index";
</style>
<script>
import js from './js/index'
export default js
</script>
