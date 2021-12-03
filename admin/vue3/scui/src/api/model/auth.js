import http from "@/utils/request"
export default {
	login: {
		url: `${process.env.VUE_APP_API_URL}/login`,
		name: "登录",
		post: async function(data={}){
			return await http.post(this.url, data);
		}
	},
	refreshToken: {
		url: `${process.env.VUE_APP_API_URL}/refreshToken`,
		name: "token刷新",
		post: async function(data={}){
			return await http.post(this.url, data);
		}
	},
	getUserInfo: {
		url: `${process.env.VUE_APP_API_URL}/userInfo`,
		name: "获取用户信息",
		get: async function(){
			return await http.get(this.url);
		}
	}
}
