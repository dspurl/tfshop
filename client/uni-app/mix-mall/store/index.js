/** +----------------------------------------------------------------------
 * | DSSHOP [ 轻量级易扩展低代码开源商城系统 ]
 * +----------------------------------------------------------------------
 * | Copyright (c) 2020~2023 https://www.dswjcms.com All rights reserved.
 * +----------------------------------------------------------------------
 * | Licensed 未经许可不能去掉DSSHOP相关版权
 * +----------------------------------------------------------------------
 * | Author: Purl <383354826@qq.com>
 * +----------------------------------------------------------------------
 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		hasLogin: false,
		userInfo: {},
		refresh: false
	},
	mutations: {
		login(state, provider) {
			state.hasLogin = true
			state.userInfo = provider;
			if(!provider.update){
				uni.setStorageSync('dsshopApplytoken', provider.access_token)
				uni.setStorageSync('dsshopExpiresIn', (new Date()).getTime() + provider.expires_in * 1000)
				uni.setStorageSync('dsshopRefreshToken', provider.refresh_token)
				uni.setStorageSync('dsshopTokenType', provider.token_type)
				uni.setStorageSync('dsshopUserInfo', provider)
			}
			// console.log(state.userInfo);
		},
		logout(state) {
			uni.removeStorageSync('dsshopApplytoken')
			uni.removeStorageSync('dsshopExpiresIn')
			uni.removeStorageSync('dsshopRefreshToken')
			uni.removeStorageSync('dsshopTokenType')
			uni.removeStorageSync('applyDsshopSession_key')
			uni.removeStorageSync('applyDsshopOpenid')
			uni.removeStorageSync('dsshopUserInfo')
			uni.removeStorageSync('dsshopCartList')
			state.hasLogin = false;
			state.userInfo = {};
		},
		// 登录验证
		loginCheck(state){
			if(!state.hasLogin){
				uni.navigateTo({
					url:'/pages/public/login'
				}) 
			}else{
				if(new Date().getTime() >= uni.getStorageSync('dsshopExpiresIn')){
					uni.navigateTo({
						url:'/pages/public/login'
					}) 
				}
			}
		},
		// 刷新状态
		setRefresh(state, provider) {
			state.refresh = provider
		}
	},
	actions: {
	
	}
})

export default store
