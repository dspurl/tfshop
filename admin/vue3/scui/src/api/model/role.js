import http from "@/utils/request"
export default {
	list: {
		url: `${process.env.VUE_APP_API_URL}/role`,
		name: "角色列表",
		get: async function(data={}){
			return await http.get(this.url, data);
		}
	},
	create: {
		url: `${process.env.VUE_APP_API_URL}/role`,
		name: "创建角色",
		post: async function(data={}){
			return await http.post(this.url, data);
		}
	},
	edit: {
		url: `${process.env.VUE_APP_API_URL}/role`,
		name: "保存角色",
		post: async function(data={}){
			return await http.post(this.url + '/' + data.id, data);
		}
	},
	permission: {
		url: `${process.env.VUE_APP_API_URL}/permission`,
		name: "保存权限",
		post: async function(id,data={}){
			return await http.post(this.url + '/' + id, data);
		}
	}, 
    destroy: {
		url: `${process.env.VUE_APP_API_URL}/role/destroy`,
		name: "删除角色",
		post: async function(id,data){
			return await http.post(this.url + '/' + id, data);
		}
	},
}
