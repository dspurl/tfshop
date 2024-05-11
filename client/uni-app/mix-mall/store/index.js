/** +----------------------------------------------------------------------
 * | TFSHOP [ 轻量级易扩展低代码开源商城系统 ]
 * +----------------------------------------------------------------------
 * | Copyright (c) 2020~2023 https://www.dswjcms.com All rights reserved.
 * +----------------------------------------------------------------------
 * | Licensed 未经许可不能去掉TFSHOP相关版权
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
				uni.setStorageSync('tfshopApplytoken', provider.access_token)
				uni.setStorageSync('tfshopExpiresIn', (new Date()).getTime() + provider.expires_in * 1000)
				uni.setStorageSync('tfshopRefreshToken', provider.refresh_token)
				uni.setStorageSync('tfshopTokenType', provider.token_type)
				uni.setStorageSync('tfshopUserInfo', provider)
			}
			// console.log(state.userInfo);
		},
		logout(state) {
			uni.removeStorageSync('tfshopApplytoken')
			uni.removeStorageSync('tfshopExpiresIn')
			uni.removeStorageSync('tfshopRefreshToken')
			uni.removeStorageSync('tfshopTokenType')
			uni.removeStorageSync('applyDsshopSession_key')
			uni.removeStorageSync('applyDsshopOpenid')
			uni.removeStorageSync('tfshopUserInfo')
			uni.removeStorageSync('tfshopCartList')
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
				if(new Date().getTime() >= uni.getStorageSync('tfshopExpiresIn')){
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
