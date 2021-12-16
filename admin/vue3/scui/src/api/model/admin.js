import http from "@/utils/request"
export default {
	list: {
		url: `${process.env.VUE_APP_API_URL}/admin`,
		name: "管理员列表",
		get: async function(data={}){
			return await http.get(this.url, data);
		}
	},
	create: {
		url: `${process.env.VUE_APP_API_URL}/admin`,
		name: "创建管理员",
		post: async function(data={}){
			return await http.post(this.url, data);
		}
	},
	edit: {
		url: `${process.env.VUE_APP_API_URL}/admin`,
		name: "保存管理员",
		post: async function(data={}){
			return await http.post(this.url + '/' + data.id, data);
		}
	},
    destroy: {
		url: `${process.env.VUE_APP_API_URL}/admin/destroy`,
		name: "删除管理员",
		post: async function(id,data){
			return await http.post(this.url + '/' + id, data);
		}
	},
}
