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
import http from "@/utils/request"
export default {
	login: {
		url: `${process.env.VUE_APP_API_URL}/login`,
		name: "登录",
		post: async function(data={}){
			return await http.post(this.url, data);
		}
	},
	logout: {
		url: `${process.env.VUE_APP_API_URL}/logout`,
		name: "登出",
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
	},
	getVersion: {
		url: `${process.env.VUE_APP_API_URL}/version`,
		name: "获取版本信息",
		get: async function(){
			return await http.get(this.url);
		}
	}
}
