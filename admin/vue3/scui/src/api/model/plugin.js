import http from "@/utils/request";
export default {
	list: {
		url: `${process.env.VUE_APP_API_URL}/plugin`,
		name: "插件列表",
		get: async function (data = {}) {
			return await http.get(this.url, data);
		},
	},
	install: {
		url: `${process.env.VUE_APP_API_URL}/plugin`,
		name: "插件安装",
		get: async function (name = "") {
			return await http.get(this.url + "/install/" + name);
		},
	},
	create: {
		url: `${process.env.VUE_APP_API_URL}/plugin`,
		name: "创建插件",
		post: async function (data = {}) {
			return await http.post(this.url, data);
		},
	},
	edit: {
		url: `${process.env.VUE_APP_API_URL}/plugin`,
		name: "保存插件",
		post: async function (data = {}) {
			return await http.post(this.url + "/" + data.abbreviation, data);
		},
	},
	publish: {
		url: `${process.env.VUE_APP_API_URL}/plugin`,
		name: "插件发行",
		post: async function (name = "") {
			return await http.post(this.url + "/publish/" + name);
		},
	},
	updatePack: {
		url: `${process.env.VUE_APP_API_URL}/plugin`,
		name: "插件在线下载/更新",
		post: async function (code = "", data = {}) {
			return await http.post(this.url + "/updatePack/" + code, data);
		},
	},
	details: {
		url: `${process.env.VUE_APP_API_URL}/plugin`,
		name: "插件详情",
		get: async function (name = "") {
			return await http.get(this.url + "/" + name);
		},
	},
	destroy: {
		url: `${process.env.VUE_APP_API_URL}/plugin/destroy`,
		name: "插件删除",
		post: async function (name = "") {
			return await http.post(this.url + "/" + name);
		},
	},
	uninstall: {
		url: `${process.env.VUE_APP_API_URL}/plugin/uninstall`,
		name: "插件卸载",
		post: async function (name = "") {
			return await http.post(this.url + "/" + name);
		},
	},
	routes: {
		url: `${process.env.VUE_APP_API_URL}/plugin/routes/no_get`,
		name: "获取路由列表",
		get: async function () {
			return await http.get(this.url);
		},
	},
	models: {
		url: `${process.env.VUE_APP_API_URL}/plugin/models/all`,
		name: "获取模型列表",
		get: async function () {
			return await http.get(this.url);
		},
	},
	template: {
		url: `${process.env.VUE_APP_API_URL}/plugin/template`,
		name: "获取模板列表",
		get: async function (name = "") {
			return await http.get(this.url + "/" + name);
		},
	},
	jurisdiction: {
		url: `${process.env.VUE_APP_API_URL}/plugin/jurisdiction/all`,
		name: "获取权限列表",
		post: async function () {
			return await http.post(this.url);
		},
	},
	diff: {
		url: `${process.env.VUE_APP_API_URL}/plugin/diff`,
		name: "获取冲突文件列表",
		get: async function (name = "") {
			return await http.get(this.url + "/" + name);
		},
	},
	conflictResolution: {
		url: `${process.env.VUE_APP_API_URL}/plugin/conflictResolution`,
		name: "冲突处理",
		post: async function (name = "") {
			return await http.post(this.url + "/" + name);
		},
	},
	installList: {
		url: `${process.env.VUE_APP_API_URL}/plugin/installList/all`,
		name: "获取安装的插件列表",
		get: async function () {
			return await http.get(this.url);
		},
	},
};
