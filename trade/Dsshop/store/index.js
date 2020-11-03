import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		hasLogin: false,
		userInfo: {}
	},
	mutations: {
		login(state, provider) {
			state.hasLogin = true
			state.userInfo = provider;
			uni.setStorage({//缓存用户登陆状态
			    key: 'dsshopUserInfo',  
			    data: provider  
			}) 
			// console.log(state.userInfo);
		},
		logout(state) {
			uni.removeStorageSync('dsshopApplytoken')
			state.hasLogin = false;
			state.userInfo = {};
			uni.removeStorage({  
                key: 'dsshopUserInfo'  
            })
		},
		// 登录验证
		loginCheck(state){
			if(!state.hasLogin){
				uni.navigateTo({
					url:'/pages/public/login'
				}) 
			}
		}
	},
	actions: {
	
	}
})

export default store
