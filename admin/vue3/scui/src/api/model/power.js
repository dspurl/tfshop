import http from "@/utils/request"
export default {
	list: {
		url: `${process.env.VUE_APP_API_URL}/power`,
		name: "权限列表",
		get: async function(data={}){
			return await http.get(this.url, data);
		}
	},
	create: {
		url: `${process.env.VUE_APP_API_URL}/power`,
		name: "创建权限",
		post: async function(data={}){
			return await http.post(this.url, data);
		}
	},
	edit: {
		url: `${process.env.VUE_APP_API_URL}/power`,
		name: "保存权限",
		post: async function(data={}){
			return await http.post(this.url + '/' + data.id, data);
		}
	},
	sort: {
		url: `${process.env.VUE_APP_API_URL}/power/sort/all`,
		name: "权限排序",
		post: async function(data={}){
			return await http.post(this.url, data);
		}
	},
    destroy: {
		url: `${process.env.VUE_APP_API_URL}/power/destroy`,
		name: "删除权限",
		post: async function(id,data){
			return await http.post(this.url + '/' + id, data);
		}
	},
}
