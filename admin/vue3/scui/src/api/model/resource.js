import http from "@/utils/request"
export default {
	list: {
		url: `${process.env.VUE_APP_API_URL}/resource`,
		name: "资源列表",
		get: async function (data = {}) {
			return await http.get(this.url, data);
		}
	},
	create: {
		url: `${process.env.VUE_APP_API_URL}/resource`,
		name: "上传资源",
		post: async function (data = {}) {
			return await http.post(this.url, data);
		}
	},
	cover: {
		url: `${process.env.VUE_APP_API_URL}/resource/cover`,
		name: "资源设置封面",
		post: async function (id, data = {}) {
			return await http.post(this.url + '/' + id, data);
		}
	},
	depict: {
		url: `${process.env.VUE_APP_API_URL}/resource/depict`,
		name: "资源设置别名",
		post: async function (id, data = {}) {
			return await http.post(this.url + '/' + id, data);
		}
	},
	group: {
		url: `${process.env.VUE_APP_API_URL}/resource/group`,
		name: "资源设置分组",
		post: async function (data = {}) {
			return await http.post(this.url, data);
		}
	},
	destroy: {
		url: `${process.env.VUE_APP_API_URL}/resource/destroy`,
		name: "删除资源",
		post: async function (id, data) {
			return await http.post(this.url + '/' + id, data);
		}
	},
}
